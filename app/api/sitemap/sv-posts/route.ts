import { NextResponse } from 'next/server';

/**
 * Swedish Blog Posts Sitemap
 * Generates sitemap for static Swedish blog posts
 */
export async function GET() {
    const baseUrl = 'https://www.ideallivs.com';

    // Static Swedish blog posts
    // These are the same as English but with /sv prefix
    const staticBlogPosts = [
        { slug: 'ramadan-2026', changefreq: 'weekly', priority: '0.8' },
        { slug: 'ramadan-grocery-checklist-2026', changefreq: 'weekly', priority: '0.8' },
        { slug: 'the-indian-fika', changefreq: 'monthly', priority: '0.7' },
        { slug: 'no-customs-indian-grocery-europe', changefreq: 'monthly', priority: '0.7' },
    ];

    // Generate sitemap URLs for Swedish blog posts
    const urls = staticBlogPosts.map(post => `
  <url>
    <loc>${baseUrl}/sv/blog/${post.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>${post.priority}</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
