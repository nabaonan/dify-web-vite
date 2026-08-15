'use client'

import { useParams } from 'react-router-dom'
import DatasetUpdateForm from '@/app/components/datasets/create'

const CreatePage = () => {
  const { datasetId } = useParams<{ datasetId: string }>()

  return <DatasetUpdateForm datasetId={datasetId} />
}

export default CreatePage
