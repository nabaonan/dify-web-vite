'use client'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/app-context'
import useDocumentTitle from '@/hooks/use-document-title'

const AppDetail: FC = () => {
  const navigate = useNavigate()
  const { isCurrentWorkspaceDatasetOperator } = useAppContext()
  const { t } = useTranslation()
  useDocumentTitle(t('common.menus.appDetail'))

  useEffect(() => {
    if (isCurrentWorkspaceDatasetOperator)
      navigate('/datasets', { replace: true })
  }, [isCurrentWorkspaceDatasetOperator, navigate])

  return (
    <>
      <Outlet />
    </>
  )
}

export default React.memo(AppDetail)
