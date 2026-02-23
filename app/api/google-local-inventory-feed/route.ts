/**
 * Google Merchant Center - Local Inventory Feed
 * Generates XML feed for local inventory ads (Sweden physical store)
 * Feed URL: /api/google-local-inventory-feed
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { fetchWooCommerceCached } from '@/lib/woocommerce/api';
import { WC_API_CONFIG } from '@/lib/woocommerce/config';

// Settings (match WordPress snippet defaults)
const STORE_CODE = '12397410391306859227'; // Google Merchant store code
const CURRENCY = 'SEK';

// Strip characters that are illegal in XML 1.0
function stripInvalidXmlChars(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\uFFFE\uFFFF]/g, '');
}

// Safe CDATA wrap
function cdata(str: string): string {
  return `<![CDATA[${stripInvalidXmlChars(str).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

// Format price with 2 decimal places
function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (!num || isNaN(num) || num <= 0) return '';
  return num.toFixed(2);
}

interface WooProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_to: string | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  manage_stock: boolean;
  type: string;
  variations?: number[];
  meta_data: Array<{ key: string; value: any }>;
  attributes: Array<{ name: string; options: string[] }>;
}

// Get availability status for local inventory
function getLocalAvailability(product: WooProduct): string {
  // Check for "On Display to Order" attribute
  const odoAttribute = product.attributes.find(
    attr => attr.name.toLowerCase().includes('store availability')
  );
  if (odoAttribute?.options.some(opt => opt.toLowerCase().includes('on display to order'))) {
    return 'on_display_to_order';
  }

  switch (product.stock_status) {
    case 'outofstock':
      return 'out_of_stock';
    case 'onbackorder':
      return 'backorder';
    case 'instock':
      return 'in_stock';
    default:
      return 'out_of_stock';
  }
}

// Get availability date (required for certain statuses)
function getAvailabilityDate(product: WooProduct, availability: string): string | null {
  if (availability === 'on_display_to_order' || availability === 'backorder' || availability === 'preorder') {
    const availabilityDate = product.meta_data.find(m => m.key === '_availability_date');
    if (availabilityDate?.value) {
      return new Date(availabilityDate.value).toISOString().split('T')[0];
    }

    // Default to 2 weeks
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  }

  if (availability === 'out_of_stock') {
    const restockDate = product.meta_data.find(m => m.key === '_restock_date');
    if (restockDate?.value) {
      return new Date(restockDate.value).toISOString().split('T')[0];
    }
  }

  return null;
}

// Generate XML item for local inventory
function generateLocalInventoryXML(product: WooProduct): string {
  const price = parseFloat(product.price);
  if (!price || price <= 0) return '';

  const availability = getLocalAvailability(product);
  const availabilityDate = getAvailabilityDate(product, availability);

  let xml = `  <item>\n`;
  xml += `    <g:id>${product.id}</g:id>\n`;
  xml += `    <g:store_code>${STORE_CODE}</g:store_code>\n`;
  xml += `    <g:availability>${availability}</g:availability>\n`;

  // Add availability_date if required
  if (availabilityDate) {
    xml += `    <g:availability_date>${availabilityDate}</g:availability_date>\n`;
  }

  // Price and sale price logic for local
  const saleNum = parseFloat(product.sale_price);
  const regularNum = parseFloat(product.regular_price);
  if (product.sale_price && saleNum > 0 && regularNum > 0) {
    xml += `    <g:price>${formatPrice(product.regular_price)} ${CURRENCY}</g:price>\n`;
    xml += `    <g:sale_price>${formatPrice(product.sale_price)} ${CURRENCY}</g:sale_price>\n`;

    // Effective dates for local deals — rolling 30-day window when WC dates not set
    const today = new Date().toISOString().split('T')[0];
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const from = product.date_on_sale_from ? new Date(product.date_on_sale_from).toISOString().split('T')[0] : today;
    const to = product.date_on_sale_to ? new Date(product.date_on_sale_to).toISOString().split('T')[0] : in30Days;
    xml += `    <g:sale_price_effective_date>${from}T00:00:00+01:00/${to}T23:59:59+01:00</g:sale_price_effective_date>\n`;
  } else {
    xml += `    <g:price>${formatPrice(product.price)} ${CURRENCY}</g:price>\n`;
  }

  // Add quantity if stock is managed
  if (product.manage_stock && product.stock_quantity !== null && product.stock_quantity > 0) {
    xml += `    <g:quantity>${product.stock_quantity}</g:quantity>\n`;
  }

  // Pickup information
  xml += `    <g:pickup_method>buy</g:pickup_method>\n`;
  xml += `    <g:pickup_sla>same day</g:pickup_sla>\n`;

  xml += `  </item>\n`;

  return xml;
}

export async function GET() {
  try {
    // Fetch all products with pagination
    let allFetchedProducts: WooProduct[] = [];
    let page = 1;
    let hasMorePages = true;

    // Fetch all pages of products
    while (hasMorePages) {
      const products: WooProduct[] = await fetchWooCommerceCached(
        `/products?status=publish&per_page=100&page=${page}`,
        3600, // Cache for 1 hour
        ['products', 'google-local-feed', `page-${page}`]
      );

      if (products.length > 0) {
        allFetchedProducts = [...allFetchedProducts, ...products];
        page++;

        // If we got less than 100 products, we've reached the last page
        if (products.length < 100) {
          hasMorePages = false;
        }
      } else {
        hasMorePages = false;
      }
    }

    console.log(`Fetched ${allFetchedProducts.length} products from ${page - 1} pages`);

    // Fetch variations for variable products
    const allProducts: WooProduct[] = [];
    for (const product of allFetchedProducts) {
      if (product.type === 'variable' && product.variations && product.variations.length > 0) {
        // Fetch variations
        for (const variationId of product.variations) {
          try {
            const variation = await fetchWooCommerceCached<WooProduct>(
              `/products/${product.id}/variations/${variationId}`,
              3600,
              ['products', 'variations', 'google-local-feed']
            );
            allProducts.push({
              ...variation,
              attributes: [...(product.attributes || []), ...(variation.attributes || [])]
            });
          } catch (error) {
            console.error(`Error fetching variation ${variationId}:`, error);
          }
        }
      } else {
        allProducts.push(product);
      }
    }

    // Generate XML feed
    const timestamp = new Date().toISOString();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<!-- Generated on: ${timestamp} -->\n`;
    xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n`;
    xml += `  <channel>\n`;
    xml += `    <title>${cdata(siteConfig.site_name + ' - Local Inventory Feed (Sweden Store)')}</title>\n`;
    xml += `    <link>${siteConfig.site_domain}</link>\n`;
    xml += `    <description>${cdata('Local inventory feed for Swedish physical store with pickup options')}</description>\n`;

    // Add products
    for (const product of allProducts) {
      xml += generateLocalInventoryXML(product);
    }

    xml += `  </channel>\n`;
    xml += `</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating local inventory feed:', error);
    return NextResponse.json(
      { error: 'Failed to generate feed' },
      { status: 500 }
    );
  }
}
