// Learner data lives only in the browser (see docs/adr/0001)

const PERSONAL_BEST_KEY = 'dvorakPersonalBest'
const ATTEMPTS_KEY = 'dvorakAttempts'
const INTRO_SEEN_KEY = 'dvorakIntroSeen'
const PASSAGE_LENGTH_KEY = 'dvorakPassageLength'
const MAX_ATTEMPTS = 50

export interface KeyStats {
  needed: number
  missed: number
  // Absent on Attempts recorded before Wrong Keypresses were tracked
  wrongKeypresses?: number
}

export interface Attempt {
  wpm: number
  date: string
  keys: Record<string, KeyStats>
  // A Practice Test: counts toward Weak Keys, never WPM history or Personal Best
  practice?: boolean
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

// Whether the learner has closed the intro once; it opens on a first visit
export function loadIntroSeen(): boolean {
  try {
    return window.localStorage.getItem(INTRO_SEEN_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveIntroSeen(): void {
  try {
    window.localStorage.setItem(INTRO_SEEN_KEY, 'true')
  } catch {
    // Storage unavailable (private window, blocked site data)
  }
}

// Words in a normal Passage; Practice Passages are always 25
export const PASSAGE_LENGTHS = [25, 50] as const
export type PassageLength = (typeof PASSAGE_LENGTHS)[number]

export function loadPassageLength(): PassageLength {
  try {
    const saved = window.localStorage.getItem(PASSAGE_LENGTH_KEY)
    return saved === '25' ? 25 : 50
  } catch {
    return 50
  }
}

export function savePassageLength(length: PassageLength): void {
  try {
    window.localStorage.setItem(PASSAGE_LENGTH_KEY, length.toString())
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
export function recordAttempt(
  currentAttempts: Attempt[],
  attempt: Attempt
): Attempt[] {
  const attempts = [...currentAttempts, attempt].slice(-MAX_ATTEMPTS)
  try {
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
  } catch {
    // Storage unavailable (private window, blocked site data)
  }
  return attempts
}

export function buildKeyStats(
  needed: Record<string, number>,
  missed: Record<string, number>,
  wrongKeypresses: Record<string, number>
): Record<string, KeyStats> {
  const keys: Record<string, KeyStats> = {}
  for (const [key, count] of Object.entries(needed)) {
    keys[key] = {
      needed: count,
      missed: missed[key] ?? 0,
      wrongKeypresses: wrongKeypresses[key] ?? 0,
    }
  }
  return keys
}
