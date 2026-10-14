import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { useLocaleStore } from '@/store/locale-store'

import { TeachersPage } from '@/features/teachers/pages/teachers-page'
import type { Teacher } from '@/features/teachers/types/teachers.types'
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from '@/features/teachers/services/teachers.service'

const toastSuccess = vi.fn()

vi.mock('@/lib/toast', () => ({
  toast: { success: (...args: unknown[]) => toastSuccess(...args), error: vi.fn() },
}))

vi.mock('@/features/teachers/services/teachers.service', () => ({
  createTeacher: vi.fn(),
  deleteTeacher: vi.fn(),
  getTeachers: vi.fn(),
  updateTeacher: vi.fn(),
}))

const getTeachersMock = vi.mocked(getTeachers)
const createTeacherMock = vi.mocked(createTeacher)
const updateTeacherMock = vi.mocked(updateTeacher)
const deleteTeacherMock = vi.mocked(deleteTeacher)

function fixture(): Teacher[] {
  return [
    {
      id: 't-100',
      teacherNumber: 'T-100',
      firstName: 'Mohamed',
      lastName: 'Benali',
      gender: 'male',
      birthDate: '1980-04-12',
      phone: '0550123456',
      city: 'Alger',
      specialty: 'math',
      qualification: 'master',
      hireDate: '2020-09-01',
      classIds: ['cl-1am-a'],
      status: 'active',
      createdAt: '2025-09-08',
    },
    {
      id: 't-101',
      teacherNumber: 'T-101',
      firstName: 'Salima',
      lastName: 'Ferhat',
      gender: 'female',
      birthDate: '1985-01-20',
      phone: '0550987654',
      email: 'salima@mail.dz',
      address: 'Hydra, Alger',
      city: 'Hydra',
      specialty: 'arabic',
      qualification: 'phd',
      hireDate: '2018-09-02',
      classIds: ['cl-1am-a', 'cl-1am-b'],
      status: 'inactive',
      createdAt: '2023-09-06',
    },
    {
      id: 't-102',
      teacherNumber: 'T-102',
      firstName: 'Karim',
      lastName: 'Belkacem',
      gender: 'male',
      birthDate: '1979-11-03',
      phone: '0770123456',
      city: 'Kouba',
      specialty: 'french',
      qualification: 'licence',
      hireDate: '2015-09-01',
      classIds: [],
      status: 'onleave',
      createdAt: '2024-09-05',
    },
  ]
}

function renderPage() {
  return render(
    <MemoryRouter>
      <TeachersPage />
    </MemoryRouter>,
  )
}

function table() {
  return within(screen.getByRole('table'))
}

