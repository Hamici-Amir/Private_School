import type { Parent, ParentFormValues } from '../types/parents.types'
import { createParentsMock } from '../mocks/parents.mock'
import { toParent } from '../utils/parents.utils'

/**
 * In-memory mock service mirroring the future API surface:
 * getParents / getParent / createParent / updateParent / deleteParent.
 */

let parents: Parent[] = createParentsMock()

/** Test helper: restores the original mock dataset. */
export function resetParentsMock(): void {
  parents = createParentsMock()
}

function clone(parent: Parent): Parent {
  return { ...parent, childrenIds: [...parent.childrenIds] }
}

function nextNumber(): string {
  return `P-${String(parents.length + 1).padStart(3, '0')}`
}

export async function getParents(): Promise<Parent[]> {
  return parents.map(clone)
}

export async function getParent(id: string): Promise<Parent | undefined> {
  const found = parents.find((parent) => parent.id === id)
  return found ? clone(found) : undefined
}

export async function createParent(values: ParentFormValues): Promise<Parent> {
  const id = `p-${Date.now().toString(36)}`
  const parent = toParent(id, nextNumber(), values)
  parents = [parent, ...parents]
  return clone(parent)
}

export async function updateParent(
  id: string,
  values: ParentFormValues,
): Promise<Parent> {
  const index = parents.findIndex((parent) => parent.id === id)
  if (index === -1) {
    throw new Error(`Parent not found: ${id}`)
  }
  const updated = toParent(id, parents[index].parentNumber, values)
  updated.childrenIds = [...parents[index].childrenIds]
  parents[index] = updated
  return clone(updated)
}

export async function deleteParent(id: string): Promise<void> {
  parents = parents.filter((parent) => parent.id !== id)
}

/** Parents linked to a given student id (used by the student detail page). */
export async function getParentsByStudentId(studentId: string): Promise<Parent[]> {
  return parents
    .filter((parent) => parent.childrenIds.includes(studentId))
    .map(clone)
}