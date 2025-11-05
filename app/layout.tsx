import type { Metadata } from 'next'
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
      <body>{children}</body>
    </html>
  )
}
