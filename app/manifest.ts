import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Notes App',
    short_name: 'Notes',
    description: 'A simple notes app with tags',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1976d2',
    icons: [
      {
        src: '/icon.png',
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