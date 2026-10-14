import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { useLocaleStore } from '@/store/locale-store'

import { ClassesPage } from '@/features/classes/pages/classes-page'
import type { SchoolClass } from '@/features/classes/types/classes.types'
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from '@/features/classes/services/classes.service'
import { getStudents } from '@/features/students/services/students.service'
import type { Student } from '@/features/students/types/students.types'
import { getTeachers } from '@/features/teachers/services/teachers.service'
import type { Teacher } from '@/features/teachers/types/teachers.types'

const toastSuccess = vi.fn()

vi.mock('@/lib/toast', () => ({
  toast: { success: (...args: unknown[]) => toastSuccess(...args), error: vi.fn() },
}))

vi.mock('@/features/classes/services/classes.service', () => ({
  createClass: vi.fn(),
  deleteClass: vi.fn(),
  getClasses: vi.fn(),
  updateClass: vi.fn(),
}))

vi.mock('@/features/students/services/students.service', () => ({
  getStudents: vi.fn(),
}))

vi.mock('@/features/teachers/services/teachers.service', () => ({
  getTeachers: vi.fn(),
}))

const getClassesMock = vi.mocked(getClasses)
const createClassMock = vi.mocked(createClass)
const updateClassMock = vi.mocked(updateClass)
const deleteClassMock = vi.mocked(deleteClass)
const getStudentsMock = vi.mocked(getStudents)
const getTeachersMock = vi.mocked(getTeachers)

function classesFixture(): SchoolClass[] {
  return [
    {
      id: 'c-100',
      label: '1AM C',
      level: '1AM',
      room: '201',
      capacity: 32,
      headTeacherId: 't-1',
      status: 'active',
      createdAt: '2025-09-08',
    },
    {
      id: 'c-101',
      label: '2AS B',
      level: '2AS',
      room: '304',
      capacity: 30,
      status: 'inactive',
      createdAt: '2025-09-07',
    },
    {
      id: 'c-102',
      label: '5AP A',
      level: '5AP',
      room: '105',
      capacity: 35,
      status: 'active',
      createdAt: '2025-09-06',
    },
  ]
}

function studentsFixture(): Student[] {
  return [
    {
      id: 's-1',
      firstName: 'Karim',
      lastName: 'Benali',
      birthDate: '2015-05-01',
      gender: 'male',
      guardianName: 'Mohamed',
      guardianPhone: '0550123456',
      level: '1AM',
      classId: 'c-100',
      status: 'active',
      enrollmentDate: '2025-09-01',
    },
  ]
}

function teachersFixture(): Teacher[] {
  return [
    {
      id: 't-1',
      teacherNumber: 'T-100',
      firstName: 'Salima',
      lastName: 'Ferhat',
      gender: 'female',
      birthDate: '1985-01-20',
      phone: '0550987654',
      specialty: 'math',
      qualification: 'master',
      hireDate: '2018-09-02',
      classIds: ['c-100'],
      status: 'active',
      createdAt: '2023-09-06',
    },
  ]
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ClassesPage />
    </MemoryRouter>,
  )
}

function table() {
  return within(screen.getByRole('table'))
}

