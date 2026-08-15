'use client'
import i18n from 'i18next'
import { camelCase } from 'lodash-es'
import { initReactI18next } from 'react-i18next'

const requireSilent = async (lang: string, namespace: string) => {
  let res
  try {
    res = (await import(`../i18n/${lang}/${namespace}.ts`)).default
  }
  catch {
    res = (await import(`../i18n/en-US/${namespace}.ts`)).default
  }
  return res
}

const NAMESPACES = [
  'app-annotation',
  'app-api',
  'app-debug',
  'app-log',
  'app-overview',
  'app',
  'billing',
  'common',
  'custom',
  'dataset-creation',
  'dataset-documents',
  'dataset-hit-testing',
  'dataset-pipeline',
  'dataset-settings',
  'dataset',
  'education',
  'explore',
  'layout',
  'login',
  'oauth',
  'pipeline',
  'plugin-tags',
  'plugin',
  'register',
  'run-log',
  'share',
  'time',
  'tools',
  'workflow',
]

export const loadLangResources = async (lang: string) => {
  const modules = await Promise.all(
    NAMESPACES.map(ns => requireSilent(lang, ns)),
  )
  const resources = modules.reduce((acc, mod, index) => {
    acc[camelCase(NAMESPACES[index])] = mod
    return acc
  }, {} as Record<string, any>)
  return resources
}

// Initialize i18n with empty resources first
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: undefined,
    fallbackLng: 'en-US',
    resources: {
      'en-US': {
        translation: {},
      },
    },
  })
}

// Immediately start loading en-US resources in the background
const enUSLoadPromise = loadLangResources('en-US')
enUSLoadPromise.then((resources) => {
  if (Object.keys(resources).length > 0) {
    i18n.addResourceBundle('en-US', 'translation', resources, true, true)
    // Trigger re-render if current language is en-US
    if (!i18n.language || i18n.language === 'en-US')
      i18n.changeLanguage('en-US')
  }
})

export const changeLanguage = async (lng?: string) => {
  if (!lng) return
  // Wait for en-US preload first
  await enUSLoadPromise
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    const resource = await loadLangResources(lng)
    i18n.addResourceBundle(lng, 'translation', resource, true, true)
  }
  await i18n.changeLanguage(lng)
}

export default i18n
