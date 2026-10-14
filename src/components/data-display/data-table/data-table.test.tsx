import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { legacyCreateColumnHelper } from '@tanstack/react-table/legacy'
import type { SortingState } from '@tanstack/react-table'

import { DataTable, type DataTableColumn } from '@/components/data-display/data-table'

interface Row {
  id: string
  name: string
  className: string
  status: string
}

const ROWS: Row[] = [
  { id: 'S-001', name: 'Amine Benali', className: '3A', status: 'active' },
  { id: 'S-002', name: 'Yasmine Saadi', className: '2B', status: 'paid' },
  { id: 'S-003', name: 'Mohamed Idir', className: '1A', status: 'pending' },
  { id: 'S-004', name: 'Lina Bouzid', className: '4A', status: 'inactive' },
  { id: 'S-005', name: 'Adam Zerrouki', className: '1B', status: 'active' },
]

const helper = legacyCreateColumnHelper<Row>()

const columns: DataTableColumn<Row>[] = [
  helper.accessor('name', {
    id: 'name',
    header: 'Name',
    cell: (info) => info.getValue<string>(),
  }),
  helper.accessor('className', {
    id: 'className',
    header: 'Class',
    cell: (info) => info.getValue<string>(),
  }),
]

function renderTable(
  props: Partial<{
    initialSort: SortingState
    searchableColumns: string[]
    pageSize: number
  }> = {},
) {
  return render(
    <DataTable
      columns={columns}
      data={ROWS}
      getRowId={(row) => row.id}
      searchableColumns={props.searchableColumns}
      pageSize={props.pageSize}
      initialSort={props.initialSort}
    />,
  )
}

describe('DataTable', () => {
  it('renders every row by default', () => {
    renderTable()
    for (const row of ROWS) {
      expect(screen.getByText(row.name)).toBeInTheDocument()
    }
  })

  it('sorts rows by the initial sort state', () => {
    renderTable({ initialSort: [{ id: 'name', desc: false }] })
    const body = screen.getByRole('table').querySelector('tbody') as HTMLElement
    const names = within(body)
      .getAllByRole('row')
      .map((row) => within(row).getAllByRole('cell')[0].textContent?.trim())
    expect(names).toEqual([...names].sort())
  })

  it('filters rows through the search box', async () => {
    const user = userEvent.setup()
    renderTable({ searchableColumns: ['name', 'className'] })
    const search = screen.getByRole('textbox', { name: /بحث/i })
    await user.type(search, 'Lina')
    expect(screen.getByText('Lina Bouzid')).toBeInTheDocument()
    expect(screen.queryByText('Amine Benali')).not.toBeInTheDocument()
  })

  it('shows the empty state when search yields nothing', async () => {
    const user = userEvent.setup()
    renderTable({ searchableColumns: ['name'] })
    const search = screen.getByRole('textbox', { name: /بحث/i })
    await user.type(search, 'zzzz')
    expect(screen.getByText('لا توجد نتائج')).toBeInTheDocument()
  })

  it('paginates rows and navigates pages', async () => {
    const user = userEvent.setup()
    renderTable({ pageSize: 2 })
    const body = screen.getByRole('table').querySelector('tbody') as HTMLElement
    expect(within(body).getAllByRole('row')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'التالي' }))
    expect(within(body).getAllByRole('row')).toHaveLength(2)
  })

  it('disables pagination navigation at the boundaries', async () => {
    const user = userEvent.setup()
    renderTable({ pageSize: 20 })
    const previous = screen.getByRole('button', { name: 'السابق' })
    expect(previous).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'التالي' }))
    expect(screen.getByRole('button', { name: 'التالي' })).toBeDisabled()
  })
})
