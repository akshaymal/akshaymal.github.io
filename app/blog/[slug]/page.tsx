import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllPosts, getPostBySlug, formatPostDate } from '@/lib/posts'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug)
  return {
    title: post.title,
    description: post.summary,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </p>
      <div className="blog-prose mt-10">
        <MDXRemote
          source={post.content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          components={{
            table: (props) => (
              <div className="overflow-x-auto">
                <table {...props} />
              </div>
            ),
          }}
        />
      </div>
    </div>
  )
}
