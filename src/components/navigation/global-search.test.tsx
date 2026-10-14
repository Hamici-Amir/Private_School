import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { GlobalSearch, GlobalSearchTrigger } from '@/components/navigation/global-search'
import { useAppShellStore } from '@/store/app-shell.store'
import { useLocaleStore } from '@/store/locale-store'

function renderSearch() {
  return render(
    <MemoryRouter>
      <GlobalSearch />
      <GlobalSearchTrigger />
    </MemoryRouter>,
  )
}

describe('GlobalSearch', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
    useAppShellStore.getState().closeCommand()
  })

  it('opens the command palette with Ctrl/Cmd + K', async () => {
    const user = userEvent.setup()
    renderSearch()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('lists navigation pages grouped under Pages and Actions', async () => {
    const user = userEvent.setup()
    renderSearch()
    await user.keyboard('{Control>}k{/Control}')
    expect(screen.getByText('Pages')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('filters results while typing', async () => {
    const user = userEvent.setup()
    renderSearch()
    await user.keyboard('{Control>}k{/Control}')
    const input = screen.getByRole('combobox')
    expect(screen.getByRole('option', { name: /Élèves/ })).toBeInTheDocument()
    await user.type(input, 'Éle')
    expect(screen.getByRole('option', { name: /Élèves/ })).toBeInTheDocument()
  })

  it('closes the palette with Escape', async () => {
    const user = userEvent.setup()
    renderSearch()
    await user.keyboard('{Control>}k{/Control}')
    await user.keyboard('{Escape}')
    expect(useAppShellStore.getState().commandOpen).toBe(false)
  })
})
