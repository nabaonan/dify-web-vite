import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface Router {
  push: (path: string) => void
  replace: (path: string) => void
  back: () => void
  forward: () => void
  refresh: () => void
  prefetch: (path: string) => void
}

/**
 * Shim for Next.js useRouter for compatibility with react-router-dom
 */
export function useRouter(): Router {
  const navigate = useNavigate()
  const location = useLocation()

  const push = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  const replace = useCallback((path: string) => {
    navigate(path, { replace: true })
  }, [navigate])

  const back = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const forward = useCallback(() => {
    navigate(1)
  }, [navigate])

  const refresh = useCallback(() => {
    navigate(0)
  }, [navigate])

  const prefetch = useCallback((_path: string) => {
    // No-op in Vite/React Router
  }, [])

  return { push, replace, back, forward, refresh, prefetch }
}
