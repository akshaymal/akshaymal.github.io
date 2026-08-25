import { TimelineCard } from '@/components/timeline-card'
import type { ExperienceEmployer } from '@/content/experience'

function formatDate(date: string | null): string {
  if (date === null) return 'Present'
  const [year, month] = date.split('-')
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${monthNames[Number(month) - 1]} ${year}`
}

function formatRange(startDate: string, endDate: string | null): string {
  return `${formatDate(startDate)} – ${formatDate(endDate)}`
}

export function ExperienceTimeline({ entries }: { entries: ExperienceEmployer[] }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 min-[800px]:px-10">
      <ol className="relative flex flex-col gap-10 before:absolute before:inset-y-1 before:left-[7px] before:w-px before:bg-border min-[800px]:before:left-[15px]">
        {entries.filter((employer) => employer.positions.length > 0).map((employer) => {
          const positions = employer.positions
          const single = positions.length === 1
          const overallStart = positions[positions.length - 1].startDate
          const overallEnd = positions[0].endDate

          return (
            <li key={employer.slug} className="relative pl-9 min-[800px]:pl-14">
              <span className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-primary bg-background min-[800px]:left-[5px] min-[800px]:h-5 min-[800px]:w-5" />
              <TimelineCard
                eyebrow={formatRange(overallStart, overallEnd)}
                logo={{ src: employer.logo, initials: employer.shortName }}
                title={employer.company}
                subtitle={single ? positions[0].title : undefined}
                meta={employer.location}
                tags={single ? positions[0].tags : undefined}
                body={single ? positions[0].highlights : []}
                subItems={
                  single
                    ? undefined
                    : positions.map((position) => ({
                        title: position.title,
                        dates: formatRange(position.startDate, position.endDate),
                        highlights: position.highlights,
                        tags: position.tags,
                      }))
                }
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
