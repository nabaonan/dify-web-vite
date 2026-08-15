'use client'

import { useParams } from 'react-router-dom'
import Main from '@/app/components/explore/installed-app'

function InstalledApp() {
  const { appId } = useParams<{ appId: string }>()
  return (
    <Main id={appId!} />
  )
}

export default InstalledApp
