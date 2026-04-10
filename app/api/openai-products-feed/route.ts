/**
 * OpenAI Agentic Commerce — Product Feed
 * Format: JSON array
 * Feed URL: /api/openai-products-feed
 *
 * Uses shared lib/feeds/feed-utils.ts for all attribute extraction so
 * weight, brand, and availability logic stays in sync with the Google feed.
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
  parsePriceNum,
} from '@/lib/feeds/feed-utils';

const CURRENCY = 'SEK';
const STORE_COUNTRY = 'SE';
const TARGET_COUNTRIES = ['SE', 'NO', 'DK', 'FI', 'DE', 'NL', 'BE', 'FR', 'IT', 'ES', 'PL'];

function formatPrice(value: string | number): string {
  const num = parsePriceNum(value);
  if (num <= 0) return '';
  return `${num.toFixed(2)} ${CURRENCY}`;
}

function getCategoryPath(categories: WooFeedProduct['categories']): string {
  if (!categories?.length) return 'Grocery';
  return categories.map(c => c.name).join(' > ');
}

function buildEntry(product: WooFeedProduct, parent?: WooFeedProduct): Record<string, any> | null {
  const price = parsePriceNum(product.price);
  if (price <= 0) return null;

  const root = parent ?? product;
  const productUrl = `${siteConfig.site_domain}/product/${root.slug || root.id}`;

  // Images — variation images take priority, fall back to parent
  const images = product.images?.length ? product.images : (root.images ?? []);
  const imageUrl = product.image?.src ?? images[0]?.src;
  if (!imageUrl) return null;
  const additionalImageUrls = images.slice(1).map(img => img.src).join(',');

  const gtin = extractGTIN(product);
  const sku = product.sku || `PRODUCT_${product.id}`;
  const availability = getAvailability(product);
  const availabilityDate = getAvailabilityDate(product);
  const brand = extractBrand(root);
  const description = cleanDescription(product, parent);
  const weightGrams = extractWeightGrams(product) ?? (parent ? extractWeightGrams(parent) : null);

  // Variant attributes (for variations only)
  const variantDict: Record<string, string> = {};
  if (parent && product.attributes) {
    product.attributes.forEach(attr => {
      if (attr.option) variantDict[attr.name] = attr.option;
    });
  }

  const isVariation = !!parent;
  const title = isVariation && Object.keys(variantDict).length
    ? `${root.name} - ${Object.values(variantDict).join(', ')}`
    : (root.name || product.name);

  // Sale pricing
  const saleNum = parsePriceNum(product.sale_price);
  const regularNum = parsePriceNum(product.regular_price);
  const hasSale = saleNum > 0 && regularNum > 0 && saleNum < regularNum;

  const entry: Record<string, any> = {
    // OpenAI flags
    is_eligible_search: true,
    is_eligible_checkout: true,

    // Core fields
    item_id: String(product.id),
    title,
    description,
    url: productUrl,

    // Product info
    brand,
    condition: 'new',
    product_category: getCategoryPath(root.categories ?? product.categories),
    google_product_category: getGoogleCategory(root.categories ?? product.categories),

    // Media
    image_url: imageUrl,
    ...(additionalImageUrls && { additional_image_urls: additionalImageUrls }),

    // Pricing
    price: formatPrice(product.price),
    ...(hasSale && {
      sale_price: formatPrice(product.sale_price),
      ...(product.date_on_sale_from && {
        sale_price_start_date: (() => {
          try { return new Date(product.date_on_sale_from!).toISOString().split('T')[0]; } catch { return undefined; }
        })(),
      }),
      ...(product.date_on_sale_to && {
        sale_price_end_date: (() => {
          try { return new Date(product.date_on_sale_to!).toISOString().split('T')[0]; } catch { return undefined; }
        })(),
      }),
    }),

    // Availability — date only for non-in-stock
    availability,
    ...(availabilityDate && { availability_date: availabilityDate }),

    // Variants
    group_id: String(root.id),
    listing_has_variations: root.type === 'variable',
    ...(isVariation && Object.keys(variantDict).length && { variant_dict: variantDict }),

    // Physical attributes — only include when we have a valid weight
    ...(weightGrams !== null && weightGrams > 0 && {
      weight: String(weightGrams),
      item_weight_unit: 'g',
    }),

    // Identifiers
    ...(gtin && { gtin }),
    mpn: sku,

    // Merchant info
    seller_name: siteConfig.site_name,
    seller_url: siteConfig.site_domain,
    seller_privacy_policy: `${siteConfig.site_domain}/privacy-policy`,
    seller_tos: `${siteConfig.site_domain}/terms-conditions`,

    // Returns
    accepts_returns: true,
    return_deadline_in_days: 14,
    accepts_exchanges: false,
    return_policy: `${siteConfig.site_domain}/refund-return`,

    // Geo
    target_countries: TARGET_COUNTRIES,
    store_country: STORE_COUNTRY,

    // Reviews
    ...(product.average_rating && parsePriceNum(product.average_rating) > 0 && {
      star_rating: product.average_rating,
      review_count: product.rating_count ?? 0,
    }),

    // Related products
    ...(root.related_ids?.length && {
      related_product_id: root.related_ids.slice(0, 5).join(','),
      relationship_type: 'related',
    }),
  };

  return entry;
}

export async function GET() {
  try {
    let rawProducts: WooFeedProduct[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const batch = await fetchWooCommerceCached<WooFeedProduct[]>(
        `/products?status=publish&per_page=100&page=${page}`,
        3600,
        ['products', 'openai-feed', `page-${page}`]
      );
      if (batch.length > 0) {
        rawProducts = rawProducts.concat(batch);
        page++;
        if (batch.length < 100) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    const feedEntries: Record<string, any>[] = [];

    for (const product of rawProducts) {
      if (product.type === 'variable' && product.variations?.length) {
        for (const variationId of product.variations) {
          try {
            const variation = await fetchWooCommerceCached<WooFeedProduct>(
              `/products/${product.id}/variations/${variationId}`,
              3600,
              ['products', 'variations', 'openai-feed']
            );
            const merged: WooFeedProduct = {
              ...variation,
              parent_id: product.id,
              slug: variation.slug || product.slug,
              description: variation.description || product.description,
              short_description: variation.description || product.short_description,
              categories: product.categories,
              weight: variation.weight || product.weight,
              images: variation.images?.length ? variation.images : product.images,
              image: variation.image ?? undefined,
            };
            const entry = buildEntry(merged, product);
            if (entry) feedEntries.push(entry);
          } catch (err) {
            console.error(`[openai-feed] variation ${variationId} error:`, err);
          }
        }
      } else {
        const entry = buildEntry(product);
        if (entry) feedEntries.push(entry);
      }
    }

    return new NextResponse(JSON.stringify(feedEntries, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Feed-Count': String(feedEntries.length),
      },
    });
  } catch (error) {
    console.error('[openai-feed] generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}
