'use client'

import { useParams } from 'react-router-dom'
import DocumentDetail from '@/app/components/datasets/documents/detail'

const DocumentDetailPage = () => {
  const { datasetId, documentId } = useParams<{ datasetId: string; documentId: string }>()

  return <DocumentDetail datasetId={datasetId!} documentId={documentId!} />
}

export default DocumentDetailPage
