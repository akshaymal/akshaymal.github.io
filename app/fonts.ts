import localFont from 'next/font/local'

export const sourceSerif = localFont({
  src: '../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2',
  weight: '200 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-serif',
})

export const inter = localFont({
  src: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans',
})
