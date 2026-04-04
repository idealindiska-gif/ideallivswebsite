import { siteConfig } from "@/site.config";
import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = siteConfig.site_domain;

    const pages = [
        { url: "", priority: 1.0, changefreq: "daily" },
        { url: "/about", priority: 0.8, changefreq: "monthly" },
        { url: "/contact", priority: 0.8, changefreq: "monthly" },
        { url: "/faq", priority: 0.7, changefreq: "monthly" },
        { url: "/shop", priority: 0.9, changefreq: "daily" },
        { url: "/deals", priority: 0.8, changefreq: "daily" },
        { url: "/brands", priority: 0.7, changefreq: "weekly" },
        { url: "/blog", priority: 0.7, changefreq: "weekly" },
        { url: "/delivery-information", priority: 0.8, changefreq: "monthly" },
        { url: "/delivery-goteborg-malmo", priority: 0.7, changefreq: "monthly" },
        { url: "/norway-delivery", priority: 0.7, changefreq: "monthly" },
        { url: "/denmark-delivery", priority: 0.7, changefreq: "monthly" },
        { url: "/europe-delivery", priority: 0.7, changefreq: "monthly" },
        { url: "/prepared-meals", priority: 0.6, changefreq: "weekly" },
        { url: "/privacy-policy", priority: 0.3, changefreq: "yearly" },
        { url: "/refund-return", priority: 0.3, changefreq: "yearly" },
        { url: "/terms-conditions", priority: 0.3, changefreq: "yearly" },
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
