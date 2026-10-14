import { beforeEach, describe, expect, it } from 'vitest'

import type { ParentFormValues } from '../types/parents.types'
import {
  createParent,
  deleteParent,
  getParent,
  getParents,
  getParentsByStudentId,
  resetParentsMock,
  updateParent,
} from './parents.service'

const VALUES: ParentFormValues = {
  firstName: 'Yacine',
  lastName: 'Ziani',
  firstNameAr: 'ياسين',
  lastNameAr: 'زياني',
  gender: 'male',
  relationship: 'father',
  phone: '0660 22 33 44',
  secondaryPhone: '',
  email: '',
  address: 'Cité AADL, Alger',
  city: 'Alger',
  occupation: '',
  nationality: 'Algérienne',
  notes: '',
  status: 'active',
}

beforeEach(() => {
  resetParentsMock()
})

describe('parents.service', () => {
  it('returns the full seeded list', async () => {
    const parents = await getParents()
    expect(parents).toHaveLength(28)
    expect(parents.map((parent) => parent.id)).toContain('p-001')
  })

  it('finds a parent by id and returns undefined for unknown ids', async () => {
    const parent = await getParent('p-001')
    expect(parent?.firstName).toBe('Mohamed')
    expect(parent?.childrenIds).toContain('s-001')
    expect(await getParent('p-unknown')).toBeUndefined()
  })

  it('returns copies, not internal references', async () => {
    const [parent] = await getParents()
    parent.firstName = 'Hacked'
    parent.childrenIds.push('s-999')
    const fresh = await getParent(parent.id)
    expect(fresh?.firstName).toBe('Mohamed')
    expect(fresh?.childrenIds).not.toContain('s-999')
  })

  it('creates a parent, assigns a sequential number and prepends it', async () => {
    const created = await createParent(VALUES)
    expect(created.id).toBeTruthy()
    expect(created.firstName).toBe('Yacine')
    expect(created.parentNumber).toBe('P-029')
    expect(created.childrenIds).toEqual([])

    const parents = await getParents()
    expect(parents[0].id).toBe(created.id)
    expect(parents).toHaveLength(29)
  })

  it('updates a parent, preserves linked children and throws for unknown ids', async () => {
    const updated = await updateParent('p-001', { ...VALUES, firstName: 'Karim' })
    expect(updated.firstName).toBe('Karim')
    expect((await getParent('p-001'))?.firstName).toBe('Karim')
    expect((await getParent('p-001'))?.childrenIds).toContain('s-001')

    await expect(updateParent('p-nope', VALUES)).rejects.toThrow('Parent not found')
  })

  it('deletes a parent and is idempotent for unknown ids', async () => {
    await deleteParent('p-001')
    expect(await getParent('p-001')).toBeUndefined()

    await expect(deleteParent('p-already-gone')).resolves.toBeUndefined()
    const parents = await getParents()
    expect(parents).toHaveLength(27)
  })

  it('resolves the parents linked to a student id', async () => {
    const parents = await getParentsByStudentId('s-001')
    expect(parents).toHaveLength(1)
    expect(parents[0].id).toBe('p-001')

    expect(await getParentsByStudentId('s-016')).toHaveLength(1)
    expect(await getParentsByStudentId('s-unknown')).toHaveLength(0)
  })
})