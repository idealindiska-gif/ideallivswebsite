'use server';

import { getWooCommerceUrl, getWooCommerceAuthHeader } from '@/lib/woocommerce/config';
import { SHIPPING_RESTRICTIONS } from '@/config/commerce-rules';

/**
 * Validate if cart items can be shipped to the provided address.
 *
 * BUG FIXES (2026-03-10):
 *  1. Category slugs now come from commerce-rules.ts (frozen-foods, fresh-produce,
 *     tradional-sweets) instead of the wrong set ('perishable', 'fresh-food', 'catering').
 *  2. isStockholmArea() checks country === 'SE' FIRST so non-Swedish orders are
 *     correctly rejected regardless of their postcode.  Previously Rome's "001xx"
 *     postcodes matched the 100-199 Stockholm range.
 *  3. The 'stockholm-only' shipping-class check now also applies when country !== 'SE'.
 */
export async function validateShippingRestrictions(params: {
    items: Array<{ productId: number; quantity: number }>;
    postcode: string;
    city?: string;
    country?: string;
}) {
    const { items, postcode, city, country } = params;

    try {
        const restrictedProducts: Array<{
            productId: number;
            productName: string;
            reason: string;
        }> = [];

        // Pre-compute once for the whole cart
        const withinStockholm = isStockholmArea(postcode, country);
        const withinSweden = (country || 'SE').toUpperCase() === 'SE';

        // Check each product for shipping restrictions
        for (const item of items) {
            const response = await fetch(
                getWooCommerceUrl(`/products/${item.productId}`),
                {
                    headers: {
                        'Authorization': getWooCommerceAuthHeader(),
                    },
                    cache: 'no-store',
                }
            );

            if (!response.ok) {
                console.error(`Failed to fetch product ${item.productId}`);
                continue;
            }

            const product = await response.json();
            const shippingClass = product.shipping_class as string | undefined;
            const metaData: any[] = product.meta_data || [];
            const categories: any[] = product.categories || [];

            // ── 1. Shipping class: stockholm-only ─────────────────────────────
            if (shippingClass === 'stockholm-only' && !withinStockholm) {
                restrictedProducts.push({
                    productId: product.id,
                    productName: product.name,
                    reason: 'This product can only be delivered within the Stockholm area',
                });
                continue; // No need to check further for this product
            }

            // ── 2. Custom meta field _shipping_restriction ────────────────────
            const shippingRestrictionMeta = metaData.find(
                (meta) => meta.key === '_shipping_restriction'
            );

            if (shippingRestrictionMeta) {
                const restriction = shippingRestrictionMeta.value;
                if (restriction === 'stockholm_only' && !withinStockholm) {
                    restrictedProducts.push({
                        productId: product.id,
                        productName: product.name,
                        reason: 'This product can only be delivered within the Stockholm area',
                    });
                    continue;
                }
                if (restriction === 'sweden_only' && !withinSweden) {
                    restrictedProducts.push({
                        productId: product.id,
                        productName: product.name,
                        reason: 'This product can only be shipped within Sweden',
                    });
                    continue;
                }
            }

            // ── 3. Category-based restriction (frozen, fresh, sweets) ─────────
            // Uses the canonical slugs from config/commerce-rules.ts
            const productCategorySlugs = categories.map((c: any) => c.slug as string);

            const hasRestrictedCategory = productCategorySlugs.some((slug) =>
                SHIPPING_RESTRICTIONS.restrictedCategories.includes(slug)
            );

            // Also check specific product IDs if any are listed
            const isRestrictedById = SHIPPING_RESTRICTIONS.restrictedProductIds.includes(product.id);

            if ((hasRestrictedCategory || isRestrictedById) && !withinStockholm) {
                const categoryLabel = getCategoryLabel(productCategorySlugs);
                restrictedProducts.push({
                    productId: product.id,
                    productName: product.name,
                    reason: `${categoryLabel} can only be delivered within the Stockholm area. They cannot be shipped to ${city || country || 'your location'}.`,
                });
            }
        }

        return {
            success: true,
            data: {
                valid: restrictedProducts.length === 0,
                restrictedProducts,
            },
        };
    } catch (error: any) {
        console.error('Error validating shipping restrictions:', error);
        return {
            success: false,
            error: error.message || 'Failed to validate shipping restrictions',
            data: {
                // Fail CLOSED for category check — restrict on error for perishables
                // (opposite of the old behaviour which failed open)
                valid: false,
                restrictedProducts: [],
            },
        };
    }
}

/**
 * Returns true only when the delivery address is within the Stockholm service area.
 *
 * Checks country FIRST so that non-Swedish orders (e.g. Italy) are always rejected
 * before we ever look at the postcode.  This fixes the old bug where Italian
 * postcodes starting with 1 (e.g. 00100 Rome) matched the 100-199 Stockholm range.
 *
 * Stockholm postcodes: 100 00 – 199 99
 */
function isStockholmArea(postcode: string, country?: string): boolean {
    // Must be a Swedish address
    const effectiveCountry = (country || 'SE').toUpperCase();
    if (effectiveCountry !== 'SE') return false;

    // Normalise Swedish postcode (remove spaces)
    const normalized = postcode.replace(/\s/g, '');

    if (normalized.length < 3 || !/^\d{3}/.test(normalized)) return false;

    const prefixNum = parseInt(normalized.substring(0, 3), 10);

    // Stockholm area: 100–199
    return prefixNum >= 100 && prefixNum <= 199;
}

/**
 * Return a human-friendly label for the restricted category
 */
function getCategoryLabel(slugs: string[]): string {
    if (slugs.includes('frozen-foods')) return 'Frozen food items';
    if (slugs.includes('fresh-produce')) return 'Fresh produce items';
    if (slugs.includes('tradional-sweets')) return 'Traditional sweet items';
    return 'These items';
}

/**
 * Get shipping restriction info for a single product (used in product display)
 */
export async function getProductShippingInfo(productId: number) {
    try {
        const response = await fetch(
            getWooCommerceUrl(`/products/${productId}`),
            {
                headers: {
                    'Authorization': getWooCommerceAuthHeader(),
                },
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }

        const product = await response.json();
        const metaData: any[] = product.meta_data || [];
        const shippingClass = product.shipping_class as string | undefined;
        const categories: any[] = product.categories || [];

        let restriction: string | null = null;

        if (shippingClass === 'stockholm-only') {
            restriction = 'Stockholm area only';
        }

        const shippingRestrictionMeta = metaData.find(
            (meta) => meta.key === '_shipping_restriction'
        );

        if (shippingRestrictionMeta) {
            const value = shippingRestrictionMeta.value;
            if (value === 'stockholm_only') restriction = 'Stockholm area only';
            else if (value === 'sweden_only') restriction = 'Sweden only';
        }

        // Category-based restriction
        const categorySlugs = categories.map((c: any) => c.slug as string);
        const hasRestrictedCategory = categorySlugs.some((slug) =>
            SHIPPING_RESTRICTIONS.restrictedCategories.includes(slug)
        );
        if (hasRestrictedCategory && !restriction) {
            restriction = 'Stockholm area only (perishable/frozen item)';
        }

        return {
            success: true,
            data: {
                hasRestriction: restriction !== null,
                restriction,
            },
        };
    } catch (error: any) {
        console.error('Error fetching product shipping info:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch shipping info',
        };
    }
}

