import { siteConfig } from "@/site.config";
import { getProducts } from "@/lib/woocommerce/products-direct";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const baseUrl = siteConfig.site_domain;

  // Fetch products to calculate how many product sitemaps we need
  // Fall back to 10 pages if WooCommerce is unavailable (so Googlebot still gets the sitemap index)
  let productSitemapCount = 10;
  try {
    const productsRes = await getProducts({ per_page: 1 });
    productSitemapCount = Math.ceil(productsRes.total / 100);
  } catch {
    // WooCommerce unavailable — use last-known safe page count
  }

  const sitemaps = [
    // English sitemaps
    `${baseUrl}/sitemap-pages.xml`,
    `${baseUrl}/sitemap-delivery.xml`,
    `${baseUrl}/sitemap-posts.xml`,
    `${baseUrl}/sitemap-post-categories.xml`,
    `${baseUrl}/sitemap-product-categories.xml`,
    `${baseUrl}/sitemap-product-brands.xml`,
    `${baseUrl}/sitemap-images.xml`,
  ];

  // Add paginated English product sitemaps
  for (let i = 1; i <= productSitemapCount; i++) {
    sitemaps.push(`${baseUrl}/sitemap-products-${i}.xml`);
  }

  // Locale sitemap indexes
  sitemaps.push(`${baseUrl}/sv/sitemap.xml`);
  sitemaps.push(`${baseUrl}/no/sitemap.xml`);
  sitemaps.push(`${baseUrl}/da/sitemap.xml`);

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
