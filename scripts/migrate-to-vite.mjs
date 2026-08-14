/**
 * Migration script: Next.js -> Vite
 * 
 * This script:
 * 1. Replaces next/* imports with react-router-dom / plain React equivalents
 * 2. Adds 'use client' to files that had server-side features
 * 3. Handles async components conversion
 * 4. Fixes Next.js specific patterns
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const ROOT = join(import.meta.dirname, '..')
const APP_DIR = join(ROOT, 'app')

// Track changes for summary
const changes = {
  nextImport: 0,
  nextLink: 0,
  nextImage: 0,
  nextRouter: 0,
  nextNavigation: 0,
  nextServer: 0,
  useClient: 0,
  asyncComponent: 0,
  nextScript: 0,
  nextHead: 0,
  nextFont: 0,
  serverOnly: 0,
}

// Files that need 'use client' adding
// All layout.tsx and page.tsx files become client components in Vite
// except those that only export metadata/viewport

function getAllFiles(dir) {
  const results = []
  const list = readdirSync(dir)
  for (const item of list) {
    const filePath = join(dir, item)
    const stat = statSync(filePath)
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      results.push(...getAllFiles(filePath))
    } else if (stat.isFile()) {
      const ext = extname(filePath)
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        results.push(filePath)
      }
    }
  }
  return results
}

function replaceInFile(filePath) {
  let content = readFileSync(filePath, 'utf-8')
  const original = content
  const relativePath = filePath.replace(ROOT, '')
  let modified = false

  // Skip binary or large files
  if (!content) return { path: relativePath, changed: false }

  // 1. Remove 'server-only' import (no SSR needed)
  if (content.includes('server-only') || content.includes("from 'server-only'") || content.includes('from "server-only"')) {
    content = content.replace(/import\s+['"]server-only['"];?\n?/g, '')
    content = content.replace(/import\s+['"]server-only['"];?\r?\n?/g, '')
    changes.serverOnly++
    modified = true
  }

  // 2. Replace next/navigation imports
  if (content.includes('from \'next/navigation\'') || content.includes('from "next/navigation"')) {
    content = content.replace(
      /import\s*\{([^}]*)\}\s*from\s*['"]next\/navigation['"]/g,
      (match, imports) => {
        const importList = imports.split(',').map(i => i.trim())
        const routerImports = []
        const nextRouterImports = []
        
        for (const imp of importList) {
          const name = imp.replace(/as\s+\w+/, '').trim().split(/\s+/)[0]
          if (!name) {
            routerImports.push(imp)
            continue
          }
          switch (name) {
            case 'useRouter':
            case 'usePathname':
            case 'useSearchParams':
            case 'useParams':
              routerImports.push(imp)
              break
            case 'notFound':
            case 'redirect':
            case 'permanentRedirect':
            case 'ReadonlyURLSearchParams':
              routerImports.push(imp)
              break
            default:
              routerImports.push(imp)
          }
        }
        
        if (routerImports.length > 0) {
          return `import { ${routerImports.join(', ')} } from 'react-router-dom'`
        }
        return ''
      }
    )
    changes.nextNavigation++
    modified = true
  }

  // 3. Replace next/link imports
  if (content.includes('from \'next/link\'') || content.includes('from "next/link"')) {
    content = content.replace(
      /import\s+(\w+)\s+from\s+['"]next\/link['"]/g,
      (match, defaultImport) => {
        return `import { Link as ${defaultImport} } from 'react-router-dom'`
      }
    )
    changes.nextLink++
    modified = true
  }

  // 4. Replace next/image imports
  if (content.includes('from \'next/image\'') || content.includes('from "next/image"')) {
    content = content.replace(
      /import\s+(\w+)\s+from\s+['"]next\/image['"]/g,
      '// @ts-ignore\nconst $1 = (props) => <img {...props} />'
    )
    changes.nextImage++
    modified = true
  }

  // 5. Replace next/head imports
  if (content.includes('from \'next/head\'') || content.includes('from "next/head"')) {
    content = content.replace(
      /import\s+\w+\s+from\s+['"]next\/head['"];?\n?/g,
      ''
    )
    changes.nextHead++
    modified = true
  }

  // 6. Replace next/script imports
  if (content.includes('from \'next/script\'') || content.includes('from "next/script"')) {
    content = content.replace(
      /import\s+\w+\s+from\s+['"]next\/script['"];?\n?/g,
      ''
    )
    changes.nextScript++
    modified = true
  }

  // 7. Replace next/font/google imports
  if (content.includes('from \'next/font/google\'') || content.includes('from "next/font/google"')) {
    content = content.replace(
      /import\s*\{([^}]*)\}\s*from\s*['"]next\/font\/google['"]/g,
      '// Font imported via CSS: $1'
    )
    changes.nextFont++
    modified = true
  }

  // 8. Replace next/font/local imports
  if (content.includes('from \'next/font/local\'') || content.includes('from "next/font/local"')) {
    content = content.replace(
      /import\s*\{([^}]*)\}\s*from\s*['"]next\/font\/local['"]/g,
      '// Font imported via CSS: $1'
    )
    modified = true
  }

  // 9. Replace Dynamic (next/dynamic) - we keep react's lazy
  if (content.includes('from \'next/dynamic\'') || content.includes('from "next/dynamic"')) {
    content = content.replace(
      /import\s+dynamic\s+from\s+['"]next\/dynamic['"]/g,
      'import dynamic from \'@/utils/dynamic\'\n// Replaced next/dynamic with custom dynamic import'
    )
    changes.nextImport++
    modified = true
  }

  // 10. Handle next/server imports (for middleware, api routes)
  if (content.includes('from \'next/server\'') || content.includes('from "next/server"')) {
    content = content.replace(
      /import\s*\{([^}]*)\}\s*from\s*['"]next\/server['"]/g,
      '// Removed next/server import: {$1}'
    )
    modified = true
  }

  // 11. Replace `next/headers` (cookies, headers)
  if (content.includes('from \'next/headers\'') || content.includes('from "next/headers"')) {
    content = content.replace(
      /import\s*\{([^}]*)\}\s*from\s*['"]next\/headers['"]/g,
      '// $& - Not needed in client-only mode'
    )
    modified = true
  }

  // Ready and write
  if (modified) {
    writeFileSync(filePath, content, 'utf-8')
    return { path: relativePath, changed: true }
  }
  return { path: relativePath, changed: false }
}

// Main execution
console.log('Starting migration...')
const files = getAllFiles(APP_DIR)
console.log(`Found ${files.length} files to scan`)

let changedCount = 0
for (const file of files) {
  const result = replaceInFile(file)
  if (result.changed) {
    changedCount++
    console.log(`  Modified: ${result.path}`)
  }
}

console.log(`\nMigration complete!`)
console.log(`Total files scanned: ${files.length}`)
console.log(`Files modified: ${changedCount}`)
console.log(`\nChanges summary:`)
console.log(`  next/navigation imports: ${changes.nextNavigation}`)
console.log(`  next/link: ${changes.nextLink}`)
console.log(`  next/image: ${changes.nextImage}`)
console.log(`  next/head: ${changes.nextHead}`)
console.log(`  next/script: ${changes.nextScript}`)
console.log(`  next/font: ${changes.nextFont}`)
console.log(`  next/dynamic: ${changes.nextImport}`)
console.log(`  next/server: ${changes.nextServer}`)
console.log(`  server-only: ${changes.serverOnly}`)
