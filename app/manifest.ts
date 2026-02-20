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
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
