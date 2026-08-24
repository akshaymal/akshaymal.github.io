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
            {/*
              The fallback values here (117px / 85px) match the footer's real
              rendered height at each breakpoint exactly (mobile two-row vs.
              sm:+ single-row — see components/footer.tsx), so the static
              export's first paint already reserves the right amount of space
              with no client-side correction (a fallback that overshot "for
              safety" would itself cause a layout shift once
              components/footer.tsx's ResizeObserver sets the live --footer-h
              value to the real, smaller number). If the footer's
              content/height changes, update these to match.
            */}
            <main className="flex-1 pb-[var(--footer-h,117px)] sm:pb-[var(--footer-h,85px)]">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
