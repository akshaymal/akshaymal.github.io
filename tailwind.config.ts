import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'teal': '#335C67',
        'cream': '#FFF3B0',
        'gold': '#E09F3E',
        'burgundy': '#9E2A2B',
        'maroon': '#540B0E',
      },
    },
  },
  plugins: [],
}
export default config
