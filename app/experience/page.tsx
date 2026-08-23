import type { Metadata } from 'next'
import { experience } from '@/content/experience'
import { ExperienceTimeline } from '@/components/experience-timeline'

export const metadata: Metadata = {
  title: 'Experience',
  description: "Akshay Malhotra's professional experience.",
}

export default function ExperiencePage() {
  return (
    <>
      <h1 className="sr-only">Experience</h1>
      <ExperienceTimeline entries={experience} />
    </>
  )
}