describe('TeachersPage', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
    getTeachersMock.mockReset()
    createTeacherMock.mockReset()
    updateTeacherMock.mockReset()
    deleteTeacherMock.mockReset()
    toastSuccess.mockClear()
  })

  it('shows a loading skeleton while the data is pending', () => {
    getTeachersMock.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByTestId('teachers-skeleton')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Enseignants' })).toBeInTheDocument()
  })

  it('renders the data state in French with stats and teachers', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    renderPage()

    expect(await screen.findByText('Total des enseignants')).toBeInTheDocument()
    expect(screen.getByText('Enseignants actifs')).toBeInTheDocument()
    expect(screen.getByText('Enseignants en congé')).toBeInTheDocument()
    expect(screen.getByText('Nouveaux enseignants')).toBeInTheDocument()

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument()
    })
    expect(table().getByText('Mathématiques')).toBeInTheDocument()
    expect(table().getByText('Salima Ferhat')).toBeInTheDocument()
  })

  it('filters by search (debounced)', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.type(screen.getByRole('textbox', { name: 'Rechercher un enseignant…' }), 'Ferhat')

    await waitFor(() => {
      expect(table().queryByRole('link', { name: 'Mohamed Benali' })).not.toBeInTheDocument()
    })
    expect(table().getByRole('link', { name: 'Salima Ferhat' })).toBeInTheDocument()
  })

  it('filters by specialty via the select', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Toutes les spécialités' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Mathématiques' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument()
    })
    expect(table().queryByRole('link', { name: 'Salima Ferhat' })).not.toBeInTheDocument()
    expect(table().queryByRole('link', { name: 'Karim Belkacem' })).not.toBeInTheDocument()
  })

  it('shows resolved classes in the table', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    expect(table().getAllByText('1 classe(s)')).toHaveLength(1)
    expect(table().getByText('2 classe(s)')).toBeInTheDocument()
    expect(table().getByText('0 classe(s)')).toBeInTheDocument()
  })

  it('sorts by name descending', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Trier par' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Nom (Z → A)' }))

    await waitFor(() => {
      const rows = table().getAllByRole('row')
      expect(within(rows[1]).getByRole('link', { name: 'Salima Ferhat' })).toBeInTheDocument()
    })
  })

  it('creates a teacher through the form sheet', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    createTeacherMock.mockResolvedValue({
      ...fixture()[0],
      id: 't-new',
      teacherNumber: 'T-103',
      firstName: 'Karim',
      lastName: 'Testeur',
    })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un enseignant' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ajouter un enseignant' })).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Ex. Amine'), 'Karim')
    await userEvent.type(screen.getByPlaceholderText('Ex. Benali'), 'Testeur')
    await userEvent.type(screen.getByLabelText(/Date de naissance/), '1985-05-05')
    await userEvent.type(screen.getByPlaceholderText('Ex. 0550 12 34 56'), '0660998877')
    await userEvent.type(screen.getByPlaceholderText('Ex. Alger'), 'Alger')
    await userEvent.type(screen.getByLabelText(/Date d['’]embauche/), '2025-09-08')

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Karim Testeur' })).toBeInTheDocument()
    })
    expect(toastSuccess).toHaveBeenCalledWith('L’enseignant a été ajouté avec succès.')
  })

  it('validates required fields before submitting', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un enseignant' }))
    await screen.findByRole('dialog')

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(await screen.findAllByText('Ce champ est requis.')).not.toHaveLength(0)
    expect(createTeacherMock).not.toHaveBeenCalled()
  })

  it('edits a teacher through the form sheet', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    updateTeacherMock.mockResolvedValue({ ...fixture()[0], firstName: 'Karim' })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    const row = table().getByRole('row', { name: /Mohamed Benali/ })
    await userEvent.click(within(row).getByRole('button', { name: 'Actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Modifier' }))

    expect(await screen.findByRole('heading', { name: 'Modifier l’enseignant' })).toBeInTheDocument()
    const firstNameInput = screen.getAllByLabelText(/Prénom/)[0]
    expect(firstNameInput).toHaveValue('Mohamed')

    await userEvent.clear(firstNameInput)
    await userEvent.type(firstNameInput, 'Karim')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Karim Benali' })).toBeInTheDocument()
    })
    expect(toastSuccess).toHaveBeenCalledWith('L’enseignant a été mis à jour avec succès.')
  })

  it('deletes a teacher after confirmation and warns about assigned classes', async () => {
    getTeachersMock.mockResolvedValue(fixture())
    deleteTeacherMock.mockResolvedValue(undefined)
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument())

    const row = table().getByRole('row', { name: /Mohamed Benali/ })
    await userEvent.click(within(row).getByRole('button', { name: 'Actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Supprimer' }))

    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByText(/a des classes assignées/)).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {
      expect(table().queryByRole('link', { name: 'Mohamed Benali' })).not.toBeInTheDocument()
    })
    expect(deleteTeacherMock).toHaveBeenCalledWith('t-100')
    expect(toastSuccess).toHaveBeenCalledWith('L’enseignant a été supprimé avec succès.')
  })

  it('renders the empty state when no teachers exist', async () => {
    getTeachersMock.mockResolvedValue([])
    renderPage()
    expect(await screen.findByText('Aucun enseignant trouvé')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Ajouter un enseignant' })).not.toHaveLength(0)
  })

  it('renders an error state and retries', async () => {
    getTeachersMock
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(fixture())
    renderPage()

    expect(await screen.findByText('Impossible de charger les enseignants')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: 'Mohamed Benali' })).toBeInTheDocument()
    })
    expect(getTeachersMock).toHaveBeenCalledTimes(2)
  })
})