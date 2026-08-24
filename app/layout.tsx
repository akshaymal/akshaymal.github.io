import type { Metadata } from 'next'
import { inter, sourceSerif } from './fonts'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: {
    default: 'Akshay Malhotra',
    template: '%s | Akshay Malhotra',
  },
  description: 'Senior software engineer building reliable distributed systems.',
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Akshay Malhotra',
  url: 'https://akshaymalhotra.dev',
  jobTitle: 'Senior Software Engineer',
  sameAs: [
    'https://github.com/akshaymal',
    'https://linkedin.com/in/akshaymal',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-dvh flex-col">
            <Nav />
            <main className="flex-1 pb-[var(--footer-h,117px)]">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
