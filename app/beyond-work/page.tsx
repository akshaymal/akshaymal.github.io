import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beyond Work',
  description: "Akshay Malhotra's life outside of engineering.",
}

interface Section {
  title: string
  body: string
}

const sections: Section[] = [
  { title: 'Motorsports', body: 'More on this soon.' },
  { title: 'Karting', body: 'More on this soon.' },
  { title: 'Race Marshal', body: 'More on this soon.' },
  { title: 'Sim Racing', body: 'More on this soon.' },
  { title: 'Travel', body: 'More on this soon.' },
]

export default function BeyondWorkPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold">Beyond Work</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        This page is a placeholder — real content for each section below is a tracked
        follow-up, not yet written.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
