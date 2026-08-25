'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface TimelineCardSubItem {
  title: string
  dates: string
  highlights: string[]
  tags?: string[]
}

export interface TimelineCardProps {
  eyebrow: string
  logo?: { src?: string; initials: string }
  title: string
  subtitle?: string
  meta?: string
  tags?: string[]
  subItems?: TimelineCardSubItem[]
  body: string[]
  size?: 'compact' | 'default'
}

function TagRow({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

function LogoMark({ logo, size }: { logo: { src?: string; initials: string }; size: 'compact' | 'default' }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const dimension = size === 'compact' ? 'h-10 w-10 text-sm' : 'h-14 w-14 text-base'

  if (logo.src && !logoFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo.src}
        alt=""
        onError={() => setLogoFailed(true)}
        className={cn('flex-none rounded-full object-contain', dimension)}
      />
    )
  }
  return (
    <div
      className={cn(
        'flex flex-none items-center justify-center rounded-full bg-primary text-primary-foreground',
        dimension
      )}
    >
      <span className="font-serif font-bold">{logo.initials}</span>
    </div>
  )
}

export function TimelineCard({
  eyebrow,
  logo,
  title,
  subtitle,
  meta,
  tags,
  subItems,
  body,
  size = 'default',
}: TimelineCardProps) {
  const compact = size === 'compact'

  return (
    <div
      className={cn('depth-card', compact ? 'p-3.5' : 'p-3.5 min-[800px]:p-5')}
    >
      <div className="flex items-start gap-4">
        {logo && <LogoMark logo={logo} size={size} />}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              'font-medium tabular-nums text-muted-foreground',
              compact ? 'text-xs' : 'text-xs min-[800px]:text-sm'
            )}
          >
            {eyebrow}
          </div>
          <h3 className={cn('font-serif font-semibold leading-tight', compact ? 'text-lg' : 'text-lg min-[800px]:text-2xl')}>
            {title}
          </h3>
          {subtitle && (
            <p className={cn('mt-0.5 text-muted-foreground', compact ? 'text-sm' : 'text-sm min-[800px]:text-base')}>
              {subtitle}
            </p>
          )}
          {meta && <p className="mt-0.5 text-sm text-muted-foreground">{meta}</p>}
        </div>
      </div>

      {tags && <TagRow tags={tags} />}

      {body.length > 0 && (
        <ul className={cn('list-disc space-y-2.5 pl-5 text-sm leading-relaxed', compact ? 'mt-4' : 'mt-4 min-[800px]:mt-6')}>
          {body.map((highlight, i) => (
            <li key={i}>{highlight}</li>
          ))}
        </ul>
      )}

      {subItems && subItems.length > 0 && (
        <ol
          className={cn(
            'relative space-y-5 border-l border-border pl-5',
            compact ? 'mt-4' : 'mt-4 min-[800px]:mt-6'
          )}
        >
          {subItems.map((item, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border-2 border-primary bg-background" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <span className="text-xs font-medium tabular-nums text-muted-foreground">{item.dates}</span>
              </div>
              {item.tags && <TagRow tags={item.tags} />}
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                {item.highlights.map((highlight, j) => (
                  <li key={j}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
