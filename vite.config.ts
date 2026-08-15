import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load env files manually so NEXT_PUBLIC_* vars are available
const env = loadEnv('development', __dirname, '')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Handle .mdx files
    {
      name: 'mdx-component-loader',
      enforce: 'pre',
      transform(code: string, id: string) {
        if (!id.endsWith('.mdx')) return
        const imports: string[] = []
        const body = code.replace(/^import\s+.*?;\n?/gm, (m) => {
          imports.push(m)
          return ''
        })
        const escaped = body
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\${/g, '\\${')
        return {
          code: `
${imports.join('\n')}
import React from 'react'
import { jsx as _jsx } from 'react/jsx-runtime'
const content = \`${escaped}\`
export default function MDXContent(props) {
  return _jsx('div', { className: 'mdx-content raw-mdx', dangerouslySetInnerHTML: { __html: content } })
}`,
          map: null,
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '~@': path.resolve(__dirname, '.'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    proxy: {
      '/console/api': {
        target: process.env.VITE_API_PREFIX || 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router-dom')) {
            return 'vendor'
          }
        },
      },
    },
  },
  define: {
    'process.env.NEXT_PUBLIC_DEPLOY_ENV': JSON.stringify(env.NEXT_PUBLIC_DEPLOY_ENV || 'DEVELOPMENT'),
    'process.env.NEXT_PUBLIC_BASE_PATH': JSON.stringify(env.NEXT_PUBLIC_BASE_PATH || ''),
    'process.env.NEXT_PUBLIC_API_PREFIX': JSON.stringify(env.NEXT_PUBLIC_API_PREFIX || ''),
    'process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX': JSON.stringify(env.NEXT_PUBLIC_PUBLIC_API_PREFIX || ''),
    'process.env.NEXT_PUBLIC_MARKETPLACE_API_PREFIX': JSON.stringify(env.NEXT_PUBLIC_MARKETPLACE_API_PREFIX || ''),
    'process.env.NEXT_PUBLIC_MARKETPLACE_URL_PREFIX': JSON.stringify(env.NEXT_PUBLIC_MARKETPLACE_URL_PREFIX || ''),
    'process.env.NEXT_PUBLIC_EDITION': JSON.stringify(env.NEXT_PUBLIC_EDITION || ''),
    'process.env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN': JSON.stringify(env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN || ''),
    'process.env.NEXT_PUBLIC_SENTRY_DSN': JSON.stringify(env.NEXT_PUBLIC_SENTRY_DSN || ''),
    'process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE': JSON.stringify(env.NEXT_PUBLIC_MAINTENANCE_NOTICE || ''),
    'process.env.NEXT_PUBLIC_SITE_ABOUT': JSON.stringify(env.NEXT_PUBLIC_SITE_ABOUT || ''),
    'process.env.NEXT_PUBLIC_TEXT_GENERATION_TIMEOUT_MS': JSON.stringify(env.NEXT_PUBLIC_TEXT_GENERATION_TIMEOUT_MS || ''),
    'process.env.NEXT_PUBLIC_MAX_TOOLS_NUM': JSON.stringify(env.NEXT_PUBLIC_MAX_TOOLS_NUM || ''),
    'process.env.NEXT_PUBLIC_MAX_PARALLEL_LIMIT': JSON.stringify(env.NEXT_PUBLIC_MAX_PARALLEL_LIMIT || ''),
    'process.env.NEXT_PUBLIC_TOP_K_MAX_VALUE': JSON.stringify(env.NEXT_PUBLIC_TOP_K_MAX_VALUE || ''),
    'process.env.NEXT_PUBLIC_INDEXING_MAX_SEGMENTATION_TOKENS_LENGTH': JSON.stringify(env.NEXT_PUBLIC_INDEXING_MAX_SEGMENTATION_TOKENS_LENGTH || ''),
    'process.env.NEXT_PUBLIC_LOOP_NODE_MAX_COUNT': JSON.stringify(env.NEXT_PUBLIC_LOOP_NODE_MAX_COUNT || ''),
    'process.env.NEXT_PUBLIC_MAX_ITERATIONS_NUM': JSON.stringify(env.NEXT_PUBLIC_MAX_ITERATIONS_NUM || ''),
    'process.env.NEXT_PUBLIC_MAX_TREE_DEPTH': JSON.stringify(env.NEXT_PUBLIC_MAX_TREE_DEPTH || ''),
    'process.env.NEXT_PUBLIC_ALLOW_UNSAFE_DATA_SCHEME': JSON.stringify(env.NEXT_PUBLIC_ALLOW_UNSAFE_DATA_SCHEME || ''),
    'process.env.NEXT_PUBLIC_ENABLE_WEBSITE_JINAREADER': JSON.stringify(env.NEXT_PUBLIC_ENABLE_WEBSITE_JINAREADER || ''),
    'process.env.NEXT_PUBLIC_ENABLE_WEBSITE_FIRECRAWL': JSON.stringify(env.NEXT_PUBLIC_ENABLE_WEBSITE_FIRECRAWL || ''),
    'process.env.NEXT_PUBLIC_ENABLE_WEBSITE_WATERCRAWL': JSON.stringify(env.NEXT_PUBLIC_ENABLE_WEBSITE_WATERCRAWL || ''),
    'process.env.NEXT_PUBLIC_ZENDESK_WIDGET_KEY': JSON.stringify(env.NEXT_PUBLIC_ZENDESK_WIDGET_KEY || ''),
    'process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_ENVIRONMENT': JSON.stringify(env.NEXT_PUBLIC_ZENDESK_FIELD_ID_ENVIRONMENT || ''),
    'process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_VERSION': JSON.stringify(env.NEXT_PUBLIC_ZENDESK_FIELD_ID_VERSION || ''),
    'process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_EMAIL': JSON.stringify(env.NEXT_PUBLIC_ZENDESK_FIELD_ID_EMAIL || ''),
    'process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_WORKSPACE_ID': JSON.stringify(env.NEXT_PUBLIC_ZENDESK_FIELD_ID_WORKSPACE_ID || ''),
    'process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_PLAN': JSON.stringify(env.NEXT_PUBLIC_ZENDESK_FIELD_ID_PLAN || ''),
    'process.env.NEXT_PUBLIC_ALLOW_EMBED': JSON.stringify(env.NEXT_PUBLIC_ALLOW_EMBED || ''),
    'process.env.NEXT_PUBLIC_CSP_WHITELIST': JSON.stringify(env.NEXT_PUBLIC_CSP_WHITELIST || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})
