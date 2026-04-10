import { siteConfig } from "@/site.config";
import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = siteConfig.site_domain;

    // lastmod: stable dates — using new Date() on every request wastes crawl budget
    // as Google treats every crawl as a "changed" page. Update these when the page content changes.
    const pages = [
        { url: "", priority: 1.0, changefreq: "daily",   lastmod: "2026-04-01" },
        { url: "/about", priority: 0.8, changefreq: "monthly",  lastmod: "2026-03-01" },
        { url: "/contact", priority: 0.8, changefreq: "monthly",  lastmod: "2026-03-01" },
        { url: "/faq", priority: 0.7, changefreq: "monthly",  lastmod: "2026-03-15" },
        { url: "/shop", priority: 0.9, changefreq: "daily",   lastmod: "2026-04-01" },
        { url: "/deals", priority: 0.8, changefreq: "daily",   lastmod: "2026-04-01" },
        { url: "/brands", priority: 0.7, changefreq: "weekly",  lastmod: "2026-03-15" },
        { url: "/blog", priority: 0.7, changefreq: "weekly",  lastmod: "2026-04-01" },
        { url: "/delivery-information", priority: 0.8, changefreq: "monthly",  lastmod: "2026-03-01" },
        { url: "/delivery-goteborg-malmo", priority: 0.7, changefreq: "monthly",  lastmod: "2026-02-01" },
        { url: "/norway-delivery", priority: 0.7, changefreq: "monthly",  lastmod: "2026-02-01" },
        { url: "/denmark-delivery", priority: 0.7, changefreq: "monthly",  lastmod: "2026-02-01" },
        { url: "/europe-delivery", priority: 0.7, changefreq: "monthly",  lastmod: "2026-02-01" },
        { url: "/prepared-meals", priority: 0.6, changefreq: "weekly",  lastmod: "2026-03-01" },
        { url: "/privacy-policy", priority: 0.3, changefreq: "yearly",  lastmod: "2026-01-01" },
        { url: "/refund-return", priority: 0.3, changefreq: "yearly",  lastmod: "2026-01-01" },
        { url: "/terms-conditions", priority: 0.3, changefreq: "yearly",  lastmod: "2026-01-01" },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
            .map(
                (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
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
