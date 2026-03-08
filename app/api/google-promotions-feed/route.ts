/**
 * Google Merchant Center - Promotions Feed
 * Generates XML feed for Google Merchant Promotions
 * Feed URL: /api/google-promotions-feed
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { fetchWooCommerceCached } from '@/lib/woocommerce/api';

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

interface WooProduct {
    id: number;
    name: string;
    sale_price: string;
    regular_price: string;
    on_sale: boolean;
}

export async function GET() {
    try {
        // Fetch products currently on sale
        const saleProducts: WooProduct[] = await fetchWooCommerceCached(
            `/products?status=publish&on_sale=true&per_page=100`,
            3600,
            ['products', 'on-sale', 'google-promotions-feed']
        );

        const timestamp = new Date().toISOString();
        // Promotion dates: today through 30 days from now (rolling window, with timezone)
        const effectiveDateStart = new Date().toISOString().split('.')[0] + '+01:00';
        const effectiveDateEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('.')[0] + '+01:00';
        const effectiveDates = `${effectiveDateStart}/${effectiveDateEnd}`;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<!-- Generated on: ${timestamp} -->\n`;
        xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n`;
        xml += `  <channel>\n`;
        xml += `    <title>${cdata(siteConfig.site_name + ' - Merchant Promotions Feed')}</title>\n`;
        xml += `    <link>${siteConfig.site_domain}</link>\n`;
        xml += `    <description>${cdata('Active promotions and special offers for Google Merchant Center')}</description>\n`;

        if (saleProducts.length > 0) {
            // 1. Generic Promotion for all current sale items
            // g:product_applicability ALL_PRODUCTS is used because we are not
            // listing specific product_ids; SPECIFIC_PRODUCTS without ids causes errors.
            xml += `    <item>\n`;
            xml += `      <g:promotion_id>WEEKLY_DEALS</g:promotion_id>\n`;
            xml += `      <g:long_title>${cdata('Weekly Specials: Indian & Pakistani Grocery Deals')}</g:long_title>\n`;
            xml += `      <g:redemption_channel>ONLINE</g:redemption_channel>\n`;
            xml += `      <g:offer_type>NO_CODE</g:offer_type>\n`;
            xml += `      <g:discount_type>PERCENT_OFF</g:discount_type>\n`;
            xml += `      <g:promotion_effective_dates>${effectiveDates}</g:promotion_effective_dates>\n`;
            xml += `      <g:product_applicability>ALL_PRODUCTS</g:product_applicability>\n`;
            xml += `    </item>\n`;
        }

        // 2. Always-present free delivery promotion
        xml += `    <item>\n`;
        xml += `      <g:promotion_id>FREE_DELIVERY_500</g:promotion_id>\n`;
        xml += `      <g:long_title>${cdata('Free Local Delivery on Orders Over 500 SEK')}</g:long_title>\n`;
        xml += `      <g:redemption_channel>ONLINE</g:redemption_channel>\n`;
        xml += `      <g:offer_type>NO_CODE</g:offer_type>\n`;
        xml += `      <g:discount_type>FREE_SHIPPING</g:discount_type>\n`;
        xml += `      <g:promotion_effective_dates>${effectiveDates}</g:promotion_effective_dates>\n`;
        xml += `      <g:product_applicability>ALL_PRODUCTS</g:product_applicability>\n`;
        xml += `      <g:minimum_purchase_amount>${500} ${CURRENCY}</g:minimum_purchase_amount>\n`;
        xml += `    </item>\n`;

        xml += `  </channel>\n`;
        xml += `</rss>`;

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
        });
    } catch (error) {
        console.error('Error generating Google Promotions feed:', error);
        return NextResponse.json(
            { error: 'Failed to generate feed' },
            { status: 500 }
        );
    }
}
