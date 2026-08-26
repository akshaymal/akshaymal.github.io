'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Download } from 'lucide-react'
import { navItems } from '@/lib/nav-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { ContactDropdown } from '@/components/contact-dropdown'
import { Mark } from '@/components/mark'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname()
  return (
    <>
      {navItems.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors hover:text-primary',
              isActive ? 'text-primary' : 'text-muted-foreground',
              className
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </>
  )
}

export function Nav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <Mark className="h-6 w-6 shrink-0 text-foreground" />
          <span className="whitespace-nowrap font-serif text-lg font-semibold sm:hidden lg:inline">Akshay Malhotra</span>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-3 sm:flex lg:gap-6">
          <NavLinks />
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex shiny-outline">
            <a href="/resume.pdf" download="Akshay-Malhotra-Resume.pdf" rel="nofollow noreferrer">
              <Download className="h-4 w-4" />
              Resume
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon" className="lg:hidden shiny-outline">
            <a href="/resume.pdf" download="Akshay-Malhotra-Resume.pdf" rel="nofollow noreferrer" aria-label="Download resume">
              <Download className="h-4 w-4" />
            </a>
          </Button>
          <ContactDropdown className="hidden lg:block" />
          <ContactDropdown compact className="hidden sm:block lg:hidden" />
          <ContactDropdown compact className="sm:hidden" />
          <ThemeToggle />
        </div>
      </div>

      <nav
        aria-label="Page navigation"
        className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border bg-muted/40 px-4 py-2.5 sm:hidden"
      >
        <NavLinks />
      </nav>
    </header>
  )
}
