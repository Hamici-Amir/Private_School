import { describe, expect, it } from 'vitest'

import { createClassSchema } from './classes.validation'

const MESSAGES = {
  required: 'required',
  labelTooLong: 'labelTooLong',
  roomTooLong: 'roomTooLong',
  capacityInvalid: 'capacityInvalid',
  capacityInt: 'capacityInt',
}

const schema = createClassSchema(MESSAGES)

const VALID = {
  label: '4AM B',
  level: '4AM',
  room: '207',
  capacity: 32,
  headTeacherId: 'none',
  status: 'active',
}

function expectIssue(data: Record<string, unknown>, path: string) {
  const result = schema.safeParse(data)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues.some((issue) => issue.path[0] === path)).toBe(true)
  }
}

describe('createClassSchema', () => {
  it('accepts a valid class', () => {
    expect(schema.safeParse(VALID).success).toBe(true)
  })

  it('accepts a blank headTeacherId', () => {
    expect(schema.safeParse({ ...VALID, headTeacherId: '' }).success).toBe(true)
  })

  it('rejects an empty label', () => {
    expectIssue({ ...VALID, label: '  ' }, 'label')
  })

  it('rejects an over-long label', () => {
    expectIssue({ ...VALID, label: 'A'.repeat(101) }, 'label')
  })

  it('rejects an over-long room', () => {
    expectIssue({ ...VALID, room: 'A'.repeat(11) }, 'room')
  })

  it('rejects an unknown level', () => {
    expectIssue({ ...VALID, level: '4AA' }, 'level')
  })

  it('rejects capacity below 1', () => {
    expectIssue({ ...VALID, capacity: 0 }, 'capacity')
  })

  it('rejects capacity above 50', () => {
    expectIssue({ ...VALID, capacity: 51 }, 'capacity')
  })

  it('rejects a fractional capacity', () => {
    expectIssue({ ...VALID, capacity: 32.5 }, 'capacity')
  })

  it('rejects an unknown status', () => {
    expectIssue({ ...VALID, status: 'broken' }, 'status')
  })
})
