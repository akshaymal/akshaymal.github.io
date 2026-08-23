# Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Spec 2 (Direction D visual identity, config-driven nav, trimmed page set, real Experience/Projects content, SEO/analytics) per `docs/superpowers/specs/2026-08-22-site-redesign-design.md`.

**Architecture:** Palette/typography live as CSS variables + Tailwind tokens (existing shadcn pattern, values swapped for Direction D — no new theming system introduced). Dark mode via `next-themes` (class-based, matches existing `darkMode: ['class']` config). Nav is a plain data array consumed by one component, not hardcoded per-page. Old sidebar-based nav (`components/app-sidebar.tsx`, `components/ui/sidebar.tsx`, `components/ui/collapsible.tsx`) and the five `app/hobbies/*` routes are removed as dead code once the top-nav/`beyond-work` replacements land.

**Tech Stack:** Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, shadcn/ui, `next-themes` (new), `@vercel/analytics` (new).

---

## Task 1: Direction D palette and font tokens

**Files:**
- Modify: `app/fonts.ts`
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace fonts**

Replace the full contents of `app/fonts.ts`:

```typescript
import { Source_Serif_4, Inter } from 'next/font/google'

export const sourceSerif = Source_Serif_4({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

export const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})
```

- [ ] **Step 2: Update `tailwind.config.ts`**

Remove the old brand colors (`teal`, `cream`, `gold`, `burgundy`, `maroon`) and the `sidebar` color block from `theme.extend.colors` (sidebar is removed in Task 11 — removing the token now is fine since nothing outside `components/ui/sidebar.tsx` and `components/app-sidebar.tsx` references it, and both are deleted in this same redesign). Add a `fontFamily` block. Resulting `theme.extend` section:

```typescript
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      chart: {
        '1': 'hsl(var(--chart-1))',
        '2': 'hsl(var(--chart-2))',
        '3': 'hsl(var(--chart-3))',
        '4': 'hsl(var(--chart-4))',
        '5': 'hsl(var(--chart-5))'
      }
    },
    fontFamily: {
      serif: ['var(--font-serif)', 'Georgia', 'serif'],
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    }
  }
},
```

(Everything else in the file — `darkMode: ['class']`, `content`, `plugins` — stays unchanged.)

- [ ] **Step 3: Update `app/globals.css`**

Replace the `@layer base { :root { ... } .dark { ... } }` block (lines 5-75) with Direction D's values. `--chart-*` and `--destructive*` are left unchanged (unrelated to brand palette — chart colors aren't used anywhere yet, destructive is a semantic error color):

```css
@layer base {
  :root {
    --background: 38 44% 96%;
    --foreground: 33 17% 10%;
    --card: 38 44% 96%;
    --card-foreground: 33 17% 10%;
    --popover: 38 44% 96%;
    --popover-foreground: 33 17% 10%;
    --primary: 19 75% 44%;
    --primary-foreground: 38 44% 96%;
    --secondary: 38 25% 90%;
    --secondary-foreground: 33 17% 10%;
    --muted: 38 20% 90%;
    --muted-foreground: 27 12% 32%;
    --accent: 38 25% 90%;
    --accent-foreground: 33 17% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 38 20% 85%;
    --input: 38 20% 85%;
    --ring: 19 75% 44%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 33 17% 10%;
    --foreground: 38 44% 96%;
    --card: 33 15% 13%;
    --card-foreground: 38 44% 96%;
    --popover: 33 15% 13%;
    --popover-foreground: 38 44% 96%;
    --primary: 19 75% 44%;
    --primary-foreground: 38 44% 96%;
    --secondary: 33 12% 18%;
    --secondary-foreground: 38 44% 96%;
    --muted: 33 12% 18%;
    --muted-foreground: 30 12% 65%;
    --accent: 33 12% 18%;
    --accent-foreground: 38 44% 96%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 33 12% 22%;
    --input: 33 12% 22%;
    --ring: 19 75% 44%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

(Keep the `@tailwind base; @tailwind components; @tailwind utilities;` lines at the top of the file unchanged.)

- [ ] **Step 4: Verify compilation**

Run: `npm run typecheck`
Expected: passes (this task only changes CSS/config/font exports, no consumers yet — `npm run build` will be the real visual verification once Task 5 wires fonts into the layout).

- [ ] **Step 5: Commit**

```bash
git add app/fonts.ts tailwind.config.ts app/globals.css
git commit -m "Replace palette and fonts with Direction D (warm base, ember accent, Source Serif 4 + Inter)"
```

---

## Task 2: Install and wire up dark mode toggle

**Files:**
- Modify: `package.json` (add `next-themes`)
- Create: `components/theme-provider.tsx`
- Create: `components/theme-toggle.tsx`

- [ ] **Step 1: Install `next-themes`**

Run: `npm install next-themes`

- [ ] **Step 2: Create `components/theme-provider.tsx`**

```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

