'use client'

import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import RoutePrefixHandle from './routePrefixHandle'
import I18n from './components/i18n'
import { ToastProvider } from './components/base/toast'
import BrowserInitializer from './components/browser-initializer'
import SentryInitializer from './components/sentry-initializer'
import Zendesk from './components/base/zendesk'
import { TanstackQueryInitializer } from '@/context/query-client'
import { ThemeProvider } from 'next-themes'
import './styles/globals.css'
import './styles/markdown.scss'
import GlobalPublicStoreProvider from '@/context/global-public-context'
import { DatasetAttr } from '@/types/feature'
import { detectLocale } from '@/i18n-config/client'
import Loading from '@/app/components/base/loading'

const AppLayout = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  const [locale, setLocale] = useState<string>('en')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    detectLocale().then((l) => {
      setLocale(l)
      setLoading(false)
    })
  }, [])

  // Set dataset attributes on body element
  useEffect(() => {
    const datasetMap: Record<string, string | undefined> = {
      [DatasetAttr.DATA_API_PREFIX]: process.env.NEXT_PUBLIC_API_PREFIX,
      [DatasetAttr.DATA_PUBLIC_API_PREFIX]: process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX,
      [DatasetAttr.DATA_MARKETPLACE_API_PREFIX]: process.env.NEXT_PUBLIC_MARKETPLACE_API_PREFIX,
      [DatasetAttr.DATA_MARKETPLACE_URL_PREFIX]: process.env.NEXT_PUBLIC_MARKETPLACE_URL_PREFIX,
      [DatasetAttr.DATA_PUBLIC_EDITION]: process.env.NEXT_PUBLIC_EDITION,
      [DatasetAttr.DATA_PUBLIC_SUPPORT_MAIL_LOGIN]: process.env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN,
      [DatasetAttr.DATA_PUBLIC_SENTRY_DSN]: process.env.NEXT_PUBLIC_SENTRY_DSN,
      [DatasetAttr.DATA_PUBLIC_MAINTENANCE_NOTICE]: process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE,
      [DatasetAttr.DATA_PUBLIC_SITE_ABOUT]: process.env.NEXT_PUBLIC_SITE_ABOUT,
      [DatasetAttr.DATA_PUBLIC_TEXT_GENERATION_TIMEOUT_MS]: process.env.NEXT_PUBLIC_TEXT_GENERATION_TIMEOUT_MS,
      [DatasetAttr.DATA_PUBLIC_MAX_TOOLS_NUM]: process.env.NEXT_PUBLIC_MAX_TOOLS_NUM,
      [DatasetAttr.DATA_PUBLIC_MAX_PARALLEL_LIMIT]: process.env.NEXT_PUBLIC_MAX_PARALLEL_LIMIT,
      [DatasetAttr.DATA_PUBLIC_TOP_K_MAX_VALUE]: process.env.NEXT_PUBLIC_TOP_K_MAX_VALUE,
      [DatasetAttr.DATA_PUBLIC_INDEXING_MAX_SEGMENTATION_TOKENS_LENGTH]: process.env.NEXT_PUBLIC_INDEXING_MAX_SEGMENTATION_TOKENS_LENGTH,
      [DatasetAttr.DATA_PUBLIC_LOOP_NODE_MAX_COUNT]: process.env.NEXT_PUBLIC_LOOP_NODE_MAX_COUNT,
      [DatasetAttr.DATA_PUBLIC_MAX_ITERATIONS_NUM]: process.env.NEXT_PUBLIC_MAX_ITERATIONS_NUM,
      [DatasetAttr.DATA_PUBLIC_MAX_TREE_DEPTH]: process.env.NEXT_PUBLIC_MAX_TREE_DEPTH,
      [DatasetAttr.DATA_PUBLIC_ALLOW_UNSAFE_DATA_SCHEME]: process.env.NEXT_PUBLIC_ALLOW_UNSAFE_DATA_SCHEME,
      [DatasetAttr.DATA_PUBLIC_ENABLE_WEBSITE_JINAREADER]: process.env.NEXT_PUBLIC_ENABLE_WEBSITE_JINAREADER,
      [DatasetAttr.DATA_PUBLIC_ENABLE_WEBSITE_FIRECRAWL]: process.env.NEXT_PUBLIC_ENABLE_WEBSITE_FIRECRAWL,
      [DatasetAttr.DATA_PUBLIC_ENABLE_WEBSITE_WATERCRAWL]: process.env.NEXT_PUBLIC_ENABLE_WEBSITE_WATERCRAWL,
      [DatasetAttr.NEXT_PUBLIC_ZENDESK_WIDGET_KEY]: process.env.NEXT_PUBLIC_ZENDESK_WIDGET_KEY,
      [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_ENVIRONMENT]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_ENVIRONMENT,
      [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_VERSION]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_VERSION,
      [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_EMAIL]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_EMAIL,
      [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_WORKSPACE_ID]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_WORKSPACE_ID,
      [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_PLAN]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_PLAN,
    }
    Object.entries(datasetMap).forEach(([key, value]) => {
      if (value !== undefined && document.body)
        document.body.setAttribute(key, value)
    })
  }, [])

  // Set html lang attribute
  useEffect(() => {
    document.documentElement.lang = locale ?? 'en'
  }, [locale])

  if (loading)
    return <div className='flex h-screen w-screen items-center justify-center'><Loading type='app' /></div>

  return (
    <div className="h-full">
      <ThemeProvider
        attribute='data-theme'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
        enableColorScheme={false}
      >
        <BrowserInitializer>
          <SentryInitializer>
            <TanstackQueryInitializer>
              <I18n locale={locale as any}>
                <ToastProvider>
                  <GlobalPublicStoreProvider>
                    {children || <Outlet />}
                  </GlobalPublicStoreProvider>
                </ToastProvider>
              </I18n>
            </TanstackQueryInitializer>
          </SentryInitializer>
        </BrowserInitializer>
        <RoutePrefixHandle />
        <Zendesk />
      </ThemeProvider>
    </div>
  )
}

export default AppLayout
