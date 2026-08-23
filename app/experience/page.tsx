import type { Metadata } from 'next'
import { experience } from '@/content/experience'

export const metadata: Metadata = {
  title: 'Experience',
  description: "Akshay Malhotra's professional experience.",
}

function formatDate(date: string | null): string {
  if (date === null) return 'Present'
  const [year, month] = date.split('-')
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${monthNames[Number(month) - 1]} ${year}`
}

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold">Experience</h1>
      <div className="mt-10 space-y-12">
        {experience.map((entry) => (
          <article key={entry.slug}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-semibold">
                {entry.title} · {entry.company}
              </h2>
              <span className="text-sm text-muted-foreground">
                {formatDate(entry.startDate)} – {formatDate(entry.endDate)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {entry.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
