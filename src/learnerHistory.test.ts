// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  Attempt,
  loadAttempts,
  loadPersonalBest,
  recordAttempt,
} from './learnerHistory'

const attempt = (wpm: number, practice = false): Attempt => ({
  wpm,
  date: '2026-10-29T12:00:00.000Z',
  keys: {},
  ...(practice && { practice: true }),
})
const empty = { attempts: [], personalBest: null }

describe('recordAttempt', () => {
  it("sets the first Test's WPM as the Personal Best", () => {
    const history = recordAttempt(empty, attempt(40))
    expect(history.personalBest).toBe(40)
    expect(loadPersonalBest()).toBe(40)
  })

  it('raises the Personal Best only for a faster Test', () => {
    let history = recordAttempt(empty, attempt(40))
    history = recordAttempt(history, attempt(35))
    expect(history.personalBest).toBe(40)
    history = recordAttempt(history, attempt(52))
    expect(history.personalBest).toBe(52)
    expect(loadPersonalBest()).toBe(52)
  })

  it('never sets a Personal Best from a Practice Test', () => {
    const history = recordAttempt(
      recordAttempt(empty, attempt(40)),
      attempt(90, true)
    )
    expect(history.personalBest).toBe(40)
    expect(loadPersonalBest()).toBe(40)
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
