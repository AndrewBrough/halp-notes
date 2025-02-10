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
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}