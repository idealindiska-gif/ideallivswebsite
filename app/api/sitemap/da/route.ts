import { siteConfig } from "@/site.config";
import { getProducts } from "@/lib/woocommerce/products-direct";
import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = siteConfig.site_domain;

    const productsRes = await getProducts({ per_page: 1 });
    const totalProducts = productsRes.total;
    const productSitemapCount = Math.ceil(totalProducts / 100);

    const sitemaps = [
        `${baseUrl}/da/sitemap-pages.xml`,
        `${baseUrl}/da/sitemap-posts.xml`,
        `${baseUrl}/da/sitemap-delivery.xml`,
        `${baseUrl}/da/sitemap-product-categories.xml`,
        `${baseUrl}/da/sitemap-product-brands.xml`,
    ];

    for (let i = 1; i <= productSitemapCount; i++) {
        sitemaps.push(`${baseUrl}/da/sitemap-products-${i}.xml`);
    }

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
