'use client'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ExploreClient from '@/app/components/explore'
import useDocumentTitle from '@/hooks/use-document-title'

const ExploreLayout = () => {
  const { t } = useTranslation()
  useDocumentTitle(t('common.menus.explore'))
  return (
    <ExploreClient>
      <Outlet />
    </ExploreClient>
  )
}

export default React.memo(ExploreLayout)
