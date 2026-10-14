import type { ClassFormValues, SchoolClass } from '../types/classes.types'
import { createClassesMock } from '../mocks/classes.mock'
import { toClass } from '../utils/classes.utils'

/**
 * In-memory mock service mirroring the future API surface:
 * getClasses / getClass / createClass / updateClass / deleteClass.
 */

let classes: SchoolClass[] = createClassesMock()
let sequence = 100

/** Test helper: restores the original mock dataset. */
export function resetClassesMock(): void {
  classes = createClassesMock()
  sequence = 100
}

function clone(schoolClass: SchoolClass): SchoolClass {
  return { ...schoolClass }
}

export async function getClasses(): Promise<SchoolClass[]> {
  return classes.map(clone)
}

export async function getClass(id: string): Promise<SchoolClass | undefined> {
  const found = classes.find((schoolClass) => schoolClass.id === id)
  return found ? clone(found) : undefined
}

export async function createClass(values: ClassFormValues): Promise<SchoolClass> {
  const id = `cl-${sequence++}`
  const created = toClass(id, values)
  classes = [created, ...classes]
  return clone(created)
}

export async function updateClass(id: string, values: ClassFormValues): Promise<SchoolClass> {
  const index = classes.findIndex((schoolClass) => schoolClass.id === id)
  if (index === -1) {
    throw new Error(`Class not found: ${id}`)
  }
  const updated = toClass(id, values)
  classes[index] = updated
  return clone(updated)
}

export async function deleteClass(id: string): Promise<void> {
  classes = classes.filter((schoolClass) => schoolClass.id !== id)
}
