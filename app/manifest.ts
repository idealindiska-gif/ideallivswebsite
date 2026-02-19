import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
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
        src: 'https://crm.ideallivs.com/wp-content/uploads/2026/02/ideal-favicon.svg?v=1',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: 'https://crm.ideallivs.com/wp-content/uploads/2025/05/ideal-favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
