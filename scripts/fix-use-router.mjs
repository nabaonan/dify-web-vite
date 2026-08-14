/**
 * Fix useRouter: replace react-router-dom useRouter with custom useRouter
 * 
 * react-router-dom v6+ does not have useRouter. 
 * We replace it with our custom shim from @/utils/use-router
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

for (const file of files) {
  let content = readFileSync(file, 'utf-8')
  const original = content

  // Check if file imports useRouter from react-router-dom
  const useRouterPattern = /import\s*\{([^}]*)\}\s*from\s*['"]react-router-dom['"]/
  const match = content.match(useRouterPattern)

  if (match) {
    const imports = match[1].split(',').map(i => i.trim())
    
    if (imports.some(i => i === 'useRouter' || i.startsWith('useRouter '))) {
      // Remove useRouter from the react-router-dom import
      const filteredImports = imports.filter(i => i !== 'useRouter' && !i.startsWith('useRouter '))
      
      let newImportLine
      if (filteredImports.length > 0) {
        newImportLine = `import { ${filteredImports.join(', ')} } from 'react-router-dom'`
      } else {
        // If useRouter was the only import, remove the line entirely
        newImportLine = ''
      }

      content = content.replace(match[0], newImportLine)

      // Add useRouter import from our shim
      // Find where to insert
      const importLines = content.match(/^import .+$/gm)
      if (importLines) {
        // Insert after the last import line from react-router-dom
        const lastImportMatch = content.match(/^(import .+)$/gm)
        if (lastImportMatch) {
          const lastImport = lastImportMatch[lastImportMatch.length - 1]
          const lastImportIndex = content.lastIndexOf(lastImport)
          if (lastImportIndex >= 0) {
            const insertPos = lastImportIndex + lastImport.length
            content = content.slice(0, insertPos) + '\nimport { useRouter } from \'@/utils/use-router\'' + content.slice(insertPos)
          }
        }
      }

      if (content !== original) {
        writeFileSync(file, content, 'utf-8')
        console.log(`  Fixed: ${file.replace(ROOT, '')}`)
        count++
      }
    }
  }
}

console.log(`\nFixed ${count} files.`)
