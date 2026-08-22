#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const budget = JSON.parse(readFileSync(join(process.cwd(), 'bundle-budget.json'), 'utf8'))
const chunksDir = join(process.cwd(), '.next', 'static', 'chunks')

function totalSize(dir) {
  let total = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      total += totalSize(path)
    } else if (entry.name.endsWith('.js')) {
      total += statSync(path).size
    }
  }
  return total
}

const totalBytes = totalSize(chunksDir)
const totalKb = Math.round(totalBytes / 1024)

console.log(`Total JS in .next/static/chunks: ${totalKb} KB (budget: ${budget.maxTotalKb} KB)`)

if (totalKb > budget.maxTotalKb) {
  console.error(`Bundle size budget exceeded: ${totalKb} KB > ${budget.maxTotalKb} KB`)
  process.exit(1)
}
