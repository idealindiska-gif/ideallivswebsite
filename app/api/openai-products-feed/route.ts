/**
 * OpenAI Agentic Commerce - Product Feed
 * Generates JSON feed for ChatGPT shopping discovery and checkout
 * Feed URL: /api/openai-products-feed
 * Spec: openaifeedspec.md
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { fetchWooCommerceCached } from '@/lib/woocommerce/api';

const BRAND = 'Ideal Indiska Livs';
const CURRENCY = 'SEK';
const STORE_COUNTRY = 'SE';
// Countries the store ships to
const TARGET_COUNTRIES = ['SE', 'NO', 'DK', 'FI', 'DE', 'NL', 'BE', 'FR', 'IT', 'ES', 'PL'];

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
  slug: string;
  images: Array<{ src: string; alt?: string }>;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  weight: string;
  type: string;
  variations?: number[];
  parent_id?: number;
  meta_data: Array<{ key: string; value: any }>;
  attributes: Array<{ name: string; option?: string; options?: string[] }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  average_rating?: string;
  rating_count?: number;
  related_ids?: number[];
}

function getGTIN(product: WooProduct): string {
  const gtinKeys = [
    '_global_unique_id', 'barcode', '_barcode', 'gtin', '_gtin', '_ean', '_upc',
    '_wpm_gtin_code', '_product_gtin', '_wc_gtin', 'ean', 'upc', '_alg_ean',
    '_ean_code', '_ywbc_barcode_value', '_vi_ean', '_woocommerce_gtin', '_product_barcode',
  ];
  for (const key of gtinKeys) {
    const meta = product.meta_data.find((m) => m.key === key);
    if (meta?.value && /^\d{8,14}$/.test(String(meta.value).trim())) {
      return String(meta.value).trim();
    }
  }
  return '';
}

function getAvailability(product: WooProduct): string {
  switch (product.stock_status) {
    case 'outofstock': return 'out_of_stock';
    case 'onbackorder': return 'backorder';
    case 'instock': return 'in_stock';
    default: return 'out_of_stock';
  }
}

function formatPrice(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return '';
  return `${num.toFixed(2)} ${CURRENCY}`;
}

function getCategoryPath(categories: Array<{ name: string }>): string {
  if (!categories?.length) return 'Grocery';
  return categories.map((c) => c.name).join(' > ');
}

function getBrand(product: WooProduct): string {
  const brandMeta = product.meta_data.find((m) =>
    ['_brand', 'brand', '_wc_brand', '_product_brand'].includes(m.key)
  );
  if (brandMeta?.value) return String(brandMeta.value);
  return BRAND;
}

function buildEntry(
  product: WooProduct,
  parent?: WooProduct
): Record<string, any> | null {
  const price = parseFloat(product.price);
  if (!price || price <= 0) return null;

  const root = parent ?? product;
  const productUrl = `${siteConfig.site_domain}/product/${root.slug || root.id}`;

  let description =
    product.description ||
    root.description ||
    product.short_description ||
    root.short_description ||
    `Quality grocery product from ${BRAND}`;
  description = description.replace(/<[^>]*>/g, '').trim();
  if (description.length > 5000) description = description.substring(0, 4997) + '...';

  const gtin = getGTIN(product);
  const sku = product.sku || `PRODUCT_${product.id}`;
  const availability = getAvailability(product);
  const brand = getBrand(root);

  // Images — fall back to parent images for variations
  const images = product.images?.length ? product.images : (root.images ?? []);
  const imageUrl = images[0]?.src;
  if (!imageUrl) return null;
  const additionalImages = images.slice(1).map((img) => img.src).join(',');

  // Variant attributes for variations
  const variantDict: Record<string, string> = {};
  if (parent && product.attributes) {
    product.attributes.forEach((attr) => {
      if (attr.option) variantDict[attr.name] = attr.option;
    });
  }

  const isVariation = !!parent;
  const title = isVariation && Object.keys(variantDict).length
    ? `${root.name} - ${Object.values(variantDict).join(', ')}`
    : root.name;

  const entry: Record<string, any> = {
    // OpenAI flags
    is_eligible_search: true,
    is_eligible_checkout: true,

    // Basic product data
    item_id: String(product.id),
    title,
    description,
    url: productUrl,

    // Item info
    brand,
    condition: 'new',
    product_category: getCategoryPath(root.categories ?? product.categories),

    // Media
    image_url: imageUrl,
    ...(additionalImages && { additional_image_urls: additionalImages }),

    // Pricing
    price: formatPrice(product.price),
    ...(product.sale_price && parseFloat(product.sale_price) > 0 && {
      sale_price: formatPrice(product.sale_price),
      ...(product.date_on_sale_from && {
        sale_price_start_date: new Date(product.date_on_sale_from).toISOString().split('T')[0],
      }),
      ...(product.date_on_sale_to && {
        sale_price_end_date: new Date(product.date_on_sale_to).toISOString().split('T')[0],
      }),
    }),

    // Availability
    availability,
    ...(availability === 'backorder' && {
      availability_date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d.toISOString().split('T')[0];
      })(),
    }),

    // Variants
    group_id: String(root.id),
    listing_has_variations: root.type === 'variable',
    ...(isVariation && Object.keys(variantDict).length && { variant_dict: variantDict }),

    // Physical attributes
    ...(product.weight && {
      weight: product.weight,
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

    // Reviews (when available)
    ...(product.average_rating &&
      parseFloat(product.average_rating) > 0 && {
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
    // Fetch all published products with pagination
    let allProducts: WooProduct[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const batch: WooProduct[] = await fetchWooCommerceCached(
        `/products?status=publish&per_page=100&page=${page}`,
        3600,
        ['products', 'openai-feed', `page-${page}`]
      );
      if (batch.length > 0) {
        allProducts = [...allProducts, ...batch];
        page++;
        if (batch.length < 100) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    const feedEntries: Record<string, any>[] = [];

    for (const product of allProducts) {
      if (product.type === 'variable' && product.variations?.length) {
        // Each variation becomes its own feed entry
        for (const variationId of product.variations) {
          try {
            const variation = await fetchWooCommerceCached<WooProduct>(
              `/products/${product.id}/variations/${variationId}`,
              3600,
              ['products', 'variations', 'openai-feed']
            );
            const entry = buildEntry(variation, product);
            if (entry) feedEntries.push(entry);
          } catch (err) {
            console.error(`Error fetching variation ${variationId}:`, err);
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
    console.error('Error generating OpenAI product feed:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}
