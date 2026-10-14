import { useSyncExternalStore } from 'react'

function subscribe(query: string, onStoreChange: () => void): () => void {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onStoreChange)
  return () => mql.removeEventListener('change', onStoreChange)
}

function getSnapshot(query: string): boolean {
  return window.matchMedia(query).matches
}

/** Reactive media-query subscription (SSR-safe snapshot included). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => getSnapshot(query),
    () => getSnapshot(query),
  )
}
