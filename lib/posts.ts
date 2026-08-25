import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  summary: string
}

export interface Post extends PostMeta {
  content: string
}

function readSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), 'utf8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        summary: data.summary as string,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    summary: data.summary as string,
    content,
  }
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
