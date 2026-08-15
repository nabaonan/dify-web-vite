'use client'

import { useParams } from 'react-router-dom'
import Main from "@/app/components/datasets/hit-testing"

const hitTestingPage = () => {
  const { datasetId } = useParams<{ datasetId: string }>()

  return <Main datasetId={datasetId} />
}

export default hitTestingPage
