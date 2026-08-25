import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

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

function parsePost(slug: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), 'utf8')
  const { data, content } = matter(raw)

  for (const field of ['title', 'summary'] as const) {
    if (typeof data[field] !== 'string' || data[field].trim() === '') {
      throw new Error(`content/posts/${slug}.mdx: frontmatter "${field}" must be a non-empty string`)
    }
  }
  if (typeof data.date !== 'string' || !DATE_PATTERN.test(data.date)) {
    throw new Error(
      `content/posts/${slug}.mdx: frontmatter "date" must be a quoted "YYYY-MM-DD" string (got ${JSON.stringify(
        data.date
      )}) — an unquoted date is parsed by YAML as a Date object, not a string`
    )
  }

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
    content,
  }
}

// Reads happen at build time only (static export), so a module-level cache
// just avoids re-parsing the same file across getAllPosts/getPostBySlug/generateMetadata calls.
const postCache = new Map<string, Post>()

function getParsedPost(slug: string): Post {
  let post = postCache.get(slug)
  if (!post) {
    post = parsePost(slug)
    postCache.set(slug, post)
  }
  return post
}

export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map((slug) => getParsedPost(slug))
    .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post {
  return getParsedPost(slug)
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
