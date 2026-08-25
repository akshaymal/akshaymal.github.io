'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ExperienceEntry } from '@/content/experience'

const TRANSITION_MS = 600

function formatDate(date: string | null): string {
  if (date === null) return 'Present'
  const [year, month] = date.split('-')
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${monthNames[Number(month) - 1]} ${year}`
}

interface YearGroup {
  year: string
  entries: { entry: ExperienceEntry; index: number }[]
}

// Groups entries by their start-date year (in array order, so first-appearance
// order determines rail order), collapsing multiple entries in the same year
// into one node the rail cycles through on activation.
function groupByStartYear(entries: ExperienceEntry[]): YearGroup[] {
  const groups: YearGroup[] = []
  const byYear = new Map<string, YearGroup>()
  entries.forEach((entry, index) => {
    const year = entry.startDate.slice(0, 4)
    let group = byYear.get(year)
    if (!group) {
      group = { year, entries: [] }
      byYear.set(year, group)
      groups.push(group)
    }
    group.entries.push({ entry, index })
  })
  return groups
}

// Which entry within a (possibly multi-entry) year group is "current" for
// label/cycling purposes: whichever one matches the active panel, or the
// first entry if the group isn't the active one.
function activeSubIndex(group: YearGroup, activeIndex: number): number {
  const idx = group.entries.findIndex((e) => e.index === activeIndex)
  return idx === -1 ? 0 : idx
}

function railLabel(group: YearGroup, activeIndex: number): string {
  if (group.entries.length === 1) return group.entries[0].entry.shortName
  const sub = activeSubIndex(group, activeIndex)
  return `${group.entries[sub].entry.shortName} · ${sub + 1}/${group.entries.length}`
}

function railAriaLabel(group: YearGroup, activeIndex: number): string {
  const sub = activeSubIndex(group, activeIndex)
  const { entry } = group.entries[sub]
  return group.entries.length === 1
    ? `${entry.company}, ${group.year}`
    : `${entry.company}, ${group.year}, entry ${sub + 1} of ${group.entries.length}`
}

function CompanyMark({ entry, className }: { entry: ExperienceEntry; className?: string }) {
  const [logoFailed, setLogoFailed] = useState(false)

  if (entry.logo && !logoFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={entry.logo}
        alt=""
        onError={() => setLogoFailed(true)}
        className={cn('rounded-full object-contain', className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary text-primary-foreground',
        className
      )}
    >
      <span className="font-serif font-bold">{entry.shortName}</span>
    </div>
  )
}

export function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedRef = useRef(false)
  const reducedMotionRef = useRef(false)

  const yearGroups = useMemo(() => groupByStartYear(entries), [entries])

  // Keep the --experience-nav-h and --experience-rail-left custom properties
  // current when the window is resized (e.g. the nav wrapping to a second
  // line, or the nav wordmark's centered inset shifting on a wide monitor).
  // The initial values are set synchronously by the inline script below,
  // before first paint, so this effect never causes a visible correction on
  // load — only on an actual live resize, which Lighthouse's CLS audit
  // doesn't measure.
  useEffect(() => {
    function updateMeasurements() {
      const header = document.querySelector('header')
      const wordmark = header?.querySelector('span')
      const height = header?.getBoundingClientRect().height ?? 65
      const left = wordmark?.getBoundingClientRect().left ?? 24
      document.documentElement.style.setProperty('--experience-nav-h', `${height}px`)
      document.documentElement.style.setProperty('--experience-rail-left', `${left}px`)
    }
    window.addEventListener('resize', updateMeasurements)
    return () => window.removeEventListener('resize', updateMeasurements)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = query.matches
    const listener = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  const goToIndex = useCallback((index: number) => {
    const container = containerRef.current
    const panel = panelRefs.current[index]
    if (!container || !panel) return

    lockedRef.current = true
    // Each panel is h-full (one container-height tall), so its offset within
    // the container's own scroll coordinate space is a simple multiple of the
    // container height. `panel.offsetTop` is relative to `offsetParent`
    // (the document, since nothing here is CSS-positioned) rather than the
    // scroll container, so it can't be used directly here.
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: reducedMotionRef.current ? 'auto' : 'smooth',
    })
    setActiveIndex(index)
    window.setTimeout(() => {
      lockedRef.current = false
    }, reducedMotionRef.current ? 0 : TRANSITION_MS)
  }, [])

  const handleYearClick = useCallback(
    (group: YearGroup) => {
      const isGroupActive = group.entries.some((e) => e.index === activeIndex)
      const sub = isGroupActive
        ? (activeSubIndex(group, activeIndex) + 1) % group.entries.length
        : 0
      goToIndex(group.entries[sub].index)
    },
    [activeIndex, goToIndex]
  )

  // Desktop wheel interception: one gesture -> one panel, single smooth transition,
  // no native scroll-then-corrective-snap double motion. Touch swipe on mobile is
  // left alone entirely and falls back to native CSS scroll-snap.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleWheel(e: WheelEvent) {
      if (lockedRef.current) {
        e.preventDefault()
        return
      }

      const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
      if (direction === 0) return

      // If the active panel has its own scrollable content (a long highlights
      // list) that hasn't reached its edge yet, let that scroll natively
      // instead of advancing to the next/previous panel.
      const activePanel = panelRefs.current[activeIndex]
      const scrollable = activePanel?.querySelector<HTMLElement>('[data-scroll-region]')
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        const atTop = scrollable.scrollTop <= 0
        const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1
        if ((direction === 1 && !atBottom) || (direction === -1 && !atTop)) {
          // Always forward the scroll manually rather than relying on the
          // browser's native fallback: the event's real target can be
          // outside `scrollable` (blank margin beside the centered content),
          // and native scrolling only follows the target's own ancestor
          // chain in that case — which would scroll the outer snap
          // container instead, fighting its own scroll-snap. Handling
          // every case here uniformly avoids that.
          e.preventDefault()
          const pixelDelta =
            e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * scrollable.clientHeight : e.deltaY
          scrollable.scrollTop += pixelDelta
          return
        }
      }

      const nextIndex = activeIndex + direction
      if (nextIndex < 0 || nextIndex >= entries.length) {
        // At the first/last panel: don't intercept, so the gesture chains to
        // the surrounding page scroll (e.g. reaching the footer).
        return
      }

      e.preventDefault()
      goToIndex(nextIndex)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [activeIndex, entries.length, goToIndex])

  // Tracks the active panel for both the JS-driven desktop path and native
  // touch-swipe scrolling on mobile, so the year index stays in sync either way.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (observerEntries) => {
        for (const entry of observerEntries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = panelRefs.current.findIndex((panel) => panel === entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        }
      },
      { root: container, threshold: [0.6] }
    )

    panelRefs.current.forEach((panel) => panel && observer.observe(panel))
    return () => observer.disconnect()
  }, [entries.length])

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (lockedRef.current) return
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault()
      goToIndex(Math.min(activeIndex + 1, entries.length - 1))
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault()
      goToIndex(Math.max(activeIndex - 1, 0))
    }
  }

  return (
    <div className="flex">
      {/*
        Sets --experience-nav-h to the nav's real rendered height and
        --experience-rail-left to the nav wordmark's left offset before the
        browser's first paint, so the container below never needs a client-side
        correction after load (which would show up as layout shift). Same
        technique next-themes (wired in via components/theme-provider.tsx)
        relies on internally to avoid a flash of the wrong theme: a
        synchronous script, positioned after the elements it measures, blocks
        rendering until it has run.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var h=document.querySelector('header');var w=h&&h.querySelector('span');var height=h?h.getBoundingClientRect().height:65;var left=w?w.getBoundingClientRect().left:24;document.documentElement.style.setProperty('--experience-nav-h',height+'px');document.documentElement.style.setProperty('--experience-rail-left',left+'px')})()`,
        }}
      />

      {/* Mobile year strip (below 800px): a slim vertical strip, no dark capsule. */}
      <nav
        aria-label="Experience timeline navigation"
        className="flex w-14 flex-none flex-col items-center justify-evenly border-r border-border py-5 min-[800px]:hidden"
      >
        {yearGroups.map((group) => {
          const isActive = group.entries.some((e) => e.index === activeIndex)
          return (
            <button
              key={group.year}
              type="button"
              onClick={() => handleYearClick(group)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={railAriaLabel(group, activeIndex)}
              className="flex flex-col items-center gap-1 px-1 py-1"
            >
              <span
                className={cn(
                  'block h-1.5 w-1.5 rounded-full',
                  isActive ? 'bg-primary' : 'border border-muted-foreground/40 bg-background'
                )}
              />
              <span
                className={cn(
                  'text-[11px] font-medium tabular-nums',
                  isActive ? 'font-semibold text-primary' : 'text-muted-foreground'
                )}
              >
                {group.year}
              </span>
              {group.entries.length > 1 && (
                <span className="whitespace-nowrap text-[8px] font-semibold text-muted-foreground/70">
                  {railLabel(group, activeIndex)}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Desktop year index (800px+): a dark capsule anchored to the same left
          inset as the nav wordmark, not the raw viewport edge — a raw-edge rail
          disappears on a large monitor because it's nowhere near the reading
          column. */}
      <div
        className="hidden flex-none items-center justify-center min-[800px]:flex"
        style={{ width: 116, marginLeft: 'var(--experience-rail-left, 24px)' }}
      >
        <nav
          aria-label="Experience timeline navigation"
          className="relative flex h-[78%] w-[104px] flex-col items-center justify-evenly rounded-full py-8 shadow-lg"
          style={{ background: 'hsl(var(--rail-bg))' }}
        >
          <div
            className="absolute left-1/2 top-10 bottom-10 w-px -translate-x-1/2"
            style={{ background: 'hsl(var(--rail-ink) / 0.16)' }}
          />
          {yearGroups.map((group) => {
            const isActive = group.entries.some((e) => e.index === activeIndex)
            return (
              <button
                key={group.year}
                type="button"
                onClick={() => handleYearClick(group)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={railAriaLabel(group, activeIndex)}
                className="relative z-10 flex flex-col items-center gap-1.5 px-2.5 py-1"
                style={{ background: 'hsl(var(--rail-bg))' }}
              >
                {isActive ? (
                  <span
                    className="block h-[18px] w-[18px] rounded-full"
                    style={{
                      background: 'hsl(var(--primary))',
                      boxShadow: '0 0 0 5px hsl(var(--rail-bg)), 0 0 0 7px hsl(var(--primary) / 0.35)',
                    }}
                  />
                ) : (
                  <span
                    className="block h-3 w-3 rounded-full border-2"
                    style={{ borderColor: 'hsl(var(--rail-ink) / 0.28)' }}
                  />
                )}
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: isActive ? 'hsl(19 75% 60%)' : 'hsl(var(--rail-ink) / 0.62)' }}
                >
                  {group.year}
                </span>
                <span
                  className={cn(
                    'whitespace-nowrap text-[10px] font-semibold',
                    !isActive && group.entries.length === 1 && 'uppercase tracking-wide'
                  )}
                  style={{ color: isActive ? 'hsl(var(--rail-ink) / 0.65)' : 'hsl(var(--rail-ink) / 0.4)' }}
                >
                  {railLabel(group, activeIndex)}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Experience timeline"
        onKeyDown={handleKeyDown}
        style={{ height: 'calc(100dvh - var(--experience-nav-h, 65px))' }}
        className="flex-1 snap-y snap-mandatory overflow-y-scroll motion-reduce:scroll-auto motion-reduce:snap-none"
      >
        {entries.map((entry, i) => (
          <section
            key={entry.slug}
            ref={(el) => {
              panelRefs.current[i] = el
            }}
            aria-label={`${entry.title} at ${entry.company}`}
            className="flex h-full snap-start items-center justify-center px-6"
          >
            <div
              data-scroll-region
              className="flex max-h-full w-full max-w-4xl flex-col gap-6 overflow-y-auto py-12 min-[800px]:flex-row min-[800px]:items-center min-[800px]:gap-16"
            >
              {/* Identity block: logo/initials, company name, date range. Stacks
                  above the details on mobile; becomes its own left column on desktop. */}
              <div className="flex items-center gap-4 min-[800px]:w-[220px] min-[800px]:flex-none min-[800px]:flex-col min-[800px]:items-start min-[800px]:gap-6">
                <CompanyMark
                  entry={entry}
                  className="h-12 w-12 flex-none text-base min-[800px]:h-[88px] min-[800px]:w-[88px] min-[800px]:text-2xl"
                />
                <div className="min-w-0">
                  <div className="font-serif text-lg font-semibold leading-tight min-[800px]:text-2xl">
                    {entry.company}
                  </div>
                  <div className="mt-0.5 text-sm text-muted-foreground tabular-nums min-[800px]:mt-2 min-[800px]:text-base">
                    {formatDate(entry.startDate)} – {formatDate(entry.endDate)}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border min-[800px]:hidden" />

              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-xl font-semibold min-[800px]:text-3xl">{entry.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
                <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-relaxed">
                  {entry.highlights.map((highlight, j) => (
                    <li key={j}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
