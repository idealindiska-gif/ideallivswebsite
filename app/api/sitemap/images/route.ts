import { siteConfig } from "@/site.config";
import { getProducts } from "@/lib/woocommerce/products-direct";
import { getAllPosts } from "@/lib/wordpress";
import { NextResponse } from "next/server";
import { escapeXml } from "@/lib/feeds/feed-utils";

export async function GET() {
    const baseUrl = siteConfig.site_domain;

    // -----------------------------------------------------------------------
    // Fetch ALL products (paginated) — previously only fetched first 100
    // -----------------------------------------------------------------------
    let allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        try {
            const res = await getProducts({ per_page: 100, page, status: "publish" });
            if (res.data.length > 0) {
                allProducts = allProducts.concat(res.data);
                page++;
                if (res.data.length < 100) hasMore = false;
            } else {
                hasMore = false;
            }
        } catch {
            hasMore = false;
        }
    }

    // -----------------------------------------------------------------------
    // Fetch blog posts
    // -----------------------------------------------------------------------
    let posts: any[] = [];
    try {
        posts = await getAllPosts();
    } catch {
        // Non-fatal: sitemap still valid without blog images
    }

    // -----------------------------------------------------------------------
    // Build image entries — include ALL images per product, not just images[0]
    // -----------------------------------------------------------------------
    const productImageEntries = allProducts
        .filter((p) => p.images?.length > 0)
        .map((p) => {
            const imageLines = p.images
                .slice(0, 10) // Google supports up to 1000 per URL; 10 is plenty for a product
                .map((img: { src: string; alt?: string; name?: string }) => {
                    const title = img.alt || img.name || p.name;
                    return `    <image:image>\n      <image:loc>${escapeXml(img.src)}</image:loc>\n      <image:title>${escapeXml(title)}</image:title>\n    </image:image>`;
                })
                .join("\n");
            return `  <url>\n    <loc>${baseUrl}/product/${p.slug}</loc>\n${imageLines}\n  </url>`;
        })
        .join("\n");

    const postImageEntries = posts
        .filter((p) => (p as any)._embedded?.["wp:featuredmedia"]?.[0]?.source_url)
        .map((p) => {
            const media = (p as any)._embedded["wp:featuredmedia"][0];
            return `  <url>\n    <loc>${baseUrl}/blog/${p.slug}</loc>\n    <image:image>\n      <image:loc>${escapeXml(media.source_url)}</image:loc>\n      <image:title>${escapeXml(p.title.rendered)}</image:title>\n    </image:image>\n  </url>`;
        })
        .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${productImageEntries}
${postImageEntries}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
            "X-Image-Products": String(allProducts.length),
        },
    });
}
