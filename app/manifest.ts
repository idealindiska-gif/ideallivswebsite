import type { MetadataRoute } from 'next'
import { siteConfig } from '@/site.config'

export default function manifest(): MetadataRoute.Manifest {
  const base = siteConfig.site_domain;
  return {
    name: 'Ideal Indiska LIVS',
    short_name: 'Ideal LIVS',
    description: 'Your trusted source for authentic Indian and Pakistani groceries in Stockholm.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#2d6a4f',
    icons: [
      {
        src: `${base}/favicon.svg?v=2`,
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: `${base}/icon-512.png?v=2`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${base}/favicon-32x32.png?v=2`,
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: `${base}/favicon.ico?v=2`,
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
