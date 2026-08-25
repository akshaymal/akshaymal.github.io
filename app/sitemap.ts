import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://akshaymalhotra.dev'
  const routes = ['', '/experience', '/projects', '/beyond-work', '/blog']
  const postRoutes = getAllPosts().map((post) => `/blog/${post.slug}`)

  return [...routes, ...postRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}
