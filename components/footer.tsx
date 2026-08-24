'use client'

import { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Instagram, Mail } from 'lucide-react'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/akshaymal', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akshaymal', icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/akshaymal', icon: Instagram },
  { label: 'Email', href: 'mailto:malhotraakshay1997@gmail.com,amalho23@asu.edu', icon: Mail },
]

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  // The footer is fixed to the viewport bottom, so it no longer reserves its
  // own space in document flow — anything that needs to clear it (the `<main>`
  // padding in app/layout.tsx, the experience timeline's own height calc)
  // reads this single `--footer-h` custom property instead of hardcoding the
  // footer's height, so there's exactly one source of truth and no risk of
  // under- or double-reserving space as the footer's real height changes
  // (e.g. wrapping to two rows on narrow viewports).
  useLayoutEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const setHeight = () => {
      document.documentElement.style.setProperty(
        '--footer-h',
        `${footer.getBoundingClientRect().height}px`
      )
    }

    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background shadow-[0_-1px_3px_0_rgb(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Akshay Malhotra</p>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const isMailto = link.href.startsWith('mailto:')
            return (
              <Link
                key={link.label}
                href={link.href}
                target={isMailto ? undefined : '_blank'}
                rel={isMailto ? undefined : 'noopener noreferrer'}
                aria-label={link.label}
                className="transition-colors hover:text-primary"
              >
                <link.icon className="h-4 w-4" />
              </Link>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
