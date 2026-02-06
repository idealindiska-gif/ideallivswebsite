'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export interface GoogleCustomerReviewsProps {
    orderId: string;
    email: string;
    deliveryCountry: string; // ISO 3166-1 alpha-2 country code (e.g., 'SE' for Sweden)
    estimatedDeliveryDate: string; // Format: 'YYYY-MM-DD'
    products?: Array<{
        gtin?: string; // Global Trade Item Number (barcode)
    }>;
}

/**
 * Google Customer Reviews Opt-in Component
 * 
 * This component displays the Google Customer Reviews survey opt-in badge
 * on your order confirmation page. It allows Google to collect verified reviews
 * from your customers, which can improve your Google Merchant Center ratings.
 * 
 * @see https://support.google.com/merchants/answer/7124326
 * 
 * Requirements:
 * - Must be placed on order confirmation page
 * - Page must be on your own domain
 * - <!DOCTYPE HTML> must be at top of page (Next.js handles this)
 * - Shopping cart and checkout must be on same domain
 * 
 * @example
 * ```tsx
 * <GoogleCustomerReviews
 *   orderId="12345"
 *   email="customer@example.com"
 *   deliveryCountry="SE"
 *   estimatedDeliveryDate="2026-02-15"
 *   products={[{ gtin: "1234567890123" }]}
 * />
 * ```
 */
export function GoogleCustomerReviews({
    orderId,
    email,
    deliveryCountry,
    estimatedDeliveryDate,
    products = [],
}: GoogleCustomerReviewsProps) {

    // Merchant ID from Google Merchant Center
    const MERCHANT_ID = 5594274980;

    useEffect(() => {
        // Define the renderOptIn function globally
        if (typeof window !== 'undefined') {
            (window as any).renderOptIn = function () {
                if ((window as any).gapi) {
                    (window as any).gapi.load('surveyoptin', function () {
                        (window as any).gapi.surveyoptin.render({
                            // REQUIRED FIELDS
                            merchant_id: MERCHANT_ID,
                            order_id: orderId,
                            email: email,
                            delivery_country: deliveryCountry,
                            estimated_delivery_date: estimatedDeliveryDate,

                            // OPTIONAL FIELDS
                            products: products.length > 0 ? products : undefined,
                        });
                    });
                }
            };
        }
    }, [orderId, email, deliveryCountry, estimatedDeliveryDate, products]);

    return (
        <>
            {/* Google Customer Reviews Script */}
            <Script
                src="https://apis.google.com/js/platform.js?onload=renderOptIn"
                strategy="afterInteractive"
                async
                defer
            />

            {/* Container for the opt-in badge (Google will inject content here) */}
            <div id="gapi-surveyoptin-container" />
        </>
    );
}

/**
 * Helper function to calculate estimated delivery date
 * 
 * @param daysToAdd - Number of days to add to current date
 * @returns Date string in YYYY-MM-DD format
 * 
 * @example
 * ```tsx
 * const deliveryDate = getEstimatedDeliveryDate(3); // 3 days from now
 * ```
 */
export function getEstimatedDeliveryDate(daysToAdd: number = 3): string {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Helper function to extract GTINs from WooCommerce products
 * 
 * @param products - Array of WooCommerce products
 * @returns Array of products with GTINs
 * 
 * @example
 * ```tsx
 * const productGTINs = extractProductGTINs(orderItems);
 * ```
 */
export function extractProductGTINs(products: any[]): Array<{ gtin?: string }> {
    return products
        .map(product => ({
            gtin: product.gtin || product.meta_data?.find((m: any) => m.key === 'gtin')?.value
        }))
        .filter(p => p.gtin); // Only include products with GTINs
}
