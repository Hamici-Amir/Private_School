import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { useLocaleStore } from '@/store/locale-store'

import { StudentsPage } from '@/features/students/pages/students-page'
import type { Student } from '@/features/students/types/students.types'
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
  updateStudentStatus,
} from '@/features/students/services/students.service'

const toastSuccess = vi.fn()

vi.mock('@/lib/toast', () => ({
  toast: { success: (...args: unknown[]) => toastSuccess(...args), error: vi.fn() },
}))

vi.mock('@/features/students/services/students.service', () => ({
  createStudent: vi.fn(),
  deleteStudent: vi.fn(),
  getStudents: vi.fn(),
  updateStudent: vi.fn(),
  updateStudentStatus: vi.fn(),
}))

const getStudentsMock = vi.mocked(getStudents)
const createStudentMock = vi.mocked(createStudent)
const updateStudentMock = vi.mocked(updateStudent)
const deleteStudentMock = vi.mocked(deleteStudent)
const updateStudentStatusMock = vi.mocked(updateStudentStatus)

function fixture(): Student[] {
  return [
    {
      id: 's-100',
      firstName: 'Amine',
      lastName: 'Benali',
      birthDate: '2015-03-14',
      gender: 'male',
      email: 'amine@mail.dz',
      address: 'Alger',
      guardianName: 'Mohamed Benali',
      guardianPhone: '0550123456',
      level: '1AM',
      classId: 'cl-1am-a',
      status: 'active',
      enrollmentDate: '2025-09-08',
    },
    {
      id: 's-101',
      firstName: 'Sara',
      lastName: 'Lounis',
      birthDate: '2012-11-16',
      gender: 'female',
      email: undefined,
      address: undefined,
      guardianName: 'Youssef Lounis',
      guardianPhone: '0660778899',
      level: '3AM',
      classId: 'cl-3am-a',
      status: 'suspended',
      enrollmentDate: '2022-09-07',
    },
    {
      id: 's-102',
      firstName: 'Nadir',
      lastName: 'Ould Kaci',
      birthDate: '2008-11-27',
      gender: 'male',
      email: undefined,
      address: undefined,
      guardianName: 'Smaïn Ould Kaci',
      guardianPhone: '0770889900',
      level: '2AS',
      classId: 'cl-2as-b',
      status: 'inactive',
      enrollmentDate: '2023-09-06',
    },
  ]
}

function renderPage() {
  return render(
    <MemoryRouter>
      <StudentsPage />
    </MemoryRouter>,
  )
}

function table() {
  return within(screen.getByRole('table'))
}

