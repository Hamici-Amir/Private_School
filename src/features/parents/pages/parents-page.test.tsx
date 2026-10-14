import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { useLocaleStore } from '@/store/locale-store'

import { ParentsPage } from '@/features/parents/pages/parents-page'
import type { Parent } from '@/features/parents/types/parents.types'
import {
  createParent,
  deleteParent,
  getParents,
  updateParent,
} from '@/features/parents/services/parents.service'
import { getStudents } from '@/features/students/services/students.service'
import type { Student } from '@/features/students/types/students.types'

const toastSuccess = vi.fn()

vi.mock('@/lib/toast', () => ({
  toast: { success: (...args: unknown[]) => toastSuccess(...args), error: vi.fn() },
}))

vi.mock('@/features/parents/services/parents.service', () => ({
  createParent: vi.fn(),
  deleteParent: vi.fn(),
  getParents: vi.fn(),
  getParent: vi.fn(),
  getParentsByStudentId: vi.fn(),
  updateParent: vi.fn(),
}))

vi.mock('@/features/students/services/students.service', () => ({
  getStudents: vi.fn(),
}))

const getParentsMock = vi.mocked(getParents)
const createParentMock = vi.mocked(createParent)
const updateParentMock = vi.mocked(updateParent)
const deleteParentMock = vi.mocked(deleteParent)
const getStudentsMock = vi.mocked(getStudents)

const STUDENTS: Student[] = [
  {
    id: 's-100',
    firstName: 'Amine',
    lastName: 'Benali',
    birthDate: '2015-03-14',
    gender: 'male',
    guardianName: 'Mohamed Benali',
    guardianPhone: '0550123456',
    level: '1AM',
    classId: 'cl-1am-a',
    status: 'active',
    enrollmentDate: '2025-09-08',
  },
  {
    id: 's-101',
    firstName: 'Lina',
    lastName: 'Ferhat',
    birthDate: '2018-05-11',
    gender: 'female',
    guardianName: 'Salima Ferhat',
    guardianPhone: '0552345678',
    level: '2AP',
    classId: 'cl-2ap-a',
    status: 'active',
    enrollmentDate: '2024-09-05',
  },
]

function fixture(): Parent[] {
  return [
    {
      id: 'p-100',
      parentNumber: 'P-100',
      firstName: 'Mohamed',
      lastName: 'Benali',
      gender: 'male',
      relationship: 'father',
      phone: '0550123456',
      childrenIds: ['s-100'],
      status: 'active',
      createdAt: '2024-09-05',
    },
    {
      id: 'p-101',
      parentNumber: 'P-101',
      firstName: 'Salima',
      lastName: 'Ferhat',
      gender: 'female',
      relationship: 'mother',
      phone: '0550987654',
      secondaryPhone: '0550987654',
      email: 'salima@mail.dz',
      address: 'Hydra, Alger',
      city: 'Hydra',
      occupation: 'Infirmière',
      childrenIds: ['s-101'],
      status: 'inactive',
      createdAt: '2023-09-06',
    },
    {
      id: 'p-102',
      parentNumber: 'P-102',
      firstName: 'Karim',
      lastName: 'Belkacem',
      gender: 'male',
      relationship: 'guardian',
      phone: '0770123456',
      childrenIds: ['s-100', 's-101'],
      status: 'active',
      createdAt: '2025-09-08',
    },
  ]
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ParentsPage />
    </MemoryRouter>,
  )
}

function table() {
  return within(screen.getByRole('table'))
}

