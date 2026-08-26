import { Briefcase, Compass, FolderKanban, House, Newspaper, type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Experience', href: '/experience', icon: Briefcase },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Beyond Work', href: '/beyond-work', icon: Compass },
  { label: 'Blog', href: '/blog', icon: Newspaper },
]
