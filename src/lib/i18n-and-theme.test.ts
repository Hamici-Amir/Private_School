import { describe, expect, it } from 'vitest'

import { getDirection } from '@/lib/i18n/direction'
import { applyTheme, resolveTheme } from '@/lib/theme'

describe('i18n direction', () => {
  it('maps French to LTR and Arabic to RTL', () => {
    expect(getDirection('fr')).toBe('ltr')
    expect(getDirection('ar')).toBe('rtl')
  })
})

describe('theme resolution', () => {
  it('forces dark/light regardless of system preference', () => {
    expect(resolveTheme('dark')).toBe('dark')
    expect(resolveTheme('light')).toBe('light')
  })

  it('resolves the system theme to the current media query (light in jsdom)', () => {
    expect(resolveTheme('system')).toBe('light')
  })

  it('toggles the dark class on the document root', () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})
