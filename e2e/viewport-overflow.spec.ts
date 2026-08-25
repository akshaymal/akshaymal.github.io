import { test, expect } from '@playwright/test'
import { getAllPosts } from '../lib/posts'

const routes = [
  '/',
  '/experience',
  '/projects',
  '/beyond-work',
  '/blog',
  ...getAllPosts().map((post) => `/blog/${post.slug}`),
]

const viewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 16 Pro', width: 393, height: 852 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
]

for (const route of routes) {
  for (const viewport of viewports) {
    test(`${route} has no horizontal overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto(route)

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })
  }
}
