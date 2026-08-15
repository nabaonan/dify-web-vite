import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Next.js useSelectedLayoutSegment shim for react-router-dom
 * In Next.js app router, this returns the segment of the active layout route.
 * For route group (commonLayout), the next meaningful segment is returned.
 * E.g. /datasets/xxx/documents -> 'datasets'
 *      /app/xxx/configuration -> 'app'
 */
export function useSelectedLayoutSegment(_segmentPath?: string): string | null {
  const location = useLocation()

  return useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    // Return the first meaningful segment (after route groups if any)
    // In Next.js app dir, (commonLayout) is a route group and is skipped.
    // Our paths are like /apps, /datasets/..., /app/... etc.
    // The first segment is the one we care about for navigation highlighting
    if (segments.length === 0) return null
    // Skip known route-group-like prefixes (there are none in actual URLs, 
    // since route groups are directory names with parentheses which don't appear in URLs)
    return segments[0] || null
  }, [location.pathname])
}

/**
 * Next.js useSelectedLayoutSegments shim for react-router-dom
 */
export function useSelectedLayoutSegments(_segmentPath?: string): string[] {
  const location = useLocation()

  return useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    return segments
  }, [location.pathname])
}
