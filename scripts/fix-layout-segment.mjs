/**
 * Replace useSelectedLayoutSegment and useSelectedLayoutSegments
 * from react-router-dom with custom shim
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const ROOT = join(import.meta.dirname, '..')
const APP_DIR = join(ROOT, 'app')

function getAllFiles(dir) {
  const results = []
  const list = readdirSync(dir)
  for (const item of list) {
    const filePath = join(dir, item)
    if (item.startsWith('.') || item === 'node_modules') continue
    if (statSync(filePath).isDirectory()) {
      results.push(...getAllFiles(filePath))
    } else {
      const ext = extname(filePath)
      if (['.ts', '.tsx'].includes(ext)) {
        results.push(filePath)
      }
    }
  }
  return results
}

let count = 0
const files = getAllFiles(APP_DIR)

// Also handle utility files outside app/
const extraDirs = [join(ROOT, 'utils'), join(ROOT, 'hooks'), join(ROOT, 'context')]
for (const dir of extraDirs) {
  try {
    files.push(...getAllFiles(dir))
  } catch {}
}

const replacements = [
  { from: 'useSelectedLayoutSegment', to: 'useSelectedLayoutSegment', module: '@/utils/use-selected-layout-segment' },
  { from: 'useSelectedLayoutSegments', to: 'useSelectedLayoutSegments', module: '@/utils/use-selected-layout-segment' },
]

for (const file of files) {
  let content = readFileSync(file, 'utf-8')
  const original = content
  let modified = false

  for (const { from, to, module: mod } of replacements) {
    const importPattern = new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*['"]react-router-dom['"]`)
    const match = content.match(importPattern)
    
    if (match) {
      const imports = match[1].split(',').map(i => i.trim())
      const hasItem = imports.some(i => i === from || i.startsWith(from) || i.includes(from))
      
      if (hasItem) {
        // Remove from react-router-dom imports
        const filteredImports = imports.filter(i => i !== from && !i.startsWith(from + ' ') && !i.includes(from + ' ') && !i.startsWith(from + ',') && i !== from)
        const onlyCommas = filteredImports.every(i => i === '' || i === ',')
        
        if (filteredImports.length > 0 && !onlyCommas) {
          content = content.replace(match[0], `import { ${filteredImports.join(', ')} } from 'react-router-dom'`)
        } else {
          content = content.replace(match[0] + '\n', '')
          content = content.replace(match[0], '')
        }

        // Add new import from our shim
        // Find last import line to insert after
        const importLines = content.match(/^import .+$/gm)
        if (importLines) {
          const lastImport = importLines[importLines.length - 1]
          const lastImportIndex = content.lastIndexOf(lastImport)
          if (lastImportIndex >= 0) {
            const insertPos = lastImportIndex + lastImport.length
            content = content.slice(0, insertPos) + `\nimport { ${to} } from '${mod}'` + content.slice(insertPos)
          }
        }
        modified = true
      }
    }
  }

  if (modified) {
    writeFileSync(file, content, 'utf-8')
    console.log(`  Fixed: ${file.replace(ROOT, '')}`)
    count++
  }
}

console.log(`\nFixed ${count} files.`)
