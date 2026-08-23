'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from '@/lib/nav-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

export function Nav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <span className="font-serif text-lg font-semibold">Akshay Malhotra</span>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
