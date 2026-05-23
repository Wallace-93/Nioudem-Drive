import type { Metadata, Viewport } from 'next'
import './globals.css'
import { MobileNav } from '@/components/mobile-nav'

export const metadata: Metadata = {
  title: 'NiouDem Drive',
  description: 'Trouvez votre moniteur auto-école idéal en Île-de-France. Matching intelligent, réservation en ligne, progression suivie.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NiouDem Drive',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'NiouDem Drive',
    description: 'La plateforme des moniteurs indépendants en Île-de-France',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0F1E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-background">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased pb-safe">
        {children}
        <MobileNav />
      </body>
    </html>
  )
}
