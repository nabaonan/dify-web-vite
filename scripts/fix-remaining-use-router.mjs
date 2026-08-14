import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dirname, '..')

const files = [
  'app/(shareLayout)/webapp-signin/components/mail-and-password-auth.tsx',
  'app/education-apply/expire-notice-modal.tsx',
  'app/education-apply/hooks.ts',
  'app/signin/normal-form.tsx',
  'app/signin/invite-settings/page.tsx',
  'app/signin/components/mail-and-password-auth.tsx',
  'app/signin/one-more-step.tsx',
  'app/reset-password/page.tsx',
]

let count = 0
for (const filePath of files) {
  const fullPath = join(ROOT, filePath)
  let content = readFileSync(fullPath, 'utf-8')
  
  // Replace import that has useRouter mixed with other imports from react-router-dom
  const patterns = [
    // useRouter with useSearchParams
    /import\s*\{\s*useRouter\s*,\s*useSearchParams\s*\}\s*from\s*['"]react-router-dom['"]/g,
    // useRouter alone
    /import\s*\{\s*useRouter\s*\}\s*from\s*['"]react-router-dom['"]/g,
  ]
  
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, 'import { useSearchParams } from \'react-router-dom\'\nimport { useRouter } from \'@/utils/use-router\'')
      writeFileSync(fullPath, content, 'utf-8')
      console.log(`  Fixed: ${filePath}`)
      count++
      break
    }
  }
}

console.log(`\nFixed ${count} files.`)
