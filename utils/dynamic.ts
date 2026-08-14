import React, { lazy, Suspense, ComponentType } from 'react'

interface DynamicOptions {
  ssr?: boolean
  loading?: () => React.ReactNode
}

/**
 * Replacement for next/dynamic
 * Uses React.lazy under the hood
 */
function dynamic<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: DynamicOptions = {},
) {
  const LazyComponent = lazy(importFunc)
  const LoadingComponent = options.loading || (() => null)

  return (props: React.ComponentProps<T>) => {
    return React.createElement(
      Suspense,
      { fallback: React.createElement(LoadingComponent) },
      React.createElement(LazyComponent, props),
    )
  }
}

export default dynamic
