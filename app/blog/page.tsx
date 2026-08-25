import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, formatPostDate } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: "Writing from Akshay Malhotra on engineering and how this site gets built.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold">Blog</h1>
      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="depth-card p-3.5 min-[800px]:p-5">
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="text-lg font-semibold hover:text-primary">{post.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.summary}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