describe('StudentsPage', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
    getStudentsMock.mockReset()
    createStudentMock.mockReset()
    updateStudentMock.mockReset()
    deleteStudentMock.mockReset()
    updateStudentStatusMock.mockReset()
    toastSuccess.mockClear()
  })

  it('shows a loading skeleton while the data is pending', () => {
    getStudentsMock.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByTestId('students-skeleton')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Élèves' })).toBeInTheDocument()
  })

  it('renders the data state in French with stats and students', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    renderPage()

    expect(await screen.findByText('Total des élèves')).toBeInTheDocument()
    expect(screen.getByText('Élèves actifs')).toBeInTheDocument()
    expect(screen.getByText('Nouveaux cette année')).toBeInTheDocument()
    expect(screen.getByText('Élèves inactifs')).toBeInTheDocument()

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument()
    })
    expect(table().getByText('Sara Lounis')).toBeInTheDocument()
    expect(table().getByText('1AM')).toBeInTheDocument()
    expect(table().getByText('1AM A')).toBeInTheDocument()
  })

  it('filters by search (debounced)', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument())

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Rechercher un élève…' }),
      'Nadir',
    )

    await waitFor(() => {
      expect(table().queryByRole('link', { name: 'Amine Benali' })).not.toBeInTheDocument()
    })
    expect(table().getByRole('link', { name: 'Nadir Ould Kaci' })).toBeInTheDocument()
  })

  it('filters by status via the select', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Tous les statuts' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Inactif' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Nadir Ould Kaci' })).toBeInTheDocument()
    })
    expect(table().queryByRole('link', { name: 'Sara Lounis' })).not.toBeInTheDocument()
    expect(table().queryByRole('link', { name: 'Amine Benali' })).not.toBeInTheDocument()
  })

  it('sorts by name descending', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Trier par' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Nom (Z → A)' }))

    await waitFor(() => {
      const rows = table().getAllByRole('row')
      expect(within(rows[1]).getByRole('link', { name: 'Sara Lounis' })).toBeInTheDocument()
    })
  })

  it('creates a student through the form sheet', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    createStudentMock.mockResolvedValue({
      ...fixture()[0],
      id: 's-new',
      firstName: 'Karim',
      lastName: 'Testeur',
    })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Nouvel élève' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nouvel élève' })).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Ex. Amine'), 'Karim')
    await userEvent.type(screen.getByPlaceholderText('Ex. Benali'), 'Testeur')
    fireEvent.change(screen.getByLabelText(/Date de naissance/), {
      target: { value: '2015-05-05' },
    })
    await userEvent.type(screen.getByPlaceholderText('Ex. Mohamed Benali'), 'Ali Testeur')
    await userEvent.type(screen.getByPlaceholderText('Ex. 0550 12 34 56'), '0660998877')

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Karim Testeur' })).toBeInTheDocument()
    })
    expect(toastSuccess).toHaveBeenCalledWith('Élève créé avec succès.')
  })

  it('validates required fields before submitting', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Nouvel élève' }))
    await screen.findByRole('dialog')

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(await screen.findAllByText('Ce champ est requis.')).not.toHaveLength(0)
    expect(createStudentMock).not.toHaveBeenCalled()
  })

  it('edits a student through the form sheet', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    updateStudentMock.mockResolvedValue({ ...fixture()[0], firstName: 'Karim' })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getAllByRole('button', { name: 'Actions' })[0])
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Modifier' }))

    expect(await screen.findByRole('heading', { name: 'Modifier l’élève' })).toBeInTheDocument()
    const firstNameInput = screen.getByLabelText(/Prénom/)
    expect(firstNameInput).toHaveValue('Amine')

    await userEvent.clear(firstNameInput)
    await userEvent.type(firstNameInput, 'Karim')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Karim Benali' })).toBeInTheDocument()
    })
    expect(toastSuccess).toHaveBeenCalledWith('Élève mis à jour avec succès.')
  })

  it('changes a student status', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    updateStudentStatusMock.mockResolvedValue({ ...fixture()[0], status: 'inactive' })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getAllByRole('button', { name: 'Actions' })[0])
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Changer le statut' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('combobox', { name: 'Statut' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Inactif' }))
    await userEvent.click(screen.getByRole('button', { name: 'Mettre à jour' }))

await waitFor(() => {
  const firstRow = within(table().getAllByRole('row')[1])
  expect(firstRow.getByText('Inactif')).toBeInTheDocument()
})
expect(toastSuccess).toHaveBeenCalledWith('Statut mis à jour avec succès.')
  })

  it('deletes a student after confirmation', async () => {
    getStudentsMock.mockResolvedValue(fixture())
    deleteStudentMock.mockResolvedValue(undefined)
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getAllByRole('button', { name: 'Actions' })[0])
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Supprimer' }))

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0])

    await waitFor(() => {
      expect(table().queryByRole('link', { name: 'Amine Benali' })).not.toBeInTheDocument()
    })
    expect(toastSuccess).toHaveBeenCalledWith('Élève supprimé avec succès.')
  })

  it('renders the empty state when no students exist', async () => {
    getStudentsMock.mockResolvedValue([])
    renderPage()
    expect(await screen.findByText('Aucun élève trouvé')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ajouter un élève' })).toBeInTheDocument()
  })

  it('renders an error state and retries', async () => {
    getStudentsMock
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(fixture())
    renderPage()

    expect(await screen.findByText('Impossible de charger les élèves')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Amine Benali' })).toBeInTheDocument()
    })
    expect(getStudentsMock).toHaveBeenCalledTimes(2)
  })
})