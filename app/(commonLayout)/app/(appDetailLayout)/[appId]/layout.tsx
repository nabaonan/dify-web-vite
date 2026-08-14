'use client'

import { useParams, Outlet } from 'react-router-dom'
import Main from './layout-main'

const AppDetailLayout = () => {
  const { appId } = useParams<{ appId: string }>()

  return <Main appId={appId!}><Outlet /></Main>
}
export default AppDetailLayout