describe('ParentsPage', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
    getParentsMock.mockReset()
    createParentMock.mockReset()
    updateParentMock.mockReset()
    deleteParentMock.mockReset()
    getStudentsMock.mockReset()
    getStudentsMock.mockResolvedValue(STUDENTS)
    toastSuccess.mockClear()
  })

  it('shows a loading skeleton while the data is pending', () => {
    getParentsMock.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByTestId('parents-skeleton')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Parents' })).toBeInTheDocument()
  })

  it('renders the data state in French with stats and parents', async () => {
    getParentsMock.mockResolvedValue(fixture())
    renderPage()

    expect(await screen.findByText('Total des parents')).toBeInTheDocument()
    expect(screen.getByText('Parents actifs')).toBeInTheDocument()
    expect(screen.getByText('Parents multi-enfants')).toBeInTheDocument()
    expect(screen.getByText('Nouveaux parents')).toBeInTheDocument()

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument()
    })
    expect(table().getByText('Salima Ferhat')).toBeInTheDocument()
    expect(table().getByText('Père')).toBeInTheDocument()
    expect(table().getByText('Mère')).toBeInTheDocument()
  })

  it('filters by search (debounced)', async () => {
    getParentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.type(screen.getByRole('textbox', { name: 'Rechercher un parent…' }), 'Ferhat')

    await waitFor(() => {
      expect(table().queryByRole('link', { name: 'Mohamed Benali' })).not.toBeInTheDocument()
    })
    expect(table().getByRole('link', { name: 'Salima Ferhat' })).toBeInTheDocument()
  })

  it('filters by relationship via the select', async () => {
    getParentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Toutes les relations' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Père' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument()
    })
    expect(table().queryByRole('link', { name: 'Salima Ferhat' })).not.toBeInTheDocument()
    expect(table().queryByRole('link', { name: 'Karim Belkacem' })).not.toBeInTheDocument()
  })

  it('shows resolved children in the table', async () => {
    getParentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    // Amine Benali is linked to two parents in the fixture (p-100 and p-102).
    expect(table().getAllByRole('link', { name: 'Amine Benali' }).length).toBeGreaterThan(0)
    expect(table().getAllByText('1 enfant(s)')).toHaveLength(2)
    expect(table().getByText('2 enfant(s)')).toBeInTheDocument()
  })

  it('sorts by name descending', async () => {
    getParentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Trier par' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Nom (Z → A)' }))

    await waitFor(() => {
      const rows = table().getAllByRole('row')
      expect(within(rows[1]).getByRole('link', { name: 'Salima Ferhat' })).toBeInTheDocument()
    })
  })

  it('creates a parent through the form sheet', async () => {
    getParentsMock.mockResolvedValue(fixture())
    createParentMock.mockResolvedValue({
      ...fixture()[0],
      id: 'p-new',
      parentNumber: 'P-103',
      firstName: 'Karim',
      lastName: 'Testeur',
    })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un parent' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ajouter un parent' })).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Ex. Mohamed'), 'Karim')
    await userEvent.type(screen.getByPlaceholderText('Ex. Benali'), 'Testeur')
    await userEvent.type(screen.getByPlaceholderText('Ex. 0550 12 34 56'), '0660998877')
    await userEvent.type(screen.getByPlaceholderText('Ex. Cité 20 Août, Alger'), 'Alger')

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Karim Testeur' })).toBeInTheDocument()
    })
    expect(toastSuccess).toHaveBeenCalledWith('Le parent a été ajouté avec succès.')
  })

  it('validates required fields before submitting', async () => {
    getParentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un parent' }))
    await screen.findByRole('dialog')

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(await screen.findAllByText('Ce champ est requis.')).not.toHaveLength(0)
    expect(createParentMock).not.toHaveBeenCalled()
  })

  it('edits a parent through the form sheet', async () => {
    getParentsMock.mockResolvedValue(fixture())
    updateParentMock.mockResolvedValue({ ...fixture()[0], firstName: 'Karim' })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    const row = table().getByRole('row', { name: /Mohamed Benali/ })
    await userEvent.click(within(row).getByRole('button', { name: 'Actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Modifier' }))

    expect(await screen.findByRole('heading', { name: 'Modifier le parent' })).toBeInTheDocument()
    const firstNameInput = screen.getAllByLabelText(/Prénom/)[0]
    expect(firstNameInput).toHaveValue('Mohamed')

    await userEvent.clear(firstNameInput)
    await userEvent.type(firstNameInput, 'Karim')
    await userEvent.type(screen.getByPlaceholderText('Ex. Alger'), 'Alger')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Karim Benali' })).toBeInTheDocument()
    })
    expect(toastSuccess).toHaveBeenCalledWith('Le parent a été mis à jour avec succès.')
  })

  it('deletes a parent after confirmation and warns about linked children', async () => {
    getParentsMock.mockResolvedValue(fixture())
    deleteParentMock.mockResolvedValue(undefined)
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    const row = table().getByRole('row', { name: /Mohamed Benali/ })
    await userEvent.click(within(row).getByRole('button', { name: 'Actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Supprimer' }))

    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByText(/Ce parent est lié à des élèves/)).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {
      expect(table().queryByRole('link', { name: 'Mohamed Benali' })).not.toBeInTheDocument()
    })
    expect(deleteParentMock).toHaveBeenCalledWith('p-100')
    expect(toastSuccess).toHaveBeenCalledWith('Le parent a été supprimé avec succès.')
  })

  it('renders the empty state when no parents exist', async () => {
    getParentsMock.mockResolvedValue([])
    renderPage()
    expect(await screen.findByText('Aucun parent trouvé')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Ajouter un parent' })).not.toHaveLength(0)
  })

  it('renders an error state and retries', async () => {
    getParentsMock
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(fixture())
    renderPage()

    expect(await screen.findByText('Impossible de charger les parents')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument()
    })
    expect(getParentsMock).toHaveBeenCalledTimes(2)
  })
})