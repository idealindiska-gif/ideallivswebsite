/**
 * Shared Merchant Feed Utilities
 *
 * Single source of truth for all product feed logic (Google, OpenAI, etc.).
 * Fixes: missing weight, wrong brand extraction, missing item_group_id,
 * availability_date on in-stock items, missing google_product_category.
 */

// ---------------------------------------------------------------------------
// Shared product interface used by all feed routes
// ---------------------------------------------------------------------------
export interface WooFeedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_to: string | null;
  permalink: string;
  images: Array<{ src: string; alt?: string }>;
  image?: { src: string; alt?: string };   // variations use singular `image`
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  manage_stock: boolean;
  weight: string;
  dimensions?: { length: string; width: string; height: string };
  type: string;
  variations?: number[];
  parent_id?: number;
  meta_data: Array<{ key: string; value: any }>;
  attributes: Array<{ name: string; option?: string; options?: string[] }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags?: Array<{ id: number; name: string; slug: string }>;
  average_rating?: string;
  rating_count?: number;
  related_ids?: number[];
}

// ---------------------------------------------------------------------------
// Google Product Taxonomy mapping (WC category slug/name → Google ID)
// Ref: https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
// ---------------------------------------------------------------------------
const GOOGLE_CATEGORY_MAP: Record<string, string> = {
  // Grains & Rice
  rice: '5765',
  basmati: '5765',
  dal: '5765',
  lentil: '5765',
  lentils: '5765',
  pulses: '5765',
  flour: '5765',
  atta: '5765',
  grain: '5765',
  grains: '5765',
  // Spices
  spice: '6044',
  spices: '6044',
  masala: '6044',
  seasoning: '6044',
  herb: '6044',
  herbs: '6044',
  // Condiments & Sauces
  sauce: '1871',
  sauces: '1871',
  chutney: '1871',
  pickle: '1871',
  pickles: '1871',
  condiment: '1871',
  condiments: '1871',
  // Cooking Oils
  oil: '5764',
  oils: '5764',
  ghee: '5764',
  // Snacks
  snack: '2676',
  snacks: '2676',
  chips: '2676',
  biscuit: '2676',
  biscuits: '2676',
  cookie: '2676',
  cookies: '2676',
  namkeen: '2676',
  // Beverages
  drink: '413',
  drinks: '413',
  beverage: '413',
  beverages: '413',
  juice: '499676',
  tea: '1875',
  coffee: '7107',
  // Dairy
  dairy: '6761',
  cheese: '6761',
  yogurt: '6761',
  paneer: '6761',
  // Meat / Seafood
  meat: '5973',
  chicken: '5973',
  mutton: '5973',
  fish: '5973',
  seafood: '5973',
  // Frozen
  frozen: '5765',
  // Fresh produce
  vegetable: '5788',
  vegetables: '5788',
  fruit: '5917',
  fruits: '5917',
  // Sweet / Mithai
  sweet: '2676',
  sweets: '2676',
  mithai: '2676',
  chocolate: '1881',
};

/** Map WooCommerce categories to a Google product taxonomy ID. */
export function getGoogleCategory(categories: WooFeedProduct['categories']): string {
  for (const cat of categories) {
    const slug = cat.slug?.toLowerCase() ?? '';
    const name = cat.name?.toLowerCase() ?? '';

    // Direct slug match
    if (GOOGLE_CATEGORY_MAP[slug]) return GOOGLE_CATEGORY_MAP[slug];

    // Slug contains a key
    for (const [key, id] of Object.entries(GOOGLE_CATEGORY_MAP)) {
      if (slug.includes(key) || name.includes(key)) return id;
    }
  }
  // Default: generic grocery/food
  return '422'; // Food, Beverages & Tobacco > Food Items
}

// ---------------------------------------------------------------------------
// GTIN extraction
// ---------------------------------------------------------------------------
const GTIN_KEYS = [
  '_global_unique_id', 'barcode', '_barcode', 'gtin', '_gtin', '_ean', '_upc', '_isbn',
  '_wpm_gtin_code', '_product_gtin', '_wc_gtin', 'ean', 'upc', 'isbn', '_alg_ean',
  '_ean_code', '_ywbc_barcode_value', '_vi_ean', '_woocommerce_gtin', '_product_barcode',
];

