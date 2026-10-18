// Learner data lives only in the browser (see docs/adr/0001)

const PERSONAL_BEST_KEY = 'dvorakPersonalBest'
const ATTEMPTS_KEY = 'dvorakAttempts'
const MAX_ATTEMPTS = 50

export interface KeyStats {
  needed: number
  missed: number
}

export interface Attempt {
  wpm: number
  date: string
  keys: Record<string, KeyStats>
}

export function loadPersonalBest(): number | null {
  try {
    const saved = window.localStorage.getItem(PERSONAL_BEST_KEY)
    return saved ? parseInt(saved, 10) : null
  } catch {
    return null
  }
}

export function savePersonalBest(wpm: number): void {
  try {
    window.localStorage.setItem(PERSONAL_BEST_KEY, wpm.toString())
  } catch {
    // Storage unavailable (private window, blocked site data)
  }
}

export function loadAttempts(): Attempt[] {
  try {
    return JSON.parse(window.localStorage.getItem(ATTEMPTS_KEY) || '[]')
  } catch {
    return []
  }
}

// Returns the learner's history including the new Attempt
export function recordAttempt(attempt: Attempt): Attempt[] {
  const attempts = [...loadAttempts(), attempt].slice(-MAX_ATTEMPTS)
  try {
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
  } catch {
    // Storage unavailable (private window, blocked site data)
  }
  return attempts
}

export function buildKeyStats(
  needed: Record<string, number>,
  missed: Record<string, number>
): Record<string, KeyStats> {
  const keys: Record<string, KeyStats> = {}
  for (const [key, count] of Object.entries(needed)) {
    keys[key] = { needed: count, missed: missed[key] ?? 0 }
  }
  return keys
}
