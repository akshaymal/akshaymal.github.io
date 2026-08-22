export interface ExperienceEntry {
  slug: string
  company: string
  title: string
  startDate: string
  endDate: string | null
  summary: string
  highlights: string[]
}

export const experience: ExperienceEntry[] = []
