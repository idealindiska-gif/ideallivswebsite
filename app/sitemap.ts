/**
 * This file is intentionally minimal.
 * The actual sitemap is served by /api/sitemap/* routes.
 * See next.config.js rewrites: /sitemap.xml → /api/sitemap
 */
import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.ideallivs.com';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
    ];
}