/** Extract and validate a GTIN (8–14 digit numeric string) from product meta. */
export function extractGTIN(product: WooFeedProduct): string {
  for (const key of GTIN_KEYS) {
    const meta = product.meta_data.find(m => m.key === key);
    if (meta?.value) {
      const v = String(meta.value).trim();
      if (/^\d{8,14}$/.test(v)) return v;
    }
  }
  return '';
}

// ---------------------------------------------------------------------------
// Weight extraction — multi-source with name-parsing fallback
// ---------------------------------------------------------------------------
const WEIGHT_META_KEYS = ['_weight', 'weight_value', '_net_weight', 'net_weight', '_shipping_weight'];

/**
 * Extract shipping weight in grams from multiple sources:
 * 1. WooCommerce native `weight` field
 * 2. Known meta fields
 * 3. Parse from product name/title (e.g. "500g", "1 kg", "2.5 kg", "500 ml", "1 L")
 *
 * Returns the weight in grams, or null if not determinable.
 * The caller decides whether to apply a category-based default.
 */
export function extractWeightGrams(product: WooFeedProduct): number | null {
  // 1. Native WC weight field.
  //
  //    This store's WooCommerce weight unit is GRAMS (g), so the stored value
  //    is already in grams — e.g. a 500 g product is stored as "500".
  //
  //    The ONLY exception is decimal values (e.g. "0.5", "1.5") which almost
  //    certainly represent kg entered accidentally in the wrong unit — those
  //    we convert to grams via ×1000.
  //
  //    DO NOT apply a generic "< 10 → kg" heuristic: it breaks products like
  //    "1 g" (salt packets) or "5 g" (spice sachets) by inflating them ×1000.
  const wc = parseFloat(product.weight);
  if (!isNaN(wc) && wc > 0) {
    // Decimal → likely entered in kg by mistake (e.g. 0.5 = 500 g)
    if (!Number.isInteger(wc) && wc < 10) return Math.round(wc * 1000);
    // All integer values (and decimals ≥ 10) are already in grams
    return Math.round(wc);
  }

  // 2. Meta field weight keys
  for (const key of WEIGHT_META_KEYS) {
    const meta = product.meta_data.find(m => m.key === key);
    if (meta?.value) {
      const v = parseFloat(String(meta.value));
      if (!isNaN(v) && v > 0) {
        if (!Number.isInteger(v) && v < 10) return Math.round(v * 1000);
        return Math.round(v);
      }
    }
  }

  // 3. Parse product name/title for weight patterns (e.g. "Basmati Rice 5kg")
  const text = `${product.name} ${product.short_description}`;
  return parseWeightFromText(text);
}

/**
 * Parse weight from free text (product name, description snippets).
 * Handles: 500g, 1kg, 1.5 kg, 500ml, 1L, 1 litre, 1 liter, 500 gm
 */
export function parseWeightFromText(text: string): number | null {
  if (!text) return null;

  // kg patterns: 1.5kg, 1.5 kg, 1,5kg
  const kgMatch = text.match(/(\d+[.,]\d+|\d+)\s*kg\b/i);
  if (kgMatch) {
    const v = parseFloat(kgMatch[1].replace(',', '.')) * 1000;
    if (v > 0 && v <= 50000) return Math.round(v);
  }

  // g / gm / gms patterns: 500g, 500 gm, 500gms
  const gMatch = text.match(/(\d+)\s*(?:gms?|g)\b/i);
  if (gMatch) {
    const v = parseInt(gMatch[1], 10);
    if (v > 0 && v <= 50000) return v;
  }

  // L / litre / liter: 1L, 1.5 L, 1 litre, 1 liter
  const lMatch = text.match(/(\d+[.,]\d+|\d+)\s*(?:litres?|liters?|[lL])\b/);
  if (lMatch) {
    const v = parseFloat(lMatch[1].replace(',', '.')) * 1000;
    if (v > 0 && v <= 20000) return Math.round(v); // 1L ≈ 1000g (approximate)
  }

  // ml: 500ml, 500 ml
  const mlMatch = text.match(/(\d+)\s*ml\b/i);
  if (mlMatch) {
    const v = parseInt(mlMatch[1], 10);
    if (v > 0 && v <= 10000) return v; // 1ml ≈ 1g approximate
  }

  return null;
}

