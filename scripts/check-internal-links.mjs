#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const routes = new Set()

function collectRoutes(dir, base = '') {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      collectRoutes(full, `${base}/${entry.name}`)
    } else if (entry.name === 'page.tsx') {
      routes.add(base === '' ? '/' : base)
    }
  }
}
collectRoutes(join(process.cwd(), 'app'))

const hrefPattern = /href=["'](\/[^"'#?]*)["']/g
const errors = []

function scanFile(path) {
  const content = readFileSync(path, 'utf8')
  let match
  while ((match = hrefPattern.exec(content))) {
    const href = match[1].replace(/\/$/, '') || '/'
    if (!routes.has(href)) {
      errors.push(`${relative(process.cwd(), path)}: broken internal link "${match[1]}"`)
    }
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (statSync(full).isDirectory()) {
      walk(full)
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      scanFile(full)
    }
  }
}

walk(join(process.cwd(), 'app'))
walk(join(process.cwd(), 'components'))

if (errors.length > 0) {
  console.error('Broken internal links found:\n' + errors.join('\n'))
  process.exit(1)
}
console.log(`Checked internal links. Known routes: ${[...routes].join(', ')}`)
