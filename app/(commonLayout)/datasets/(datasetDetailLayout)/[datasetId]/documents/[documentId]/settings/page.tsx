'use client'

import { useParams } from 'react-router-dom'
import Settings from '@/app/components/datasets/documents/detail/settings'

const DocumentSettingsPage = () => {
  const { datasetId, documentId } = useParams<{ datasetId: string; documentId: string }>()

  return <Settings datasetId={datasetId!} documentId={documentId!} />
}

export default DocumentSettingsPage
