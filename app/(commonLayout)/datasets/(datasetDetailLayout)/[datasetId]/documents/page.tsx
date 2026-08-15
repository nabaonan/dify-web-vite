'use client'

import { useParams } from 'react-router-dom'
import Main from "@/app/components/datasets/documents"

const documentsPage = () => {
  const { datasetId } = useParams<{ datasetId: string }>()

  return <Main datasetId={datasetId} />
}

export default documentsPage
