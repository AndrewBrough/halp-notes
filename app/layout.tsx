import './globals.css'
import { Inter, Cedarville_Cursive } from 'next/font/google'
import { ClientLayout } from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })
const cedarville = Cedarville_Cursive({ 
  weight: '400',
  subsets: ['latin'] 
})

export const metadata = {
  title: 'Notes App',
  description: 'A simple notes app with tags',
  manifest: '/manifest.json',
  themeColor: '#1976d2',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Notes App',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const isDark = localStorage.getItem('isDarkMode') === 'true';
              const themeKey = localStorage.getItem('themeKey') || 'gold';
              const themes = {
                gold: { light: '#fffdf5', dark: '#1a1500' },
                purple: { light: '#faf5fb', dark: '#1a071d' },
                ocean: { light: '#f5f5f5', dark: '#0a1929' },
                forest: { light: '#f5faf5', dark: '#071a07' }
              };
              document.documentElement.style.backgroundColor = 
                isDark ? themes[themeKey].dark : themes[themeKey].light;
            } catch (e) {
              document.documentElement.style.backgroundColor = '#fffdf5';
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}