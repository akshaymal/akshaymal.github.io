import type { Metadata } from 'next'
import { Almarai, Alex_Brush } from 'next/font/google'
import './globals.css'

const almarai = Almarai({
  weight: ['300', '400', '700', '800'],
  subsets: ['arabic'],
  display: 'swap',
})

export const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Akshay Malhotra',
  description: 'Personal page of Akshay Malhotra',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={almarai.className}>{children}</body>
    </html>
  )
}
