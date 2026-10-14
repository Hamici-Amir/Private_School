import type { ReactNode } from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'

import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'
import { fetchDashboardMock } from '@/features/dashboard/mocks'
import { getDashboardData } from '@/services/system.service'
import { useLocaleStore } from '@/store/locale-store'

// jsdom cannot measure containers, so Recharts' ResponsiveContainer would
// warn about a 0×0 viewport. Stub it with a fixed-size box for tests.
vi.mock('recharts', async (importOriginal) => {
  const actual = (await importOriginal<unknown>()) as Record<string, unknown>
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div style={{ width: 600, height: 300 }}>{children}</div>
    ),
  }
})

vi.mock('@/services/system.service', () => ({
  getDashboardData: vi.fn(),
  getSystemInfo: vi.fn(),
}))

const getDashboardDataMock = vi.mocked(getDashboardData)

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
    getDashboardDataMock.mockReset()
  })

  it('shows a loading skeleton while the query is pending', () => {
    getDashboardDataMock.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument()
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument()
  })

  it('renders the full dashboard data state in French', async () => {
    const data = await fetchDashboardMock()
    getDashboardDataMock.mockResolvedValue({ data, source: 'mock' })

    renderPage()

    expect(await screen.findByText('Élèves inscrits')).toBeInTheDocument()
    expect(screen.getByText('Encaissements du mois')).toBeInTheDocument()
    expect(screen.getByText('Taux de présence')).toBeInTheDocument()

    expect(screen.getByText('Actions rapides')).toBeInTheDocument()
    expect(screen.getByText('Nouvel élève')).toBeInTheDocument()
    expect(screen.getByText('Consulter les rapports')).toBeInTheDocument()

    expect(screen.getByText('Inscriptions')).toBeInTheDocument()
    expect(screen.getByText('Finances du mois')).toBeInTheDocument()
    expect(screen.getByText('Évolution mensuelle du taux de présence')).toBeInTheDocument()

    expect(screen.getByText('Activité récente')).toBeInTheDocument()
    expect(screen.getByText('Alertes importantes')).toBeInTheDocument()
    expect(screen.getByText('Emploi du temps à venir')).toBeInTheDocument()
  })

  it('localizes the dashboard in Arabic', async () => {
    useLocaleStore.getState().setLocale('ar')
    const data = await fetchDashboardMock()
    getDashboardDataMock.mockResolvedValue({ data, source: 'mock' })

    renderPage()

    expect(await screen.findByText('لوحة التحكم')).toBeInTheDocument()
    expect(await screen.findByText('التلاميذ المسجلون')).toBeInTheDocument()
    expect(screen.getByText('إجراءات سريعة')).toBeInTheDocument()
    expect(screen.getByText('النشاط الأخير')).toBeInTheDocument()
  })

  it('renders the error state offering a retry', async () => {
    getDashboardDataMock.mockRejectedValue(new Error('network down'))

    renderPage()

    expect(await screen.findByText('Impossible de charger le tableau de bord')).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))

    await waitFor(() => expect(getDashboardDataMock).toHaveBeenCalledTimes(2))
  })

  it('renders the empty state when no KPI is available', async () => {
    const data = await fetchDashboardMock()
    getDashboardDataMock.mockResolvedValue({
      data: { ...data, kpis: {} as never },
      source: 'mock',
    })

    renderPage()

    expect(await screen.findByText('Aucune donnée disponible')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
  })
})
