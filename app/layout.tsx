import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NiouDem Drive',
  description: 'Marketplace de mise en relation moniteurs auto-école et élèves en Île-de-France',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-background">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
