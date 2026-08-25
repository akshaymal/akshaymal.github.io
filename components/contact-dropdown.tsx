'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Github, Instagram, Linkedin, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const contactLinks = [
  {
    label: 'Email',
    sublabel: 'Fastest way to reach me',
    href: 'mailto:malhotraakshay1997@gmail.com,amalho23@asu.edu',
    icon: Mail,
  },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akshaymal', icon: Linkedin },
  { label: 'GitHub', href: 'https://github.com/akshaymal', icon: Github },
  { label: 'Instagram', href: 'https://instagram.com/akshaymal', icon: Instagram },
]

export function ContactDropdown({ compact = false, className }: { compact?: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Contact"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90',
          compact ? 'px-3' : 'px-4'
        )}
      >
        <Mail className="h-4 w-4 flex-none" />
        {!compact && <span>Contact</span>}
        <ChevronDown
          className={cn('h-3.5 w-3.5 flex-none transition-transform motion-reduce:transition-none', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Contact links"
          className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] origin-top-right rounded-xl border border-border bg-card/95 p-2 text-card-foreground shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none"
        >
          {contactLinks.map((link) => {
            const isMailto = link.href.startsWith('mailto:')
            return (
              <Link
                key={link.label}
                href={link.href}
                target={isMailto ? undefined : '_blank'}
                rel={isMailto ? undefined : 'noopener noreferrer'}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <link.icon className="h-4 w-4 flex-none text-muted-foreground" />
                <span className="min-w-0">
                  <span className={cn('block', link.sublabel ? 'font-semibold' : 'font-medium')}>{link.label}</span>
                  {link.sublabel && <span className="block text-xs text-muted-foreground">{link.sublabel}</span>}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