- [ ] **Step 3: Create `components/theme-toggle.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
```

The `mounted` guard avoids a hydration mismatch: `resolvedTheme` is `undefined` on the server (no access to the client's system preference or stored choice), so rendering a theme-dependent icon before mount would produce a server/client markup mismatch. `next-themes`'s own docs recommend this pattern.

- [ ] **Step 4: Verify**

Run: `npm run typecheck`
Expected: passes. (Full behavior verified visually once wired into the layout in Task 5.)

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components/theme-provider.tsx components/theme-toggle.tsx
git commit -m "Add dark mode toggle via next-themes"
```

---

## Task 3: Config-driven nav data and Nav component

**Files:**
- Create: `lib/nav-items.ts`
- Create: `components/nav.tsx`

- [ ] **Step 1: Create `lib/nav-items.ts`**

```typescript
export interface NavItem {
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Beyond Work', href: '/beyond-work' },
]
```

- [ ] **Step 2: Create `components/nav.tsx`**

```tsx
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
```

The wordmark is plain text, not a link — `Home` in the nav array already covers the `/` destination, so making both clickable would create two overlapping affordances for the same target.

- [ ] **Step 3: Verify**

Run: `npm run typecheck`
Expected: passes. (`components/nav.tsx` isn't imported anywhere yet — that happens in Task 5 — so this step only confirms the file itself is valid TypeScript/JSX.)

- [ ] **Step 4: Commit**

```bash
git add lib/nav-items.ts components/nav.tsx
git commit -m "Add config-driven top nav data and component"
```

---

## Task 4: Footer component

**Files:**
- Create: `components/footer.tsx`

- [ ] **Step 1: Create `components/footer.tsx`**

```tsx
import Link from 'next/link'
import { Github, Linkedin, Instagram, Mail } from 'lucide-react'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/akshaymal', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akshaymal', icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/akshaymal', icon: Instagram },
  { label: 'Email', href: 'mailto:malhotraakshay1997@gmail.com,amalho23@asu.edu', icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t border-border">
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
```

Social URLs and the combined email addresses are carried over unchanged from the existing `components/app-sidebar.tsx` footer block — not new content, just relocated.

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add components/footer.tsx
git commit -m "Add persistent footer with social/contact links"
```

---

## Task 5: Wire Nav, Footer, ThemeProvider, and fonts into the root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the full contents of `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { inter, sourceSerif } from './fonts'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    default: 'Akshay Malhotra',
    template: '%s | Akshay Malhotra',
  },
  description: 'Senior software engineer building reliable distributed systems.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

`suppressHydrationWarning` on `<html>` is the documented `next-themes` pattern — it sets the `class` attribute (`light`/`dark`) via an inline script before React hydrates, which legitimately differs from the server-rendered markup; without this flag React would log a false-positive hydration warning for that one, expected attribute.

- [ ] **Step 2: Build and visually smoke-test**

Run: `npm run build`
Expected: succeeds. This is the first real integration point — fonts, theme provider, nav, and footer all load together for the first time. If it fails, the error will point at whichever piece is miswired; fix before proceeding.

Then run: `npm run dev` in the background, open `http://localhost:3000` (or use a screenshot tool if available), and confirm: the warm Direction D background/text render, the top nav shows "Home / Experience / Projects / Beyond Work" plus a theme toggle icon, and clicking the toggle switches to the dark palette. Stop the dev server after checking.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "Wire Nav, Footer, and ThemeProvider into the root layout"
```

---

## Task 6: Home page (About combined)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the full contents of `app/page.tsx`**

```tsx
export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
        Senior software engineer building reliable distributed systems.
      </p>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
        I design and build backend systems that hold up under real load — event-driven
        microservices, agentic workflow platforms, and the infrastructure underneath them.
        Currently at Ernst &amp; Young, previously ZS Associates and InfoEdge.
      </p>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
        Off the clock: motorsports, from watching races to marshaling them.
      </p>
    </div>
  )
}
```

The motorsports line stays intentionally brief and unspecific — real detail is deferred to `/beyond-work` (Task 11), which doesn't have real content yet either. This avoids overstating specifics on the homepage that the dedicated page can't yet back up.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: succeeds, `/` renders the new content (confirm via `npm run dev` + browser, or by checking the generated `out/index.html` contains "Senior software engineer").

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Rewrite homepage as combined Home/About with Direction D copy"
```

