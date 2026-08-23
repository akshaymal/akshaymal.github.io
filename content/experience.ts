export interface ExperienceEntry {
  slug: string
  company: string
  title: string
  startDate: string
  endDate: string | null
  summary: string
  highlights: string[]
}

export const experience: ExperienceEntry[] = [
  {
    slug: 'ernst-young-senior-technology-consulting',
    company: 'Ernst & Young',
    title: 'Senior, Technology Consulting',
    startDate: '2023-10',
    endDate: null,
    summary: 'Charlotte, North Carolina',
    highlights: [
      'Reduced processing time by 95% for agentic workflows, improving code and infrastructure concurrency.',
      'Increased agentic workflow success rate by 18%, resolving API race conditions and streamlining blob storage usage.',
      'Built resiliency mechanisms for 10+ distributed microservices, reducing outages by 22%.',
      'Built a reusable utility for dynamic SSL connectivity using trust and key stores, adopted by 3 services on startup.',
      'Developed validation and authentication interceptors following security best practices, reducing redundancy.',
      'Engineered Kafka partitioning logic for event-driven workflows, improving performance and reducing overhead.',
      'Oversaw integration of Microsoft EntraID into services; built a utility for API token generation and caching.',
      'Led technical mentorship for 5+ engineers on distributed systems architecture and drove hiring through 10+ technical interviews.',
    ],
  },
  {
    slug: 'zs-associates-software-engineer',
    company: 'ZS Associates Inc.',
    title: 'Software Engineer',
    startDate: '2023-07',
    endDate: '2023-09',
    summary: 'Evanston, Illinois',
    highlights: [
      'Led GraphQL integration across the frontend and conducted migration POCs, accelerating go-to-market by 2 years.',
      "Owned a core module's readability and maintainability, reviewing contributions and refactoring source code.",
    ],
  },
  {
    slug: 'zs-associates-software-engineer-intern',
    company: 'ZS Associates Inc.',
    title: 'Software Engineer Intern',
    startDate: '2022-06',
    endDate: '2023-01',
    summary: 'Evanston, Illinois',
    highlights: [
      'Developed an employee management and insights portal, including CRUD operations, historical sales data import, and on-demand sales insights generation.',
      "Contributed to ZAIDYN's product requirements and built a full-stack module for its incentive workflow.",
    ],
  },
  {
    slug: 'infoedge-senior-software-engineer',
    company: 'InfoEdge India Limited',
    title: 'Senior Software Engineer',
    startDate: '2018-01',
    endDate: '2021-06',
    summary: 'Noida, India',
    highlights: [
      'Optimized SaaS platform services (175rps), including APIs, ETL batch pipelines, schedulers, and Kafka consumers.',
      "Architected and built scalable RESTful APIs for a core microservice, reducing response time by 3x.",
      'Expedited the SDLC of several web pages, increasing page views by 18% and lead generation by 15%.',
      'Developed an aggregator web service organizing webpage business logic, reducing outage time by 25%.',
      'Awarded the Excellence Award for exceptional contribution to business success.',
    ],
  },
]
