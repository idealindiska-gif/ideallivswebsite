import { siteConfig } from "@/site.config";
import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = siteConfig.site_domain;

    // NO product pages (/no/product/*) are 301-redirected to English by middleware
    // because there are no Norwegian product translations. Including product sitemaps
    // here would just waste Googlebot crawl budget on redirect chains — so we omit them.
    const sitemaps = [
        `${baseUrl}/no/sitemap-pages.xml`,
        `${baseUrl}/no/sitemap-posts.xml`,
        `${baseUrl}/no/sitemap-delivery.xml`,
        `${baseUrl}/no/sitemap-product-categories.xml`,
        `${baseUrl}/no/sitemap-product-brands.xml`,
    ];

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
        .map(
            (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
        )
        .join("\n")}
</sitemapindex>`;

    return new NextResponse(sitemapIndex, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
