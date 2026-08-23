import { Source_Serif_4, Inter } from 'next/font/google'

export const sourceSerif = Source_Serif_4({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

export const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})
