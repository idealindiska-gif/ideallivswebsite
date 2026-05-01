import { siteConfig } from "@/site.config";
import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = siteConfig.site_domain;

    const pages = [
        { url: "/da", priority: 1.0, changefreq: "daily" },
        { url: "/da/about", priority: 0.8, changefreq: "monthly" },
        { url: "/da/contact", priority: 0.8, changefreq: "monthly" },
        { url: "/da/faq", priority: 0.7, changefreq: "monthly" },
        { url: "/da/shop", priority: 0.9, changefreq: "daily" },
        { url: "/da/blog", priority: 0.7, changefreq: "weekly" },
        { url: "/da/deals", priority: 0.8, changefreq: "daily" },
        { url: "/da/brands", priority: 0.7, changefreq: "weekly" },
        { url: "/da/delivery-information", priority: 0.8, changefreq: "monthly" },
        { url: "/da/delivery-goteborg-malmo", priority: 0.8, changefreq: "monthly" },
        { url: "/da/europe-delivery", priority: 0.8, changefreq: "monthly" },
        { url: "/da/denmark-delivery", priority: 0.9, changefreq: "monthly" },
        { url: "/da/privacy-policy", priority: 0.3, changefreq: "yearly" },
        { url: "/da/refund-return", priority: 0.3, changefreq: "yearly" },
        { url: "/da/terms-conditions", priority: 0.3, changefreq: "yearly" },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
        .map(
            (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
        )
        .join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });
}