---

## Task 7: Populate `content/experience.ts` from the resume

**Files:**
- Modify: `content/experience.ts`

- [ ] **Step 1: Replace the full contents of `content/experience.ts`**

```typescript
export interface ExperienceEntry {
  slug: string
  company: string
  title: string
  startDate: string
  endDate: string | null
  summary: string
  highlights: string[]
}

export const experience: ExperienceEntry[] = [
  {
    slug: 'ernst-young-senior-technology-consulting',
    company: 'Ernst & Young',
    title: 'Senior, Technology Consulting',
    startDate: '2023-10',
    endDate: null,
    summary: 'Charlotte, North Carolina',
    highlights: [
      'Reduced processing time by 95% for agentic workflows, improving code and infrastructure concurrency.',
      'Increased agentic workflow success rate by 18%, resolving API race conditions and streamlining blob storage usage.',
      'Built resiliency mechanisms for 10+ distributed microservices, reducing outages by 22%.',
      'Built a reusable utility for dynamic SSL connectivity using trust and key stores, adopted by 3 services on startup.',
      'Developed validation and authentication interceptors following security best practices, reducing redundancy.',
      'Engineered Kafka partitioning logic for event-driven workflows, improving performance and reducing overhead.',
      'Oversaw integration of Microsoft EntraID into services; built a utility for API token generation and caching.',
      'Led technical mentorship for 5+ engineers on distributed systems architecture and drove hiring through 10+ technical interviews.',
    ],
  },
  {
    slug: 'zs-associates-software-engineer',
    company: 'ZS Associates Inc.',
    title: 'Software Engineer',
    startDate: '2023-07',
    endDate: '2023-09',
    summary: 'Evanston, Illinois',
    highlights: [
      'Led GraphQL integration across the frontend and conducted migration POCs, accelerating go-to-market by 2 years.',
      "Owned a core module's readability and maintainability, reviewing contributions and refactoring source code.",
    ],
  },
  {
    slug: 'zs-associates-software-engineer-intern',
    company: 'ZS Associates Inc.',
    title: 'Software Engineer Intern',
    startDate: '2022-06',
    endDate: '2023-01',
    summary: 'Evanston, Illinois',
    highlights: [
      'Developed an employee management and insights portal, including CRUD operations, historical sales data import, and on-demand sales insights generation.',
      "Contributed to ZAIDYN's product requirements and built a full-stack module for its incentive workflow.",
    ],
  },
  {
    slug: 'infoedge-senior-software-engineer',
    company: 'InfoEdge India Limited',
    title: 'Senior Software Engineer',
    startDate: '2018-01',
    endDate: '2021-06',
    summary: 'Noida, India',
    highlights: [
      'Optimized SaaS platform services (175rps), including APIs, ETL batch pipelines, schedulers, and Kafka consumers.',
      "Architected and built scalable RESTful APIs for a core microservice, reducing response time by 3x.",
      'Expedited the SDLC of several web pages, increasing page views by 18% and lead generation by 15%.',
      'Developed an aggregator web service organizing webpage business logic, reducing outage time by 25%.',
      'Awarded the Excellence Award for exceptional contribution to business success.',
    ],
  },
]
```

Sourced directly from the resume the user provided (`C:\Users\malho\Downloads\Akshay Malhotra Resume.pdf`), which the user has flagged as an older version that will be updated — this content is real and usable now, but not final. When the updated resume arrives, run the `sync-resume` skill to reconcile rather than assuming these entries are locked.

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: passes (each entry matches the `ExperienceEntry` interface).

- [ ] **Step 3: Commit**

```bash
git add content/experience.ts
git commit -m "Populate content/experience.ts from resume (provisional — resume flagged for update)"
```

---

## Task 8: Experience page