// ---------------------------------------------------------------------------
// Brand extraction
// ---------------------------------------------------------------------------
const BRAND_META_KEYS = ['_brand', 'brand', '_wc_brand', '_product_brand', 'pa_brand', '_yoast_wpseo_primary_product_cat'];

/** Extract brand from meta fields → attributes → fallback. */
export function extractBrand(product: WooFeedProduct, fallback = 'Ideal Indiska Livs'): string {
  // 1. Meta fields (WooCommerce Brands plugin, YITH Brands, etc.)
  for (const key of BRAND_META_KEYS) {
    const meta = product.meta_data.find(m => m.key === key);
    if (meta?.value && String(meta.value).trim()) {
      return String(meta.value).trim();
    }
  }

  // 2. Product attribute named "Brand" or "Märke"
  const brandAttr = product.attributes.find(a => {
    const n = a.name.toLowerCase();
    return n === 'brand' || n === 'märke' || n === 'varumärke';
  });
  const attrValue = brandAttr?.option || brandAttr?.options?.[0];
  if (attrValue?.trim()) return attrValue.trim();

  return fallback;
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------
export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'backorder';

export function getAvailability(product: WooFeedProduct): AvailabilityStatus {
  switch (product.stock_status) {
    case 'instock': return 'in_stock';
    case 'outofstock': return 'out_of_stock';
    case 'onbackorder': return 'backorder';
    default: return 'out_of_stock';
  }
}

/**
 * Get availability_date — ONLY for backorder/preorder products.
 * Returns undefined for in-stock products to prevent spurious Merchant Center warnings.
 */
export function getAvailabilityDate(product: WooFeedProduct): string | undefined {
  const status = getAvailability(product);
  if (status === 'in_stock') return undefined;

  // Check explicit meta keys
  for (const key of ['_availability_date', '_backorder_date', '_restock_date', '_preorder_date']) {
    const meta = product.meta_data.find(m => m.key === key);
    if (meta?.value) {
      try {
        return new Date(meta.value).toISOString().split('T')[0];
      } catch {
        // Invalid date — skip
      }
    }
  }

  // Default: +14 days for backorder
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().split('T')[0];
}

// ---------------------------------------------------------------------------
// Description cleaning
// ---------------------------------------------------------------------------
export function cleanDescription(product: WooFeedProduct, parentProduct?: WooFeedProduct, maxLength = 5000): string {
  const raw = product.description
    || parentProduct?.description
    || product.short_description
    || parentProduct?.short_description
    || `Quality grocery product from Ideal Indiska Livs`;

  const cleaned = raw
    .replace(/<[^>]*>/g, '')    // strip HTML tags
    .replace(/\s+/g, ' ')        // collapse whitespace
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength - 3) + '...';
}

// ---------------------------------------------------------------------------
// Price helpers
// ---------------------------------------------------------------------------
export function formatPriceSEK(value: string | number, currency = 'SEK'): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!num || isNaN(num) || num <= 0) return '';
  return `${num.toFixed(2)} ${currency}`;
}

export function parsePriceNum(value: string | number): number {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(n) ? 0 : n;
}

// ---------------------------------------------------------------------------
// XML helpers
// ---------------------------------------------------------------------------

/** Strip characters illegal in XML 1.0. */
export function stripInvalidXmlChars(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\uFFFE\uFFFF]/g, '');
}

/** Escape XML special characters. */
export function escapeXml(str: string): string {
  return stripInvalidXmlChars(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Wrap in a CDATA section, escaping any embedded ]]> sequences.
 * Use for human-readable fields like title and description.
 */
export function cdata(str: string): string {
  return `<![CDATA[${stripInvalidXmlChars(str).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}
