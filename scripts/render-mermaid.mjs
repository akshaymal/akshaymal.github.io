#!/usr/bin/env node
// Renders every ```mermaid fence in content/posts/*.mdx to static light/dark
// SVGs under public/mermaid/ at build time. Runs as an npm "prebuild" hook,
// before `next build`, so the MDX pipeline can embed plain <img> tags with
// no client-side rendering.
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { chromium } from '@playwright/test'

const postsDir = resolve(process.cwd(), 'content/posts')
const outDir = resolve(process.cwd(), 'public/mermaid')
const mermaidScriptPath = resolve(process.cwd(), 'node_modules/mermaid/dist/mermaid.min.js')

// Matches the site's warm palette (app/globals.css) so diagrams don't clash
// with Mermaid's default theme. `themeVariables.xyChart.plotColorPalette`
// must be a comma-separated list of hex colors, not hsl(...) — Mermaid
// splits that string on "," to get individual colors, which breaks on the
// commas inside hsl()'s own syntax.
const lightThemeVariables = {
  background: 'hsl(38, 44%, 96%)',
  primaryColor: 'hsl(38, 25%, 90%)',
  primaryTextColor: 'hsl(33, 17%, 10%)',
  primaryBorderColor: 'hsl(19, 75%, 44%)',
  lineColor: 'hsl(19, 75%, 44%)',
  textColor: 'hsl(33, 17%, 10%)',
  mainBkg: 'hsl(38, 25%, 90%)',
  secondaryColor: 'hsl(38, 20%, 90%)',
  tertiaryColor: 'hsl(38, 20%, 85%)',
  nodeBorder: 'hsl(19, 75%, 44%)',
  clusterBkg: 'hsl(38, 20%, 90%)',
  clusterBorder: 'hsl(38, 20%, 85%)',
  edgeLabelBackground: 'hsl(38, 44%, 96%)',
  pie1: 'hsl(19, 75%, 44%)',
  pie2: 'hsl(12, 76%, 61%)',
  pie3: 'hsl(173, 58%, 39%)',
  pie4: 'hsl(197, 37%, 24%)',
  pie5: 'hsl(43, 74%, 66%)',
  pie6: 'hsl(27, 87%, 67%)',
  pieOuterStrokeColor: 'hsl(19, 75%, 44%)',
  pieOpacity: '1',
  xyChart: {
    backgroundColor: 'hsl(38, 44%, 96%)',
    titleColor: 'hsl(33, 17%, 10%)',
    xAxisTitleColor: 'hsl(33, 17%, 10%)',
    xAxisLabelColor: 'hsl(33, 17%, 10%)',
    xAxisTickColor: 'hsl(33, 17%, 10%)',
    xAxisLineColor: 'hsl(33, 17%, 10%)',
    yAxisTitleColor: 'hsl(33, 17%, 10%)',
    yAxisLabelColor: 'hsl(33, 17%, 10%)',
    yAxisTickColor: 'hsl(33, 17%, 10%)',
    yAxisLineColor: 'hsl(33, 17%, 10%)',
    plotColorPalette: '#c4511c,#e76e50,#2a9d90,#274754,#e8c468',
  },
}

const darkThemeVariables = {
  background: 'hsl(33, 17%, 10%)',
  primaryColor: 'hsl(33, 12%, 18%)',
  primaryTextColor: 'hsl(38, 44%, 96%)',
  primaryBorderColor: 'hsl(19, 75%, 44%)',
  lineColor: 'hsl(19, 75%, 44%)',
  textColor: 'hsl(38, 44%, 96%)',
  mainBkg: 'hsl(33, 12%, 18%)',
  secondaryColor: 'hsl(33, 12%, 18%)',
  tertiaryColor: 'hsl(33, 12%, 22%)',
  nodeBorder: 'hsl(19, 75%, 44%)',
  clusterBkg: 'hsl(33, 15%, 13%)',
  clusterBorder: 'hsl(33, 12%, 22%)',
  edgeLabelBackground: 'hsl(33, 17%, 10%)',
  pie1: 'hsl(19, 75%, 44%)',
  pie2: 'hsl(220, 70%, 50%)',
  pie3: 'hsl(160, 60%, 45%)',
  pie4: 'hsl(30, 80%, 55%)',
  pie5: 'hsl(280, 65%, 60%)',
  pie6: 'hsl(340, 75%, 55%)',
  pieOuterStrokeColor: 'hsl(19, 75%, 44%)',
  pieOpacity: '1',
  xyChart: {
    backgroundColor: 'hsl(33, 17%, 10%)',
    titleColor: 'hsl(38, 44%, 96%)',
    xAxisTitleColor: 'hsl(38, 44%, 96%)',
    xAxisLabelColor: 'hsl(38, 44%, 96%)',
    xAxisTickColor: 'hsl(38, 44%, 96%)',
    xAxisLineColor: 'hsl(38, 44%, 96%)',
    yAxisTitleColor: 'hsl(38, 44%, 96%)',
    yAxisLabelColor: 'hsl(38, 44%, 96%)',
    yAxisTickColor: 'hsl(38, 44%, 96%)',
    yAxisLineColor: 'hsl(38, 44%, 96%)',
    plotColorPalette: '#c4511c,#2662d9,#2eb88a,#e88c30,#af57db',
  },
}

