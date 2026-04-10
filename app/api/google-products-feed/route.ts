/**
 * Google Merchant Center — Primary Product Feed
 * Format: RSS 2.0 XML with g: namespace
 * Feed URL: /api/google-products-feed
 *
 * Fixes applied (vs. previous version):
 *  • Weight: multi-source extraction with name-parsing fallback (parseWeightFromText)
 *  • Brand: meta fields → product attributes → store default (no longer checks category name)
 *  • item_group_id: emitted for every variation so Google can group them
 *  • google_product_category: mapped from WC categories via shared taxonomy map
 *  • availability_date: only emitted for backorder/out-of-stock products
 *  • All shared logic lives in lib/feeds/feed-utils.ts — edit once, fixes all feeds
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { fetchWooCommerceCached } from '@/lib/woocommerce/api';
import {
  type WooFeedProduct,
  extractGTIN,
  extractWeightGrams,
  extractBrand,
  getAvailability,
  getAvailabilityDate,
  getGoogleCategory,
  cleanDescription,
  formatPriceSEK,
  parsePriceNum,
  escapeXml,
  cdata,
} from '@/lib/feeds/feed-utils';

// ---------------------------------------------------------------------------
// Store / shipping config
// ---------------------------------------------------------------------------
const CURRENCY = 'SEK';
const STOCKHOLM_FREE_THRESHOLD = 500;
const STOCKHOLM_FLAT_FEE = 30;
const STOCKHOLM_FLAT_MIN = 300;
const STOCKHOLM_FLAT_MAX = 499;

// ---------------------------------------------------------------------------
// Shipping XML block
// ---------------------------------------------------------------------------
function shippingXML(price: number): string {
  let xml = '';

  if (price >= STOCKHOLM_FREE_THRESHOLD) {
    xml += buildShipping('SE', 'Stockholm', 'Free Local Delivery', `0 ${CURRENCY}`);
  } else if (price >= STOCKHOLM_FLAT_MIN && price <= STOCKHOLM_FLAT_MAX) {
    xml += buildShipping('SE', 'Stockholm', 'Store Delivery', `${STOCKHOLM_FLAT_FEE} ${CURRENCY}`);
  }

  // Europe-wide DHL shipping (shown for all products)
  xml += buildShipping('DE', '', 'DHL International', `149 ${CURRENCY}`);
  xml += buildShipping('NO', '', 'DHL International', `149 ${CURRENCY}`);
  xml += buildShipping('DK', '', 'DHL International', `149 ${CURRENCY}`);
  xml += buildShipping('FI', '', 'DHL International', `149 ${CURRENCY}`);

  return xml;
}

function buildShipping(country: string, region: string, service: string, price: string): string {
  let xml = `    <g:shipping>\n`;
  xml += `      <g:country>${country}</g:country>\n`;
  if (region) xml += `      <g:region>${region}</g:region>\n`;
  xml += `      <g:service>${service}</g:service>\n`;
  xml += `      <g:price>${price}</g:price>\n`;
  xml += `    </g:shipping>\n`;
  return xml;
}

// ---------------------------------------------------------------------------
// Per-product XML generation
// ---------------------------------------------------------------------------
function generateProductXML(product: WooFeedProduct, parent?: WooFeedProduct): string {
  const price = parsePriceNum(product.price);
  if (price <= 0) return '';

  const root = parent ?? product;
  const availability = getAvailability(product);
  const availabilityDate = getAvailabilityDate(product);
  const gtin = extractGTIN(product);
  const brand = extractBrand(root);
  const googleCategory = getGoogleCategory(root.categories ?? product.categories);
  const sku = product.sku || `PRODUCT_${product.id}`;
  const description = cleanDescription(product, parent);
  const productLink = `${siteConfig.site_domain}/product/${root.slug || root.id}`;

  // Images — variation `image` (singular) takes priority, fall back to parent images[]
  const primaryImage = product.image?.src
    ?? (product.images?.length ? product.images[0].src : null)
    ?? (root.images?.length ? root.images[0].src : null);
  if (!primaryImage) return ''; // skip products with no image

  const additionalImages: string[] = [];
  const imageList = product.images?.length ? product.images : (root.images ?? []);
  for (const img of imageList.slice(1, 10)) {
    additionalImages.push(img.src);
  }

  // Weight
  const weightGrams = extractWeightGrams(product)
    ?? (parent ? extractWeightGrams(parent) : null);

  // Sale pricing
  const saleNum = parsePriceNum(product.sale_price);
  const regularNum = parsePriceNum(product.regular_price);
  const hasSale = saleNum > 0 && regularNum > 0 && saleNum < regularNum;

  // Sale date window
  const today = new Date().toISOString().split('T')[0];
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  let saleFrom = today, saleTo = in30Days;
  if (product.date_on_sale_from) {
    try { saleFrom = new Date(product.date_on_sale_from).toISOString().split('T')[0]; } catch { /* keep default */ }
  }
  if (product.date_on_sale_to) {
    try { saleTo = new Date(product.date_on_sale_to).toISOString().split('T')[0]; } catch { /* keep default */ }
  }

  let xml = `  <item>\n`;

  // --- Required fields ---
  xml += `    <g:id>${product.id}</g:id>\n`;
  xml += `    <title>${cdata(product.name || root.name)}</title>\n`;
  xml += `    <description>${cdata(description)}</description>\n`;
  xml += `    <link>${escapeXml(productLink)}</link>\n`;
  xml += `    <g:condition>new</g:condition>\n`;
  xml += `    <g:availability>${availability}</g:availability>\n`;

  // availability_date only for non-in-stock products
  if (availabilityDate) {
    xml += `    <g:availability_date>${availabilityDate}</g:availability_date>\n`;
  }

  // --- Pricing ---
  if (hasSale) {
    xml += `    <g:price>${formatPriceSEK(product.regular_price, CURRENCY)}</g:price>\n`;
    xml += `    <g:sale_price>${formatPriceSEK(product.sale_price, CURRENCY)}</g:sale_price>\n`;
    xml += `    <g:sale_price_effective_date>${saleFrom}T00:00:00+01:00/${saleTo}T23:59:59+01:00</g:sale_price_effective_date>\n`;
  } else {
    xml += `    <g:price>${formatPriceSEK(product.price, CURRENCY)}</g:price>\n`;
  }

  // --- Images ---
  xml += `    <g:image_link>${escapeXml(primaryImage)}</g:image_link>\n`;
  for (const imgSrc of additionalImages) {
    xml += `    <g:additional_image_link>${escapeXml(imgSrc)}</g:additional_image_link>\n`;
  }

  // --- Identifiers ---
  xml += `    <g:brand>${cdata(brand)}</g:brand>\n`;
  if (gtin) {
    xml += `    <g:gtin>${gtin}</g:gtin>\n`;
  } else {
    xml += `    <g:identifier_exists>false</g:identifier_exists>\n`;
  }
  xml += `    <g:mpn>${cdata(sku)}</g:mpn>\n`;

  // --- Category ---
  xml += `    <g:google_product_category>${googleCategory}</g:google_product_category>\n`;

  // --- Variations: item_group_id groups variants together in Merchant Center ---
  if (parent) {
    xml += `    <g:item_group_id>${parent.id}</g:item_group_id>\n`;
    // Emit variation-specific attributes (size, weight, flavour, etc.)
    for (const attr of product.attributes) {
      if (attr.option) {
        const attrName = attr.name.toLowerCase();
        if (attrName === 'size' || attrName === 'storlek') {
          xml += `    <g:size>${cdata(attr.option)}</g:size>\n`;
        } else if (attrName === 'color' || attrName === 'colour' || attrName === 'färg') {
          xml += `    <g:color>${cdata(attr.option)}</g:color>\n`;
        }
      }
    }
  }

  // --- Shipping weight (only when we have a valid value) ---
  if (weightGrams !== null && weightGrams > 0) {
    xml += `    <g:shipping_weight>${weightGrams} g</g:shipping_weight>\n`;
  }

  // --- Shipping rules ---
  xml += shippingXML(price);

  // --- Custom labels ---
  xml += `    <g:custom_label_0>DHL_WEIGHT_BASED_SHIPPING</g:custom_label_0>\n`;
  xml += `    <g:custom_label_1>STOCKHOLM_LOCAL_DELIVERY</g:custom_label_1>\n`;

  // --- Promotions (only applicable ones) ---
  if (hasSale) {
    xml += `    <g:promotion_id>WEEKLY_DEALS</g:promotion_id>\n`;
  }
  if (price >= STOCKHOLM_FREE_THRESHOLD) {
    xml += `    <g:promotion_id>FREE_DELIVERY_500</g:promotion_id>\n`;
  }

  xml += `  </item>\n`;
  return xml;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    // --- Fetch all published products (paginated) ---
    let rawProducts: WooFeedProduct[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const batch = await fetchWooCommerceCached<WooFeedProduct[]>(
        `/products?status=publish&per_page=100&page=${page}`,
        3600,
        ['products', 'google-feed', `page-${page}`]
      );
      if (batch.length > 0) {
        rawProducts = rawProducts.concat(batch);
        page++;
        if (batch.length < 100) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    console.log(`[google-feed] fetched ${rawProducts.length} products across ${page - 1} pages`);

    // --- Expand variable products into their variations ---
    const feedProducts: Array<{ product: WooFeedProduct; parent?: WooFeedProduct }> = [];

    for (const product of rawProducts) {
      if (product.type === 'variable' && product.variations?.length) {
        for (const variationId of product.variations) {
          try {
            const variation = await fetchWooCommerceCached<WooFeedProduct>(
              `/products/${product.id}/variations/${variationId}`,
              3600,
              ['products', 'variations', 'google-feed']
            );
            // Inherit parent data the variation lacks
            feedProducts.push({
              product: {
                ...variation,
                parent_id: product.id,
                // Inherit parent slug so product URL resolves correctly
                slug: variation.slug || product.slug,
                // Merge description: prefer variation's own, fall back to parent
                description: variation.description || product.description,
                short_description: variation.description || product.short_description,
                categories: product.categories,
                // Inherit parent weight when variation has none
                weight: variation.weight || product.weight,
                // Prefer variation images; fall back to parent images
                images: variation.images?.length ? variation.images : product.images,
                image: variation.image ?? undefined,
              },
              parent: product,
            });
          } catch (err) {
            console.error(`[google-feed] variation ${variationId} fetch error:`, err);
          }
        }
      } else {
        feedProducts.push({ product });
      }
    }

    // --- Build XML ---
    const timestamp = new Date().toISOString();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<!-- Generated: ${timestamp} | Products: ${feedProducts.length} -->\n`;
    xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n`;
    xml += `  <channel>\n`;
    xml += `    <title>${cdata(`${siteConfig.site_name} — Product Feed`)}</title>\n`;
    xml += `    <link>${escapeXml(siteConfig.site_domain)}</link>\n`;
    xml += `    <description>${cdata('Google Merchant Center product feed — Europe-wide shipping')}</description>\n`;

    let emitted = 0;
    for (const { product, parent } of feedProducts) {
      const item = generateProductXML(product, parent);
      if (item) {
        xml += item;
        emitted++;
      }
    }

    xml += `  </channel>\n</rss>`;

    console.log(`[google-feed] emitted ${emitted} items`);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Feed-Count': String(emitted),
      },
    });
  } catch (error) {
    console.error('[google-feed] generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}
