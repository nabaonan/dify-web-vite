'use client'

import { useParams, Outlet } from 'react-router-dom'
import Main from './layout-main'

const DatasetDetailLayout = () => {
  const params = useParams<{ datasetId: string }>()

  return <Main params={params as any}><Outlet /></Main>
}
export default DatasetDetailLayout
