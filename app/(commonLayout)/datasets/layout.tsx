'use client'

import Loading from '@/app/components/base/loading'
import { useAppContext } from '@/context/app-context'
import { ExternalApiPanelProvider } from '@/context/external-api-panel-context'
import { ExternalKnowledgeApiProvider } from '@/context/external-knowledge-api-context'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function DatasetsLayout() {
  const { isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator, currentWorkspace, isLoadingCurrentWorkspace } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoadingCurrentWorkspace || !currentWorkspace.id)
      return
    if (!(isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator))
      navigate('/apps', { replace: true })
  }, [isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator, isLoadingCurrentWorkspace, currentWorkspace, navigate])

  if (isLoadingCurrentWorkspace || !(isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator))
    return <Loading type='app' />
  return (
    <ExternalKnowledgeApiProvider>
      <ExternalApiPanelProvider>
        <Outlet />
      </ExternalApiPanelProvider>
    </ExternalKnowledgeApiProvider>
  )
}
