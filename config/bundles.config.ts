/**
 * Bundle Offers Configuration
 *
 * Define product bundles that appear on product pages.
 * Customers can add all bundle items to cart with a single click.
 *
 * Pricing modes:
 * - discountPercent: percentage off the sum of individual prices
 * - fixedPrice: fixed total price for the bundle (in SEK)
 * - If both are set, fixedPrice takes priority
 */

export interface BundleItem {
  productId: number;
  quantity: number;
  variationId?: number;
}

export interface BundleOffer {
  id: string;
  name: string;
  description?: string;
  badge?: string;
  items: BundleItem[];
  discountPercent?: number;
  fixedPrice?: number;
  /** Show this bundle on these product pages */
  triggerProductIds: number[];
  active: boolean;
  startsAt?: string;
  endsAt?: string;
}

// ─── Bundle Definitions ───────────────────────────────────────────────
// Update the productId values below with your actual WooCommerce product IDs.

export const bundleOffers: BundleOffer[] = [
  {
    id: 'national-chaat-masala-4pack',
    name: 'Buy 4 National Chaat Masala',
    description: 'Stock up and save on the classic tangy spice mix',
    badge: 'Value Pack',
    items: [
      { productId: 105, quantity: 4 },
    ],
    fixedPrice: 60,
    triggerProductIds: [105],
    active: true,
  },
  {
    id: 'haldiram-lachha-paratha-2pack',
    name: 'Buy 2 Lachha Paratha Value Packs',
    description: 'Crispy layered parathas for the whole family',
    badge: 'Bundle Deal',
    items: [
      { productId: 535, quantity: 2 },
    ],
    fixedPrice: 180,
    triggerProductIds: [535],
    active: true,
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────

/**
 * Get all active bundles that should display on a product page
 */
export function getBundlesForProduct(productId: number): BundleOffer[] {
  const now = new Date();
  return bundleOffers.filter((bundle) => {
    if (!bundle.active) return false;
    if (!bundle.triggerProductIds.includes(productId)) return false;
    if (bundle.startsAt && new Date(bundle.startsAt) > now) return false;
    if (bundle.endsAt && new Date(bundle.endsAt) < now) return false;
    return true;
  });
}

/**
 * Get all unique product IDs needed for a set of bundles
 */
export function getBundleProductIds(bundles: BundleOffer[]): number[] {
  const ids = new Set<number>();
  for (const bundle of bundles) {
    for (const item of bundle.items) {
      ids.add(item.productId);
    }
  }
  return Array.from(ids);
}

/**
 * Calculate bundle pricing from product data
 */
export function calculateBundlePrice(
  bundle: BundleOffer,
  products: Map<number, { price: string; regular_price: string }>
): { originalTotal: number; bundlePrice: number; savings: number } {
  let originalTotal = 0;

  for (const item of bundle.items) {
    const product = products.get(item.productId);
    if (!product) continue;
    const price = parseFloat(product.regular_price || product.price) || 0;
    originalTotal += price * item.quantity;
  }

  let bundlePrice: number;
  if (bundle.fixedPrice != null) {
    bundlePrice = bundle.fixedPrice;
  } else if (bundle.discountPercent != null) {
    bundlePrice = originalTotal * (1 - bundle.discountPercent / 100);
  } else {
    bundlePrice = originalTotal;
  }

  bundlePrice = Math.round(bundlePrice * 100) / 100;
  const savings = Math.round((originalTotal - bundlePrice) * 100) / 100;

  return { originalTotal, bundlePrice, savings };
}
