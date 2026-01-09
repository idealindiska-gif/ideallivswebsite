/**
 * Google Merchant Center - Promotions Feed
 * Generates XML feed for Google Merchant Promotions
 * Feed URL: /api/google-promotions-feed
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { fetchWooCommerceCached } from '@/lib/woocommerce/api';

const CURRENCY = 'SEK';

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
        const effectiveDateStart = new Date().toISOString().split('.')[0] + 'Z';
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 5); // Max 6 months allowed by Google
        const effectiveDateEnd = endDate.toISOString().split('.')[0] + 'Z';

        // Format: YYYY-MM-DDTHH:mm:ss/YYYY-MM-DDTHH:mm:ss
        const effectiveDates = `${effectiveDateStart}/${effectiveDateEnd}`;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<!-- Generated on: ${timestamp} -->\n`;
        xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n`;
        xml += `  <channel>\n`;
        xml += `    <title><![CDATA[${siteConfig.site_name} - Merchant Promotions Feed]]></title>\n`;
        xml += `    <link>${siteConfig.site_domain}</link>\n`;
        xml += `    <description><![CDATA[Active promotions and special offers for Google Merchant Center]]></description>\n`;

        if (saleProducts.length > 0) {
            // 1. Generic Promotion for all sale items
            xml += `    <item>\n`;
            xml += `      <g:promotion_id>WEEKLY_DEALS</g:promotion_id>\n`;
            xml += `      <g:long_title><![CDATA[Weekly Specials: Indian & Pakistani Grocery Deals]]></g:long_title>\n`;
            xml += `      <g:promotion_display_path>Weekly Deals</g:promotion_display_path>\n`;
            xml += `      <g:redemption_channel>ONLINE</g:redemption_channel>\n`;
            xml += `      <g:offer_type>NO_CODE</g:offer_type>\n`;
            xml += `      <g:promotion_effective_dates>${effectiveDates}</g:promotion_effective_dates>\n`;
            xml += `      <g:product_applicability>SPECIFIC_PRODUCTS</g:product_applicability>\n`;
            xml += `    </item>\n`;

            // 2. Free Delivery Promotion (Store wide)
            xml += `    <item>\n`;
            xml += `      <g:promotion_id>FREE_DELIVERY_500</g:promotion_id>\n`;
            xml += `      <g:long_title><![CDATA[Free Delivery in Stockholm on orders over 500 SEK]]></g:long_title>\n`;
            xml += `      <g:promotion_display_path>Free Shipping</g:promotion_display_path>\n`;
            xml += `      <g:redemption_channel>ONLINE</g:redemption_channel>\n`;
            xml += `      <g:offer_type>NO_CODE</g:offer_type>\n`;
            xml += `      <g:promotion_effective_dates>${effectiveDates}</g:promotion_effective_dates>\n`;
            xml += `      <g:product_applicability>ALL_PRODUCTS</g:product_applicability>\n`;
            xml += `    </item>\n`;
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
        console.error('Error generating Google Promotions feed:', error);
        return NextResponse.json(
            { error: 'Failed to generate feed' },
            { status: 500 }
        );
    }
}
