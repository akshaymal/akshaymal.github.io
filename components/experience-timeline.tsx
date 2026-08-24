'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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

export function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const lockedRef = useRef(false)
  const reducedMotionRef = useRef(false)

  // Keep the --experience-nav-h custom property current when the window is
  // resized (e.g. the nav wrapping to a second line). The initial value is
  // set synchronously by the inline script below, before first paint, so
  // this effect never causes a visible correction on load — only on an
  // actual live resize, which Lighthouse's CLS audit doesn't measure.
  // (Footer clearance is handled separately, via the shared --footer-h
  // property that components/footer.tsx itself publishes — see the calc below.)
  useEffect(() => {
    function updateNavHeight() {
      const header = document.querySelector('header')
      const height = header?.getBoundingClientRect().height ?? 65
      document.documentElement.style.setProperty('--experience-nav-h', `${height}px`)
    }
    window.addEventListener('resize', updateNavHeight)
    return () => window.removeEventListener('resize', updateNavHeight)
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
        Sets --experience-nav-h to the nav's real rendered height before the
        browser's first paint, so the container below never needs a client-side
        correction after load (which would show up as layout shift). Same
        technique next-themes (wired in via components/theme-provider.tsx)
        relies on internally to avoid a flash of the wrong theme: a
        synchronous script, positioned after the element it measures, blocks
        rendering until it has run.

        Footer clearance (--footer-h, used in the calc below) is published by
        components/footer.tsx itself via a layout effect, not here — the footer
        is a sibling that renders after this component, so it can't be measured
        by a script that runs this early.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var h=document.querySelector('header');document.documentElement.style.setProperty('--experience-nav-h',(h?h.getBoundingClientRect().height:65)+'px')})()`,
        }}
      />
      <nav
        aria-label="Experience timeline navigation"
        className="flex w-14 flex-none flex-col items-center gap-1 border-r border-border py-6 sm:w-20"
      >
        {entries.map((entry, i) => (
          <button
            key={entry.slug}
            type="button"
            onClick={() => goToIndex(i)}
            aria-current={activeIndex === i ? 'true' : undefined}
            aria-label={`${entry.company}, ${entry.startDate.slice(0, 4)}`}
            className={cn(
              'rounded-md px-2 py-2 text-sm font-medium tabular-nums transition-colors hover:text-primary',
              activeIndex === i ? 'text-primary font-semibold' : 'text-muted-foreground'
            )}
          >
            {entry.startDate.slice(0, 4)}
          </button>
        ))}
      </nav>

      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Experience timeline"
        onKeyDown={handleKeyDown}
        className={cn(
          'flex-1 snap-y snap-mandatory overflow-y-scroll motion-reduce:scroll-auto motion-reduce:snap-none',
          // Fallbacks (117px / 85px) match <main>'s own — see the comment in
          // app/layout.tsx — so first paint needs no client-side correction.
          'h-[calc(100dvh-var(--experience-nav-h,65px)-var(--footer-h,117px))]',
          'sm:h-[calc(100dvh-var(--experience-nav-h,65px)-var(--footer-h,85px))]'
        )}
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
            <div data-scroll-region className="max-h-full w-full max-w-2xl overflow-y-auto py-12">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-serif text-2xl font-semibold">
                  {entry.title} · {entry.company}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {formatDate(entry.startDate)} – {formatDate(entry.endDate)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
              <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-relaxed">
                {entry.highlights.map((highlight, j) => (
                  <li key={j}>{highlight}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
