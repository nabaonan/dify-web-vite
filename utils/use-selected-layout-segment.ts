import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Next.js useSelectedLayoutSegment shim for react-router-dom
 * Returns the active segment of the current route
 */
export function useSelectedLayoutSegment(segmentPath?: string): string | null {
  const location = useLocation()

  return useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    if (segmentPath) {
      // Find the segment after the given path
      const idx = location.pathname.indexOf(segmentPath)
      if (idx >= 0) {
        const remainingPath = location.pathname.slice(idx + segmentPath.length)
        const nextSegments = remainingPath.split('/').filter(Boolean)
        return nextSegments[0] || null
      }
      return null
    }
    // Return last segment
    return segments[segments.length - 1] || null
  }, [location.pathname, segmentPath])
}

/**
 * Next.js useSelectedLayoutSegments shim for react-router-dom
 */
export function useSelectedLayoutSegments(segmentPath?: string): string[] {
  const location = useLocation()

  return useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    if (segmentPath) {
      const idx = location.pathname.indexOf(segmentPath)
      if (idx >= 0) {
        const remainingPath = location.pathname.slice(idx + segmentPath.length)
        return remainingPath.split('/').filter(Boolean)
      }
      return []
    }
    return segments
  }, [location.pathname, segmentPath])
}
