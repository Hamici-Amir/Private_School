import { beforeEach, describe, expect, it } from 'vitest'

import type { ClassFormValues } from '../types/classes.types'
import {
  createClass,
  deleteClass,
  getClass,
  getClasses,
  resetClassesMock,
  updateClass,
} from './classes.service'

const VALUES: ClassFormValues = {
  label: ' 4AM B ',
  level: '4AM',
  room: '207',
  capacity: 32,
  headTeacherId: 't-002',
  status: 'active',
}

describe('classes service', () => {
  beforeEach(() => {
    resetClassesMock()
  })

  it('returns all seeded classes', async () => {
    const all = await getClasses()
    expect(all).toHaveLength(16)
    expect(all[0].id).toBe('cl-1ap-a')
    expect(all.at(-1)?.id).toBe('cl-3as-a')
  })

  it('finds a class by id', async () => {
    const found = await getClass('cl-3as-a')
    expect(found?.label).toBe('3AS A')
  })

  it('returns clones, not internal references', async () => {
    const [first] = await getClasses()
    first.label = 'HACKED'
    const all = await getClasses()
    expect(all.find((schoolClass) => schoolClass.id === first.id)?.label).not.toBe('HACKED')
  })

  it('creates a class with the next id and prepends it', async () => {
    const created = await createClass(VALUES)
    expect(created.id).toBe('cl-100')
    expect(created.label).toBe('4AM B')
    expect(created.room).toBe('207')
    expect(created.capacity).toBe(32)
    expect(created.headTeacherId).toBe('t-002')
    const all = await getClasses()
    expect(all).toHaveLength(17)
    expect(all[0].id).toBe('cl-100')
  })

  it('updates a class and normalizes optional fields', async () => {
    const updated = await updateClass('cl-1am-a', {
      ...VALUES,
      label: '1AM D',
      headTeacherId: 'none',
    })
    expect(updated.label).toBe('1AM D')
    expect(updated.headTeacherId).toBeUndefined()
  })

  it('throws when updating an unknown class', async () => {
    await expect(updateClass('cl-999', VALUES)).rejects.toThrow('Class not found')
  })

  it('deletes a class and is idempotent', async () => {
    await deleteClass('cl-2ap-a')
    expect(await getClasses()).toHaveLength(15)
    await deleteClass('cl-2ap-a')
    expect(await getClasses()).toHaveLength(15)
  })
})
