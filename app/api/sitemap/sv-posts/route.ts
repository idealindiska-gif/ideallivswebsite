import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { getAllPosts } from '@/lib/wordpress';

/**
 * Swedish Blog Posts Sitemap
 * Generates sitemap for static + WordPress Swedish blog posts
 */
export async function GET() {
    const baseUrl = siteConfig.site_domain;

    // Static Swedish blog posts
    const staticBlogPosts = [
        { slug: 'ramadan-2026', changefreq: 'weekly', priority: '0.8' },
        { slug: 'ramadan-grocery-checklist-2026', changefreq: 'weekly', priority: '0.8' },
        { slug: 'the-indian-fika', changefreq: 'monthly', priority: '0.7' },
        { slug: 'no-customs-indian-grocery-europe', changefreq: 'monthly', priority: '0.7' },
    ];

    // Fetch WordPress posts for Swedish sitemap
    let posts: any[] = [];
    try {
        posts = await getAllPosts();
    } catch (error) {
        console.error('Error fetching WordPress posts for sv sitemap:', error);
    }

    const wpPostEntries = posts
        .map(
            (post) => `  <url>
    <loc>${baseUrl}/sv/blog/${post.slug}</loc>
    <lastmod>${new Date(post.modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
        )
        .join('\n');

    const staticPostEntries = staticBlogPosts
        .map(
            (post) => `  <url>
    <loc>${baseUrl}/sv/blog/${post.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>${post.priority}</priority>
  </url>`
        )
        .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${wpPostEntries}
${staticPostEntries}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
