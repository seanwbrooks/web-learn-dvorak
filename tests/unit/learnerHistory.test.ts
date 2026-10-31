// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  Attempt,
  Level,
  loadAttempts,
  loadPersonalBest,
  recordAttempt,
} from '../../src/learnerHistory'

const attempt = (wpm: number, practice = false): Attempt => ({
  wpm,
  date: '2026-10-29T12:00:00.000Z',
  keys: {},
  ...(practice && { practice: true }),
})
const empty = {
  attempts: [],
  personalBests: { easy: null, medium: null, hard: null },
}

describe('recordAttempt', () => {
  it("sets the first Test's WPM as the Personal Best", () => {
    const history = recordAttempt(empty, attempt(40))
    expect(history.personalBests.hard).toBe(40)
    expect(loadPersonalBest()).toBe(40)
  })

  it('raises the Personal Best only for a faster Test', () => {
    let history = recordAttempt(empty, attempt(40))
    history = recordAttempt(history, attempt(35))
    expect(history.personalBests.hard).toBe(40)
    history = recordAttempt(history, attempt(52))
    expect(history.personalBests.hard).toBe(52)
    expect(loadPersonalBest()).toBe(52)
  })

  it('never sets a Personal Best from a Practice Test', () => {
    const history = recordAttempt(
      recordAttempt(empty, attempt(40)),
      attempt(90, true)
    )
    expect(history.personalBests.hard).toBe(40)
    expect(loadPersonalBest()).toBe(40)
  })

  it('keeps a separate Personal Best for each Level', () => {
    const atLevel = (wpm: number, level: Level) => ({
      ...attempt(wpm),
      level,
    })
    let history = recordAttempt(empty, attempt(40))
    history = recordAttempt(history, atLevel(90, 'easy'))
    history = recordAttempt(history, atLevel(60, 'medium'))

    expect(history.personalBests).toEqual({ easy: 90, medium: 60, hard: 40 })
    expect(loadPersonalBest('easy')).toBe(90)
    expect(loadPersonalBest('medium')).toBe(60)
    expect(loadPersonalBest('hard')).toBe(40)
  })

  it('keeps every Attempt, Practice included, up to the last 50', () => {
    let history = recordAttempt(empty, attempt(30, true))
    for (let wpm = 1; wpm <= 50; wpm++) {
      history = recordAttempt(history, attempt(wpm))
    }
    expect(history.attempts).toHaveLength(50)
    expect(history.attempts[0].wpm).toBe(1)
    expect(loadAttempts()).toEqual(history.attempts)
  })
})