function hashOf(code) {
  return createHash('sha256').update(code).digest('hex').slice(0, 12)
}

// Line-based fence scan (not a single multi-line regex) so a diagram whose
// own source happens to contain a literal "```" can't truncate extraction
// early or desync matching for fences later in the same file. A fence, per
// CommonMark, is a line that is *only* backticks (the opening line may carry
// an info string like "mermaid" after them).
function extractMermaidFences(content, filename) {
  const lines = content.split('\n')
  const fences = []
  let i = 0
  while (i < lines.length) {
    const opening = lines[i].trim()
    if (opening === '```mermaid') {
      const body = []
      let j = i + 1
      let closed = false
      while (j < lines.length) {
        if (lines[j].trim() === '```') {
          closed = true
          break
        }
        body.push(lines[j])
        j++
      }
      if (!closed) {
        throw new Error(`Unterminated \`\`\`mermaid fence in ${filename} (starting at line ${i + 1}).`)
      }
      const code = body.join('\n').trim()
      if (code.length === 0) {
        throw new Error(`Empty \`\`\`mermaid fence in ${filename} (starting at line ${i + 1}).`)
      }
      fences.push(code)
      i = j + 1
    } else {
      i++
    }
  }
  return fences
}

function collectDiagrams() {
  const diagrams = new Map()
  if (!existsSync(postsDir)) return diagrams
  for (const entry of readdirSync(postsDir)) {
    if (!entry.endsWith('.mdx')) continue
    const content = readFileSync(join(postsDir, entry), 'utf8')
    for (const code of extractMermaidFences(content, entry)) {
      diagrams.set(hashOf(code), code)
    }
  }
  return diagrams
}

async function renderWithTheme(browser, code, themeVariables) {
  const page = await browser.newPage()
  try {
    await page.setContent('<!doctype html><html><body></body></html>')
    await page.addScriptTag({ path: mermaidScriptPath })
    return await page.evaluate(
      async ({ code, themeVariables, id }) => {
        // eslint-disable-next-line no-undef
        mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables })
        // eslint-disable-next-line no-undef
        const { svg } = await mermaid.render(id, code)
        return svg
      },
      { code, themeVariables, id: `mermaid-${Math.random().toString(36).slice(2)}` }
    )
  } finally {
    await page.close()
  }
}

async function main() {
  const diagrams = collectDiagrams()

  rmSync(outDir, { recursive: true, force: true })
  if (diagrams.size === 0) {
    console.log('No mermaid diagrams found in content/posts/*.mdx.')
    return
  }
  mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  try {
    for (const [hash, code] of diagrams) {
      const [light, dark] = await Promise.all([
        renderWithTheme(browser, code, lightThemeVariables),
        renderWithTheme(browser, code, darkThemeVariables),
      ])
      writeFileSync(join(outDir, `${hash}-light.svg`), light)
      writeFileSync(join(outDir, `${hash}-dark.svg`), dark)
    }
  } finally {
    await browser.close()
  }

  console.log(`Rendered ${diagrams.size} mermaid diagram(s) to public/mermaid/.`)
}

main().catch((error) => {
  console.error('Failed to render mermaid diagrams:', error)
  process.exit(1)
})
