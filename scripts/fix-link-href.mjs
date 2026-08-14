/**
 * Replace Link href="..." with Link to="..." in all files
 * Because react-router-dom's Link uses `to` instead of `href`
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
      if (['.tsx', '.ts'].includes(ext)) {
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

  // Replace <Link href= with <Link to=
  // Only replace when Link is from react-router-dom (not next/link which is already replaced)
  // All links in the codebase have already been converted to react-router-dom imports
  content = content.replace(/<Link\s+href=/g, '<Link to=')

  if (content !== original) {
    writeFileSync(file, content, 'utf-8')
    console.log(`  Fixed: ${file.replace(ROOT, '')}`)
    count++
  }
}

console.log(`\nFixed ${count} files.`)
