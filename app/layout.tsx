import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Grenze, Texturina } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _grenze = Grenze({ 
  subsets: ["latin"],
  weight: ['400','700'],
  variable: '--font-grenze'
});

const _texturina = Texturina({
  subsets: ["latin"],
  variable: '--font-texturina'
});

export const metadata: Metadata = {
  title: 'Thủ Lĩnh Thẻ Bài - Element Card Generator',
  description: 'Premium Vietnamese Trading Card Game - Thủ Lĩnh Thẻ Bài',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_grenze.variable} ${_texturina.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
