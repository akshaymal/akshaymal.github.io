import type { Metadata } from 'next'
import { almarai } from './fonts'
import './globals.css'

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
