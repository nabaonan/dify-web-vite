'use client'

import { useEffect, useState } from 'react'
import PluginPage from '@/app/components/plugins/plugin-page'
import PluginsPanel from '@/app/components/plugins/plugin-page/plugins-panel'
import Marketplace from '@/app/components/plugins/marketplace'
import { getLocaleOnClient } from '@/i18n-config'

const PluginList = () => {
  const [locale, setLocale] = useState('en-US')

  useEffect(() => {
    setLocale(getLocaleOnClient())
  }, [])

  return (
    <PluginPage
      plugins={<PluginsPanel />}
      marketplace={<Marketplace locale={locale} pluginTypeSwitchClassName='top-[60px]' searchBoxAutoAnimate={false} showSearchParams={false} />}
    />
  )
}

export default PluginList
