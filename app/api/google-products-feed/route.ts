/**
 * Google Merchant Center - Primary Product Feed
 * Generates XML feed for Google Shopping with Europe-wide shipping
 * Feed URL: /api/google-products-feed
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { fetchWooCommerceCached } from '@/lib/woocommerce/api';
import { WC_API_CONFIG } from '@/lib/woocommerce/config';

// Settings (match WordPress snippet defaults)
const BRAND = 'Ideal Indiska Livs';
const STOCKHOLM_FREE_THRESHOLD = 500;
const STOCKHOLM_DELIVERY_COST = 30;
const STOCKHOLM_DELIVERY_MIN = 300;
const STOCKHOLM_DELIVERY_MAX = 499;
const CURRENCY = 'SEK';

interface WooProduct {
  id: number;
  name: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_to: string | null;
  permalink: string;
  slug: string;
  images: Array<{ src: string }>;
  image?: { src: string };          // variations use singular image, not images[]
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  weight: string;
  manage_stock: boolean;
  type: string;
  variations?: number[];
  parent_id?: number;
  meta_data: Array<{ key: string; value: any }>;
  attributes: Array<{ name: string; options: string[] }>;
  categories: Array<{ id: number; name: string }>;
}

// Get GTIN from product meta data
function getGTIN(product: WooProduct): string {
  const gtinKeys = [
    '_global_unique_id', 'barcode', '_barcode', 'gtin', '_gtin', '_ean', '_upc', '_isbn',
    '_wpm_gtin_code', '_product_gtin', '_wc_gtin', 'ean', 'upc', 'isbn', '_alg_ean',
    '_ean_code', '_ywbc_barcode_value', '_vi_ean', '_woocommerce_gtin', '_product_barcode'
  ];

  for (const key of gtinKeys) {
    const meta = product.meta_data.find(m => m.key === key);
    if (meta?.value && /^\d{8,14}$/.test(String(meta.value).trim())) {
      return String(meta.value).trim();
    }
  }

  return '';
}

// Get availability status
function getAvailability(product: WooProduct): string {
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

// Get availability date (required for backorder/preorder)
function getAvailabilityDate(product: WooProduct): string {
  const availabilityDate = product.meta_data.find(m => m.key === '_availability_date');
  if (availabilityDate?.value) {
    return new Date(availabilityDate.value).toISOString().split('T')[0];
  }

  if (product.stock_status === 'onbackorder') {
    const backorderDate = product.meta_data.find(m => m.key === '_backorder_date');
    if (backorderDate?.value) {
      return new Date(backorderDate.value).toISOString().split('T')[0];
    }
    // Default 2 weeks for backorders
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  }

  // Default to next day for in-stock items
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

// Strip characters that are illegal in XML 1.0
function stripInvalidXmlChars(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\uFFFE\uFFFF]/g, '');
}

// Escape XML special characters
function escapeXml(unsafe: string): string {
  return stripInvalidXmlChars(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Safe CDATA wrap — escapes the ]]> sequence that would break CDATA sections
function cdata(str: string): string {
  return `<![CDATA[${stripInvalidXmlChars(str).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

// Format price with 2 decimal places
function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (!num || isNaN(num) || num <= 0) return '';
  return num.toFixed(2);
}

// Generate shipping XML for a product
function getShippingXML(price: number): string {
  let xml = '';

  if (price >= STOCKHOLM_FREE_THRESHOLD) {
    xml += `    <g:shipping>\n`;
    xml += `      <g:country>SE</g:country>\n`;
    xml += `      <g:region>Stockholm</g:region>\n`;
    xml += `      <g:service>Free Local Delivery</g:service>\n`;
    xml += `      <g:price>0 ${CURRENCY}</g:price>\n`;
    xml += `    </g:shipping>\n`;
  } else if (price >= STOCKHOLM_DELIVERY_MIN && price <= STOCKHOLM_DELIVERY_MAX) {
    xml += `    <g:shipping>\n`;
    xml += `      <g:country>SE</g:country>\n`;
    xml += `      <g:region>Stockholm</g:region>\n`;
    xml += `      <g:service>Store Delivery</g:service>\n`;
    xml += `      <g:price>${STOCKHOLM_DELIVERY_COST} ${CURRENCY}</g:price>\n`;
    xml += `    </g:shipping>\n`;
  }

  return xml;
}

// Generate XML item for a product
function generateProductXML(product: WooProduct): string {
  const price = parseFloat(product.price);
  if (!price || price <= 0) return '';

  const availability = getAvailability(product);
  const availabilityDate = getAvailabilityDate(product);
  const gtin = getGTIN(product);
  const sku = product.sku || `PRODUCT_${product.id}`;

  // Clean description
  let description = product.description || product.short_description || `Quality product from ${BRAND}`;
  description = description.replace(/<[^>]*>/g, '').trim();
  if (description.length > 5000) {
    description = description.substring(0, 4997) + '...';
  }

  // Get brand from categories or use default
  const brandCategory = product.categories.find(cat =>
    cat.name.toLowerCase().includes('brand')
  );
  const brand = brandCategory?.name || BRAND;

  // Transform permalink to frontend URL (prevent crm links in Google Shopping)
  const productLink = `${siteConfig.site_domain}/product/${product.slug || product.id}`;

  let xml = `  <item>\n`;
  xml += `    <g:id>${product.id}</g:id>\n`;
  xml += `    <title>${cdata(product.name)}</title>\n`;
  xml += `    <description>${cdata(description)}</description>\n`;
  xml += `    <link>${escapeXml(productLink)}</link>\n`;
  xml += `    <g:condition>new</g:condition>\n`;
  xml += `    <g:availability>${availability}</g:availability>\n`;
  xml += `    <g:availability_date>${availabilityDate}</g:availability_date>\n`;

  // Price and sale price
  const saleNum = parseFloat(product.sale_price);
  const regularNum = parseFloat(product.regular_price);
  if (product.sale_price && saleNum > 0 && regularNum > 0) {
    xml += `    <g:price>${formatPrice(product.regular_price)} ${CURRENCY}</g:price>\n`;
    xml += `    <g:sale_price>${formatPrice(product.sale_price)} ${CURRENCY}</g:sale_price>\n`;

    // Add sale_price_effective_date with timezone (CET = +01:00)
    const today = new Date().toISOString().split('T')[0];
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const saleFrom = product.date_on_sale_from
      ? new Date(product.date_on_sale_from).toISOString().split('T')[0]
      : today;
    const saleTo = product.date_on_sale_to
      ? new Date(product.date_on_sale_to).toISOString().split('T')[0]
      : in30Days;
    xml += `    <g:sale_price_effective_date>${saleFrom}T00:00:00+01:00/${saleTo}T23:59:59+01:00</g:sale_price_effective_date>\n`;
  } else {
    xml += `    <g:price>${formatPrice(product.price)} ${CURRENCY}</g:price>\n`;
  }

  // Image — variations return `image` (singular); parent products return `images[]`
  // Fall back through: variation image → parent images array → skip
  const primaryImage =
    product.image?.src ||
    (product.images && product.images.length > 0 ? product.images[0].src : null);
  if (primaryImage) {
    xml += `    <g:image_link>${escapeXml(primaryImage)}</g:image_link>\n`;
    // Additional images
    if (product.images && product.images.length > 1) {
      for (const img of product.images.slice(1, 10)) {
        xml += `    <g:additional_image_link>${escapeXml(img.src)}</g:additional_image_link>\n`;
      }
    }
  }

  // Brand
  xml += `    <g:brand>${cdata(brand)}</g:brand>\n`;

  // GTIN or identifier_exists
  if (gtin) {
    xml += `    <g:gtin>${gtin}</g:gtin>\n`;
  } else {
    xml += `    <g:identifier_exists>false</g:identifier_exists>\n`;
  }

  // MPN (SKU)
  if (sku) {
    xml += `    <g:mpn>${cdata(sku)}</g:mpn>\n`;
  } else if (!gtin) {
    xml += `    <g:mpn>PRODUCT_${product.id}</g:mpn>\n`;
  }

  // Weight
  if (product.weight) {
    const weight = `${product.weight} g`;
    xml += `    <g:shipping_weight>${weight}</g:shipping_weight>\n`;
    xml += `    <g:unit_pricing_measure>${weight}</g:unit_pricing_measure>\n`;
  }

  // Shipping
  xml += getShippingXML(price);

  // Custom labels
  xml += `    <g:custom_label_0>DHL_WEIGHT_BASED_SHIPPING</g:custom_label_0>\n`;
  xml += `    <g:custom_label_1>STOCKHOLM_LOCAL_DELIVERY</g:custom_label_1>\n`;

  // Promotions
  if (product.sale_price && parseFloat(product.sale_price) > 0) {
    xml += `    <g:promotion_id>WEEKLY_DEALS</g:promotion_id>\n`;
  }
  xml += `    <g:promotion_id>FREE_DELIVERY_500</g:promotion_id>\n`;

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
        ['products', 'google-feed', `page-${page}`]
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
              ['products', 'variations', 'google-feed']
            );
            allProducts.push({
              ...variation,
              parent_id: product.id,
              name: `${product.name} - ${variation.attributes?.map((a: any) => a.option).join(', ') || ''}`,
              description: variation.description || product.description,
              short_description: variation.description || product.short_description,
              categories: product.categories,
              slug: product.slug,
              // Variations return image (singular) — if missing, inherit parent images[]
              images: (variation.images && variation.images.length > 0)
                ? variation.images
                : product.images,
              image: variation.image ?? undefined,
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
    xml += `    <title>${cdata(siteConfig.site_name + ' - Primary Product Feed (Europe-wide Shipping)')}</title>\n`;
    xml += `    <link>${escapeXml(siteConfig.site_domain)}</link>\n`;
    xml += `    <description>${cdata('Primary product feed for Google Merchant Center with Europe-wide shipping')}</description>\n`;

    // Add products
    for (const product of allProducts) {
      xml += generateProductXML(product);
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
    console.error('Error generating Google Merchant feed:', error);
    return NextResponse.json(
      { error: 'Failed to generate feed' },
      { status: 500 }
    );
  }
}
