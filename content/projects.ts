export interface Project {
  slug: string
  title: string
  summary: string
  problem: string
  role: string
  decision: string
  outcome: string
  tags: string[]
  link?: string
}

export const projects: Project[] = []
