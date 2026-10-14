import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

/** Restore the document between tests. */
afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('dir')
  document.documentElement.classList.remove('dark')
})

/**
 * Minimal matchMedia polyfill (jsdom does not implement it; the theme
 * helpers and several components depend on it).
 */
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

/** Minimal ResizeObserver polyfill for components that observe size. */
if (!('ResizeObserver' in window)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: ResizeObserverStub,
  })
}

/** Stable scroll behavior for jsdom. */
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

/**
 * Pointer capture polyfills. jsdom does not implement them and Radix UI's
 * Select (and friends) calls these during pointer event handling.
 */
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}
