import { describe, expect, it } from 'vitest'
import { findWeakKeys } from '../../src/weakKeys'
import { Attempt, KeyStats } from '../../src/learnerHistory'

// An Attempt where each key was needed and missed the given number of times
const attempt = (
  stats: Record<string, [needed: number, missed: number]>,
  practice = false
): Attempt => {
  const keys: Record<string, KeyStats> = {}
  for (const [key, [needed, missed]] of Object.entries(stats)) {
    keys[key] = { needed, missed }
  }
  return {
    wpm: 40,
    date: '2026-10-26T12:00:00.000Z',
    keys,
    ...(practice && { practice: true }),
  }
}
const repeat = (count: number, make: () => Attempt) =>
  Array.from({ length: count }, make)

describe('findWeakKeys', () => {
  it('names keys with a high Miss Rate, worst first', () => {
    const attempts = [attempt({ a: [20, 2], s: [20, 8], e: [20, 4] })]
    expect(findWeakKeys(attempts)).toEqual(['s', 'e', 'a'])
  })

  it('has none for a learner with no Attempts', () => {
    expect(findWeakKeys([])).toEqual([])
  })

  it('ignores a Miss Rate of 5% or less', () => {
    const attempts = [attempt({ a: [20, 1], s: [20, 2] })]
    expect(findWeakKeys(attempts)).toEqual(['s'])
  })

  it('ignores keys needed fewer than 10 times in all', () => {
    const attempts = [attempt({ q: [9, 9], s: [20, 8] })]
    expect(findWeakKeys(attempts)).toEqual(['s'])
  })

  it('adds up a key across Attempts before judging it', () => {
    // 5 + 5 = 10 times needed, 3 of them missed
    const attempts = [attempt({ q: [5, 2] }), attempt({ q: [5, 1] })]
    expect(findWeakKeys(attempts)).toEqual(['q'])
  })

  it('looks only at the last 10 Attempts', () => {
    const early = attempt({ z: [20, 20] })
    const later = repeat(10, () => attempt({ s: [20, 8], z: [20, 0] }))
    expect(findWeakKeys([early, ...later])).toEqual(['s'])
  })

  it('counts Practice Attempts', () => {
    const attempts = [attempt({ s: [20, 8] }, true)]
    expect(findWeakKeys(attempts)).toEqual(['s'])
  })

  it('names at most 5, keeping the worst', () => {
    const attempts = [
      attempt({
        a: [20, 2],
        o: [20, 3],
        e: [20, 4],
        u: [20, 5],
        i: [20, 6],
        d: [20, 7],
      }),
    ]
    expect(findWeakKeys(attempts)).toEqual(['d', 'i', 'u', 'e', 'o'])
  })

  it('ranks the key missed more often first when Miss Rates tie', () => {
    const attempts = [attempt({ s: [10, 2], t: [20, 4] })]
    expect(findWeakKeys(attempts)).toEqual(['t', 's'])
  })
})