describe('ClassesPage', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('fr')
    getClassesMock.mockReset()
    createClassMock.mockReset()
    updateClassMock.mockReset()
    deleteClassMock.mockReset()
    getStudentsMock.mockReset()
    getTeachersMock.mockReset()
    getStudentsMock.mockResolvedValue(studentsFixture())
    getTeachersMock.mockResolvedValue(teachersFixture())
    toastSuccess.mockClear()
  })

  it('shows a loading skeleton while the data is pending', () => {
    getClassesMock.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByTestId('classes-skeleton')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
  })

  it('renders the data state in French with stats and classes', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    renderPage()

    expect(await screen.findByText('Total des classes')).toBeInTheDocument()
    expect(screen.getByText('Classes au primaire')).toBeInTheDocument()
    expect(screen.getByText('Classes au moyen')).toBeInTheDocument()
    expect(screen.getByText('Classes au secondaire')).toBeInTheDocument()

    await waitFor(() => {
      expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument()
    })
    expect(table().getByText('1re année moyenne')).toBeInTheDocument()
    expect(table().getByText('2e année secondaire')).toBeInTheDocument()
    expect(table().getByText('5e année primaire')).toBeInTheDocument()
    expect(table().getByRole('link', { name: 'Salima Ferhat' })).toBeInTheDocument()
    expect(table().getAllByText('32')).not.toHaveLength(0)
  })

  it('filters by search (debounced)', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    await userEvent.type(screen.getByRole('textbox', { name: 'Rechercher une classe…' }), '304')

    await waitFor(() => {
      expect(table().queryByRole('link', { name: '1AM C' })).not.toBeInTheDocument()
    })
    expect(table().getByRole('link', { name: '2AS B' })).toBeInTheDocument()
  })

  it('filters by level via the select', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Tous les niveaux' }))
    await userEvent.click(await screen.findByRole('option', { name: /^1AM/ }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument()
    })
    expect(table().queryByRole('link', { name: '2AS B' })).not.toBeInTheDocument()
    expect(table().queryByRole('link', { name: '5AP A' })).not.toBeInTheDocument()
  })

  it('filters by status via the select', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Tous les statuts' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Inactive' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: '2AS B' })).toBeInTheDocument()
    })
    expect(table().queryByRole('link', { name: '1AM C' })).not.toBeInTheDocument()
    expect(table().queryByRole('link', { name: '5AP A' })).not.toBeInTheDocument()
  })

  it('shows resolved student and teacher counts', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    expect(table().getByText('1 élève(s)')).toBeInTheDocument()
    expect(table().getAllByText('0 élève(s)')).toHaveLength(2)
    expect(table().getByText('1 enseignant(s)')).toBeInTheDocument()
  })

  it('sorts by label descending', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('combobox', { name: 'Trier par' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Libellé (Z → A)' }))

    await waitFor(() => {
      const rows = table().getAllByRole('row')
      expect(within(rows[1]).getByRole('link', { name: '5AP A' })).toBeInTheDocument()
    })
  })

  it('creates a class through the form sheet', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    createClassMock.mockResolvedValue({
      id: 'cl-100',
      label: '3AM B',
      level: '1AP',
      room: '204',
      capacity: 30,
      status: 'active',
      createdAt: '2026-08-20',
    })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter une classe' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nouvelle classe' })).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('Ex. 1AM C'), '3AM B')
    await userEvent.type(screen.getByPlaceholderText('Ex. 201'), '204')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: '3AM B' })).toBeInTheDocument()
    })
    expect(createClassMock).toHaveBeenCalledWith(
      expect.objectContaining({ label: '3AM B', room: '204' }),
    )
    expect(toastSuccess).toHaveBeenCalledWith('La classe a été créée avec succès.')
  })

  it('validates required fields before submitting', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter une classe' }))
    await screen.findByRole('dialog')

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(await screen.findAllByText('Ce champ est requis.')).not.toHaveLength(0)
    expect(createClassMock).not.toHaveBeenCalled()
  })

  it('edits a class through the form sheet', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    updateClassMock.mockResolvedValue({ ...classesFixture()[0], label: '1AM D' })
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    const row = table().getByRole('row', { name: /1AM C/ })
    await userEvent.click(within(row).getByRole('button', { name: 'Actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Modifier' }))

    expect(await screen.findByRole('heading', { name: 'Modifier la classe' })).toBeInTheDocument()
    const labelInput = screen.getAllByLabelText(/Libellé/)[0]
    expect(labelInput).toHaveValue('1AM C')

    await userEvent.clear(labelInput)
    await userEvent.type(labelInput, '1AM D')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: '1AM D' })).toBeInTheDocument()
    })
    expect(toastSuccess).toHaveBeenCalledWith('La classe a été mise à jour avec succès.')
  })

  it('deletes a class after confirmation and warns about linked students and teachers', async () => {
    getClassesMock.mockResolvedValue(classesFixture())
    deleteClassMock.mockResolvedValue(undefined)
    renderPage()
    await waitFor(() => expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument())

    const row = table().getByRole('row', { name: /1AM C/ })
    await userEvent.click(within(row).getByRole('button', { name: 'Actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Supprimer' }))

    const dialog = await screen.findByRole('alertdialog')
    expect(
      within(dialog).getByText(/contient des élèves inscrits ou des enseignants/),
    ).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {
      expect(table().queryByRole('link', { name: '1AM C' })).not.toBeInTheDocument()
    })
    expect(deleteClassMock).toHaveBeenCalledWith('c-100')
    expect(toastSuccess).toHaveBeenCalledWith('La classe a été supprimée avec succès.')
  })

  it('renders the empty state when no classes exist', async () => {
    getClassesMock.mockResolvedValue([])
    renderPage()
    expect(await screen.findByText('Aucune classe trouvée')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Ajouter une classe' })).not.toHaveLength(0)
  })

  it('renders an error state and retries', async () => {
    getClassesMock
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(classesFixture())
    renderPage()

    expect(await screen.findByText('Impossible de charger les classes')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))

    await waitFor(() => {
      expect(table().getByRole('link', { name: '1AM C' })).toBeInTheDocument()
    })
    expect(getClassesMock).toHaveBeenCalledTimes(2)
  })
})
