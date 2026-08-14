import { useLocation } from 'react-router-dom'

/**
 * Shim for react-router-dom's usePathname
 * In React Router v7, usePathname was removed; use useLocation().pathname instead
 */
export function usePathname(): string {
  return useLocation().pathname
}
