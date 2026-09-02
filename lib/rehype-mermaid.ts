import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { visit } from 'unist-util-visit'
import type { Element, Root, RootContent, Text } from 'hast'

function hashOf(code: string): string {
  return createHash('sha256').update(code).digest('hex').slice(0, 12)
}

function textContent(node: Element): string {
  let text = ''
  for (const child of node.children) {
    if (child.type === 'text') {
      text += (child as Text).value
    } else if (child.type === 'element') {
      text += textContent(child)
    }
  }
  return text
}

/**
 * Replaces ```mermaid fences with <img> pairs pointing at the light/dark SVGs
 * the "prebuild" script (scripts/render-mermaid.mjs) already rendered into
 * public/mermaid/ — this plugin only wires the MDX output to that static
 * output, it never touches a browser itself.
 */
export function rehypeMermaid() {
  return (tree: Root) => {
    const matches: { node: Element; index: number; parent: Root | Element }[] = []

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return
      if (node.children.length !== 1) return
      const codeNode = node.children[0]
      if (codeNode.type !== 'element' || codeNode.tagName !== 'code') return
      const className = (codeNode.properties?.className as string[] | undefined) ?? []
      if (!className.includes('language-mermaid')) return
      matches.push({ node, index, parent: parent as Root | Element })
    })

    for (const { node, index, parent } of matches) {
      const codeNode = node.children[0] as Element
      const code = textContent(codeNode).trim()
      const hash = hashOf(code)
      const lightPath = path.join(process.cwd(), 'public', 'mermaid', `${hash}-light.svg`)
      const darkPath = path.join(process.cwd(), 'public', 'mermaid', `${hash}-dark.svg`)

      if (!existsSync(lightPath) || !existsSync(darkPath)) {
        throw new Error(
          `Missing rendered SVG for a mermaid diagram (hash ${hash}). The "prebuild" npm script ` +
            'renders content/posts/*.mdx mermaid fences into public/mermaid/ before "next build" runs ' +
            '— run "npm run build" (not just "next build") so prebuild executes first.'
        )
      }

      const replacement: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['mermaid-diagram', 'overflow-x-auto'] },
        children: [
          {
            type: 'element',
            tagName: 'img',
            properties: {
              className: ['block', 'dark:hidden', 'w-full'],
              src: `/mermaid/${hash}-light.svg`,
              alt: 'Diagram',
            },
            children: [],
          },
          {
            type: 'element',
            tagName: 'img',
            properties: {
              className: ['hidden', 'dark:block', 'w-full'],
              src: `/mermaid/${hash}-dark.svg`,
              alt: 'Diagram',
            },
            children: [],
          },
        ],
      }

      parent.children[index] = replacement as RootContent
    }
  }
}
