import type { Metadata } from 'next'
import { inter, sourceSerif } from './fonts'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    default: 'Akshay Malhotra',
    template: '%s | Akshay Malhotra',
  },
  description: 'Senior software engineer building reliable distributed systems.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