**Files:**
- Modify: `app/experience/page.tsx`

- [ ] **Step 1: Replace the full contents of `app/experience/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { experience } from '@/content/experience'

export const metadata: Metadata = {
  title: 'Experience',
  description: "Akshay Malhotra's professional experience.",
}

function formatDate(date: string | null): string {
  if (date === null) return 'Present'
  const [year, month] = date.split('-')
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${monthNames[Number(month) - 1]} ${year}`
}

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold">Experience</h1>
      <div className="mt-10 space-y-12">
        {experience.map((entry) => (
          <article key={entry.slug}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-semibold">
                {entry.title} · {entry.company}
              </h2>
              <span className="text-sm text-muted-foreground">
                {formatDate(entry.startDate)} – {formatDate(entry.endDate)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {entry.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: succeeds; check `out/experience/index.html` (or `npm run dev` + browser) shows all 4 entries with their highlights, most-recent (Ernst & Young) first — note the array in Task 7 is already ordered most-recent-first, and this component renders in array order rather than re-sorting, so the array order is load-bearing.

- [ ] **Step 3: Commit**

```bash
git add app/experience/page.tsx
git commit -m "Render Experience page from content/experience.ts"
```

---

## Task 9: Populate `content/projects.ts` from the resume

**Files:**
- Modify: `content/projects.ts`

- [ ] **Step 1: Replace the full contents of `content/projects.ts`**

```typescript
export interface Project {
  slug: string
  title: string
  summary: string
  problem: string
  role: string
  decision: string
  outcome: string
  tags: string[]
  link?: string
}

export const projects: Project[] = [
  {
    slug: 'elastic-cloud-application-scaling',
    title: 'Elastic Application Using Cloud Computing',
    summary: 'An application that scales itself based on real-time request volume and CPU usage.',
    problem: 'Applications need to handle variable load without manual intervention, and the scaling approach needed to work across more than one kind of cloud environment.',
    role: 'Designed and built the application and its scaling logic.',
    decision: 'Built auto-scaling targeting both a public cloud (AWS) and a hybrid cloud (OpenStack) rather than a single provider, so the scaling logic wasn\u2019t tied to one platform\u2019s specific APIs.',
    outcome: 'The application scaled automatically based on request volume and CPU usage across both AWS and OpenStack.',
    tags: ['Cloud Computing', 'AWS', 'OpenStack', 'Auto-scaling'],
  },
  {
    slug: 'multimedia-similarity-search-simulation',
    title: 'Multimedia Storage, Retrieval, and Similarity Simulation',
    summary: 'A simulated database comparing feature representation and indexing techniques for multimedia retrieval.',
    problem: 'Different feature representation, indexing, and classification techniques trade off differently for multimedia storage, retrieval, and similarity search, and those trade-offs needed to be evaluated concretely rather than assumed.',
    role: 'Built the simulation and ran the evaluation.',
    decision: 'Compared multiple feature representation, indexing, and classification techniques against the same dataset rather than committing to a single approach upfront.',
    outcome: 'Benchmarked similarity-search performance across techniques using a dataset of 4,000 images.',
    tags: ['Databases', 'Information Retrieval', 'Data Indexing'],
  },
]
```

Sourced from the resume's "Academic Projects" section, per the user's direction to use the resume's stated projects rather than reframing work-experience achievements as projects. Only 2 entries — within the design doc's "2-4 flagship entries" range, at the low end; more can be added later via the `add-project` skill once available (e.g., if the updated resume adds new project material, or the user wants to feature something not on the resume at all).

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add content/projects.ts
git commit -m "Populate content/projects.ts from resume's Academic Projects section"
```

---

## Task 10: Projects page

**Files:**
- Modify: `app/projects/page.tsx`

- [ ] **Step 1: Replace the full contents of `app/projects/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: "Akshay Malhotra's projects.",
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold">Projects</h1>
      <div className="mt-10 space-y-12">
        {projects.map((project) => (
          <article key={project.slug}>
            <h2 className="text-lg font-semibold">
              {project.link ? (
                <Link href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {project.title}
                </Link>
              ) : (
                project.title
              )}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{project.summary}</p>
            <dl className="mt-4 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="font-medium">Problem</dt>
                <dd className="text-muted-foreground">{project.problem}</dd>
              </div>
              <div>
                <dt className="font-medium">Role</dt>
                <dd className="text-muted-foreground">{project.role}</dd>
              </div>
              <div>
                <dt className="font-medium">Decision</dt>
                <dd className="text-muted-foreground">{project.decision}</dd>
              </div>
              <div>
                <dt className="font-medium">Outcome</dt>
                <dd className="text-muted-foreground">{project.outcome}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: succeeds; check `out/projects/index.html` (or `npm run dev` + browser) shows both entries with problem/role/decision/outcome and tags rendered.

- [ ] **Step 3: Commit**

```bash
git add app/projects/page.tsx
git commit -m "Render Projects page from content/projects.ts"
```

---

## Task 11: Beyond Work page (placeholder content) and hobby route removal

**Files:**
- Create: `app/beyond-work/page.tsx`
- Delete: `app/hobbies/karting/page.tsx`
- Delete: `app/hobbies/motorsports/page.tsx`
- Delete: `app/hobbies/race-marshal/page.tsx`
- Delete: `app/hobbies/sim-racing/page.tsx`
- Delete: `app/hobbies/travel/page.tsx`

- [ ] **Step 1: Create `app/beyond-work/page.tsx`**

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beyond Work',
  description: "Akshay Malhotra's life outside of engineering.",
}

interface Section {
  title: string
  body: string
}

const sections: Section[] = [
  { title: 'Motorsports', body: 'More on this soon.' },
  { title: 'Karting', body: 'More on this soon.' },
  { title: 'Race Marshal', body: 'More on this soon.' },
  { title: 'Sim Racing', body: 'More on this soon.' },
  { title: 'Travel', body: 'More on this soon.' },
]

export default function BeyondWorkPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold">Beyond Work</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        This page is a placeholder — real content for each section below is a tracked
        follow-up, not yet written.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
```

This is deliberately, visibly placeholder content — the user opted to defer real Beyond Work copy to a follow-up content pass rather than have this task fabricate specifics (venues, achievements, dates) it doesn't have. The "This page is a placeholder" line is intentional and should be removed as part of that follow-up work, not left in indefinitely.

- [ ] **Step 2: Delete the five old hobby routes**

```bash
git rm app/hobbies/karting/page.tsx app/hobbies/motorsports/page.tsx app/hobbies/race-marshal/page.tsx app/hobbies/sim-racing/page.tsx app/hobbies/travel/page.tsx
```

If the `app/hobbies/` directory is now empty, remove it too (Next.js App Router doesn't require empty directories to stay).

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds; `/beyond-work` exists in the output, `/hobbies/*` routes no longer exist. Then run `node scripts/check-internal-links.mjs` — expected to pass (no remaining code references `/hobbies/*` once Task 12 removes `components/app-sidebar.tsx`, which is the only place those links existed; if this task runs before Task 12, the link checker will still find `app-sidebar.tsx`'s now-broken `/hobbies/*` links and fail — that's expected and resolved by Task 12, not a bug in this task. Note this dependency and don't treat a failure here as this task's fault if Task 12 hasn't run yet).

- [ ] **Step 4: Commit**

```bash
git add app/beyond-work/page.tsx
git commit -m "Add Beyond Work page (placeholder content) and remove old hobby routes"
```

---

## Task 12: Remove dead sidebar-nav code

**Files:**
- Delete: `components/app-sidebar.tsx`
- Delete: `components/ui/sidebar.tsx`
- Delete: `components/ui/collapsible.tsx`

- [ ] **Step 1: Confirm nothing else references these files**

Run: `grep -rl "app-sidebar\|components/ui/sidebar\|components/ui/collapsible" app components lib --include="*.tsx" --include="*.ts"`
Expected: only the files being deleted themselves show up (or nothing, if grep excludes self-matches in some setups) — confirm no *other* file imports from them before deleting. If something unexpected shows up, stop and report rather than deleting.

- [ ] **Step 2: Delete the files**

```bash
git rm components/app-sidebar.tsx components/ui/sidebar.tsx components/ui/collapsible.tsx
```

- [ ] **Step 3: Check for now-unused dependencies**

`components/ui/sidebar.tsx` and `components/ui/collapsible.tsx` were the only consumers of `@radix-ui/react-collapsible` (per `package.json`). Run: `grep -rl "@radix-ui/react-collapsible" app components lib --include="*.tsx" --include="*.ts"` — if nothing matches (expected, since the only consumer was just deleted), remove `@radix-ui/react-collapsible` from `package.json` `dependencies` and run `npm install` to update the lockfile. Do NOT remove `@radix-ui/react-dialog` or other Radix packages — check what `components/ui/sheet.tsx` (used by the old sidebar's mobile view, but not necessarily unused elsewhere) depends on before touching anything beyond `react-collapsible`; if `sheet.tsx` is now also unused, that's worth noting but removing it is out of scope for this task unless it's a trivial, obviously-safe deletion — don't expand scope mid-task.

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run typecheck && npm run build && node scripts/check-internal-links.mjs`
Expected: all pass. This is the point where the link-checker caveat from Task 11 resolves — with `app-sidebar.tsx` gone, no code references `/hobbies/*` anymore.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "Remove dead sidebar-nav code (app-sidebar, ui/sidebar, ui/collapsible)"
```

---

## Task 13: SEO — metadata, sitemap, Person JSON-LD, analytics

**Files:**
- Modify: `package.json` (add `@vercel/analytics`)
- Modify: `app/layout.tsx`
- Create: `app/sitemap.ts`

- [ ] **Step 1: Install `@vercel/analytics`**

Run: `npm install @vercel/analytics`

- [ ] **Step 2: Create `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://akshaymalhotra.dev'
  const routes = ['', '/experience', '/projects', '/beyond-work']

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}
```

- [ ] **Step 3: Add JSON-LD Person schema and Analytics to `app/layout.tsx`**

Modify `app/layout.tsx` (from Task 5's version) by adding the analytics import and a JSON-LD script in the `<body>`, before the `ThemeProvider`:

```tsx
import type { Metadata } from 'next'
import { inter, sourceSerif } from './fonts'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    default: 'Akshay Malhotra',
    template: '%s | Akshay Malhotra',
  },
  description: 'Senior software engineer building reliable distributed systems.',
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Akshay Malhotra',
  url: 'https://akshaymalhotra.dev',
  jobTitle: 'Senior Software Engineer',
  sameAs: [
    'https://github.com/akshaymal',
    'https://linkedin.com/in/akshaymal',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

No OG image is added in this task — a real Open Graph image needs actual visual design work, which is tracked under the deferred logo/mark work ([#4](https://github.com/akshaymal/akshaymalhotra.dev/issues/4)), not fabricated here as a placeholder graphic. Text-based OpenGraph metadata (title/description, inherited from each page's `metadata` export) still works without an image.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds; check `out/sitemap.xml` exists and lists all 4 routes; check any page's generated HTML contains the `application/ld+json` script tag with the Person schema.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/layout.tsx app/sitemap.ts
git commit -m "Add sitemap, Person JSON-LD schema, and Vercel Analytics"
```

---

## Task 14: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full local gate**

```bash
npm run lint
npm run typecheck
npm run build
node scripts/check-bundle-size.mjs
node scripts/check-internal-links.mjs
```

Expected: all exit 0. If `check-bundle-size.mjs` fails because the new fonts/dependencies (`next-themes`, `@vercel/analytics`) pushed the bundle over the current 1000KB budget, that's a real signal worth reporting accurately (not silently raising the budget again) — report the actual measured size and let the controller decide whether the budget needs another justified adjustment, the same way Task 8 of the harness plan handled it.

- [ ] **Step 2: Visual smoke test**

Run `npm run dev` in the background, and check each route in a browser (or screenshot tool): `/`, `/experience`, `/projects`, `/beyond-work`. Confirm: Direction D palette renders correctly in both light and dark mode (toggle works), nav highlights the active route, footer appears on every page, Experience shows all 4 entries in the right order, Projects shows both entries with full problem/role/decision/outcome. Stop the dev server after checking.

- [ ] **Step 3: Confirm no leftover references to removed content**

Run: `grep -rl "hobbies\|app-sidebar\|Alex_Brush\|Almarai" app components lib --include="*.tsx" --include="*.ts"`
Expected: no matches (all old sidebar/font/hobby references fully removed).

- [ ] **Step 4: Report to the user**

Summarize: Direction D shipped across all pages, dark mode toggle working, real Experience content from the resume, 2 real Projects from the resume's Academic Projects section, Beyond Work is a visible placeholder pending a follow-up content pass, SEO/analytics wired in without a designed OG image (tracked under #4). Nothing to commit in this task — verification only.
