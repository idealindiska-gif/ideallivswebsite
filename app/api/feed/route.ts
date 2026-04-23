/**
 * RSS 2.0 Feed — Blog Posts
 * Used by Pinterest Catalogs and general RSS readers.
 * Feed URL: /api/feed
 *
 * Pinterest requirements met:
 *  ✅ RSS 2.0 with media, content, atom, and dc namespaces
 *  ✅ <media:content> with url, medium, type attributes
 *  ✅ <media:thumbnail> for Pinterest image preview
 *  ✅ <enclosure> – canonical image signal for RSS readers
 *  ✅ <channel><image> – feed logo shown in Pinterest / RSS readers
 *  ✅ <atom:link> self-referencing link (required by RSS validators)
 *  ✅ HTML entities never double-decoded (safe for CDATA and plain text)
 *  ✅ Absolute image URLs (relative WP URLs rewritten to CRM base)
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { escapeXml, cdata } from '@/lib/feeds/feed-utils';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://crm.ideallivs.com';
const FEED_URL = `${siteConfig.site_domain}/api/feed`;

interface WPPost {
  id: number;
  date: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  slug: string;
  author: number;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      mime_type?: string;
      media_details?: { width?: number; height?: number };
    }>;
    author?: Array<{ name: string }>;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip HTML tags → plain text.
 * Does NOT decode HTML entities — leave them encoded so they stay safe
 * inside XML text nodes and CDATA sections.
 */
function stripHtmlTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Ensure image URLs are absolute.
 * WordPress sometimes returns protocol-relative or relative paths.
 */
function absoluteUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `${WORDPRESS_URL}${url}`;
  return url;
}

/**
 * Guess MIME type from URL extension.
 * Defaults to image/jpeg which covers most WP uploads.
 */
function guessMimeType(url: string): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const apiUrl = `${WORDPRESS_URL}/wp-json/wp/v2`;

    const response = await fetch(
      `${apiUrl}/posts?per_page=50&_embed=true&status=publish&orderby=date&order=desc`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress API error:', response.status, errorText);
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts: WPPost[] = await response.json();
    console.log(`[rss-feed] fetched ${posts.length} posts`);

    const now = new Date().toUTCString();

    // Channel logo — used by Pinterest and RSS readers as feed icon
    const logoUrl = `${siteConfig.site_domain}/logo.png`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<rss version="2.0"\n`;
    xml += `  xmlns:content="http://purl.org/rss/1.0/modules/content/"\n`;
    xml += `  xmlns:dc="http://purl.org/dc/elements/1.1/"\n`;
    xml += `  xmlns:atom="http://www.w3.org/2005/Atom"\n`;
    xml += `  xmlns:media="http://search.yahoo.com/mrss/">\n`;
    xml += `  <channel>\n`;
    xml += `    <title>${cdata(siteConfig.site_name + ' Blog')}</title>\n`;
    xml += `    <link>${escapeXml(siteConfig.site_domain)}</link>\n`;
    xml += `    <description>${cdata(siteConfig.site_description)}</description>\n`;
    xml += `    <language>sv-SE</language>\n`;
    xml += `    <lastBuildDate>${now}</lastBuildDate>\n`;
    // Self-referencing atom:link — required by RSS validators and Pinterest
    xml += `    <atom:link href="${escapeXml(FEED_URL)}" rel="self" type="application/rss+xml" />\n`;
    // Channel image — shown as feed logo in Pinterest / RSS readers
    xml += `    <image>\n`;
    xml += `      <url>${escapeXml(logoUrl)}</url>\n`;
    xml += `      <title>${cdata(siteConfig.site_name)}</title>\n`;
    xml += `      <link>${escapeXml(siteConfig.site_domain)}</link>\n`;
    xml += `    </image>\n`;

    for (const post of posts) {
      // Strip HTML from title and excerpt for plain-text fields
      const title = stripHtmlTags(post.title.rendered);
      const excerpt = stripHtmlTags(post.excerpt.rendered || post.content.rendered || '');

      // Full HTML content for content:encoded (keep HTML, just fix image URLs)
      const rawContent = post.content.rendered || post.excerpt.rendered || '';

      const pubDate = new Date(post.date).toUTCString();
      const frontendLink = `${siteConfig.site_domain}/blog/${post.slug}`;

      // Featured image
      const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
      const rawImageUrl = featuredMedia?.source_url || '';
      const imageUrl = absoluteUrl(rawImageUrl);
      const imageAlt = featuredMedia?.alt_text || title;
      const imageMime = guessMimeType(imageUrl);
      const imageWidth = featuredMedia?.media_details?.width;
      const imageHeight = featuredMedia?.media_details?.height;

      // Author
      const authorName = post._embedded?.author?.[0]?.name || siteConfig.site_name;

      // Prepend image to content:encoded so Pinterest sees it inline
      let fullContent = rawContent;
      if (imageUrl) {
        fullContent = `<img src="${escapeXml(imageUrl)}" alt="${escapeXml(imageAlt)}" />\n${rawContent}`;
      }

      xml += `    <item>\n`;
      xml += `      <title>${cdata(title)}</title>\n`;
      xml += `      <link>${escapeXml(frontendLink)}</link>\n`;
      xml += `      <guid isPermaLink="true">${escapeXml(frontendLink)}</guid>\n`;
      xml += `      <pubDate>${pubDate}</pubDate>\n`;
      xml += `      <dc:creator>${cdata(authorName)}</dc:creator>\n`;
      // Plain-text summary (RSS description field)
      xml += `      <description>${cdata(excerpt)}</description>\n`;
      // Full HTML content
      xml += `      <content:encoded>${cdata(fullContent)}</content:encoded>\n`;

      if (imageUrl) {
        // <enclosure> — canonical image signal for most RSS readers
        xml += `      <enclosure url="${escapeXml(imageUrl)}" type="${imageMime}" length="0" />\n`;

        // <media:content> — Pinterest primary image field
        let mediaAttrs = `url="${escapeXml(imageUrl)}" medium="image" type="${imageMime}"`;
        if (imageWidth) mediaAttrs += ` width="${imageWidth}"`;
        if (imageHeight) mediaAttrs += ` height="${imageHeight}"`;
        xml += `      <media:content ${mediaAttrs}>\n`;
        xml += `        <media:title>${cdata(imageAlt)}</media:title>\n`;
        xml += `        <media:description>${cdata(excerpt)}</media:description>\n`;
        xml += `      </media:content>\n`;

        // <media:thumbnail> — Pinterest also reads this for preview images
        let thumbAttrs = `url="${escapeXml(imageUrl)}"`;
        if (imageWidth) thumbAttrs += ` width="${imageWidth}"`;
        if (imageHeight) thumbAttrs += ` height="${imageHeight}"`;
        xml += `      <media:thumbnail ${thumbAttrs} />\n`;
      }

      xml += `    </item>\n`;
    }

    xml += `  </channel>\n`;
    xml += `</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Feed-Count': String(posts.length),
      },
    });
  } catch (error) {
    console.error('[rss-feed] generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}
