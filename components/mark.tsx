import type { CSSProperties } from 'react'

interface MarkProps {
  className?: string
  style?: CSSProperties
  ink?: string
  accent?: string
  weight?: number
}

/**
 * Site identity mark ("Woven Diamond"): a twin-line diamond frame — the
 * doubled stroke that reads as deliberate redundancy — around a single
 * accent-colored inner diamond and center point.
 */
export function Mark({ className, style, ink = 'currentColor', accent = '#C4511C', weight = 2 }: MarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M24 6.5 L41.5 24 L24 41.5 L6.5 24 Z" fill="none" stroke={ink} strokeWidth={weight} strokeLinejoin="round" />
      <path d="M24 10.5 L37.5 24 L24 37.5 L10.5 24 Z" fill="none" stroke={ink} strokeWidth={weight} strokeLinejoin="round" />
      <path d="M24 18 L30 24 L24 30 L18 24 Z" fill="none" stroke={accent} strokeWidth={weight + 0.2} strokeLinejoin="round" />
      <circle cx={24} cy={24} r={2.2} fill={accent} />
    </svg>
  )
}
