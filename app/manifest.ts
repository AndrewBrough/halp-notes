import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Halp notes',
    short_name: 'Halp',
    description: 'A simple notes app with tags',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffc107',
    icons: [
      {
        src: '/icon.png',
        sizes: '50x50',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}