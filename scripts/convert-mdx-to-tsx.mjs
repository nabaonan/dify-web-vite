/**
 * Convert Dify MDX template files to TSX components
 * This handles the specific MDX format used in develop templates
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, extname, basename } from 'path'

const TEMPLATE_DIR = join(import.meta.dirname, '..', 'app', 'components', 'develop', 'template')

const files = readdirSync(TEMPLATE_DIR).filter(f => f.endsWith('.mdx'))

for (const file of files) {
  const filePath = join(TEMPLATE_DIR, file)
  const content = readFileSync(filePath, 'utf-8')
  const name = basename(file, '.mdx')
  
  // Extract imports
  const imports: string[] = []
  const body = content.replace(/^(import\s+.+?;?\n?)/gm, (m) => {
    imports.push(m)
    return ''
  })

  // Convert to TSX
  const tsxContent = `// Auto-converted from MDX
${imports.join('\n')}
import React from 'react'

type ${camelize(name)}Props = {
  appDetail?: any
  [key: string]: any
}

const ${camelize(name)} = (props: ${camelize(name)}Props) => {
  return (
    <div className="mdx-content">
      {${convertToJSX(body)}}
    </div>
  )
}

export default ${camelize(name)}
`

  const tsxPath = filePath.replace('.mdx', '.tsx')
  writeFileSync(tsxPath, tsxContent)
  console.log(`Converted: ${file} -> ${basename(tsxPath)}`)
}

function camelize(str: string) {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/\.(.)/g, (_, c) => c.toUpperCase())
}

function convertToJSX(mdx: string): string {
  // This is a simplified conversion - for complex MDX we keep as-is
  // and wrap in JSX expression
  const lines = mdx.split('\n')
  const elements: string[] = []
  let inJSX = false

  for (const line of lines) {
    if (line.trim().startsWith('<')) {
      elements.push(line)
      inJSX = true
    } else if (line.trim() === '') {
      if (inJSX) {
        inJSX = false
      }
    } else if (!inJSX) {
      // Markdown line - wrap in JSX
      const processed = line
        .replace(/^### (.+)$/, '<h3>$1</h3>')
        .replace(/^## (.+)$/, '<h2>$1</h2>')
        .replace(/^# (.+)$/, '<h1>$1</h1>')
        .replace(/^- (.+)$/, '<li>$1</li>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
      if (processed !== line || true) {
        elements.push(processed)
      } else {
        elements.push(`<>${line}</>`)
      }
    } else {
      elements.push(line)
    }
  }

  return elements.join('\n')
}
