import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: "Akshay Malhotra's projects.",
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold">Projects</h1>
      <div className="mt-10 space-y-12">
        {projects.map((project) => (
          <article key={project.slug} className="depth-card p-3.5 min-[800px]:p-5">
            <h2 className="text-lg font-semibold">
              {project.link ? (
                <Link href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {project.title}
                </Link>
              ) : (
                project.title
              )}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{project.summary}</p>
            <dl className="mt-4 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="font-medium">Problem</dt>
                <dd className="text-muted-foreground">{project.problem}</dd>
              </div>
              <div>
                <dt className="font-medium">Role</dt>
                <dd className="text-muted-foreground">{project.role}</dd>
              </div>
              <div>
                <dt className="font-medium">Decision</dt>
                <dd className="text-muted-foreground">{project.decision}</dd>
              </div>
              <div>
                <dt className="font-medium">Outcome</dt>
                <dd className="text-muted-foreground">{project.outcome}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
