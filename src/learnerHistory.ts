// Learner data lives only in the browser (see docs/adr/0001)

const PERSONAL_BEST_KEY = 'dvorakPersonalBest'
const ATTEMPTS_KEY = 'dvorakAttempts'
const INTRO_SEEN_KEY = 'dvorakIntroSeen'
const PASSAGE_LENGTH_KEY = 'dvorakPassageLength'
const LEVEL_KEY = 'dvorakLevel'
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
  // Absent on Practice Tests, and on Attempts recorded before Levels (all Hard)
  level?: Level
}

// How much of the keyboard a normal Passage needs; Practice Passages have none
export const LEVELS = ['easy', 'medium', 'hard'] as const
export type Level = (typeof LEVELS)[number]

export const levelLabel = (level: Level) =>
  level.charAt(0).toUpperCase() + level.slice(1)

export const attemptLevel = (attempt: Attempt): Level => attempt.level ?? 'hard'

// Hard keeps the key from before Levels, so existing Personal Bests carry over
const personalBestKey = (level: Level) =>
  level === 'hard' ? PERSONAL_BEST_KEY : `${PERSONAL_BEST_KEY}.${level}`

export function loadPersonalBest(level: Level = 'hard'): number | null {
  try {
    const saved = window.localStorage.getItem(personalBestKey(level))
    return saved ? parseInt(saved, 10) : null
  } catch {
    return null
  }
}

export function savePersonalBest(wpm: number, level: Level = 'hard'): void {
  try {
    window.localStorage.setItem(personalBestKey(level), wpm.toString())
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

export function loadLevel(): Level {
  try {
    const saved = window.localStorage.getItem(LEVEL_KEY)
    return LEVELS.find((level) => level === saved) ?? 'hard'
  } catch {
    return 'hard'
  }
}

export function saveLevel(level: Level): void {
  try {
    window.localStorage.setItem(LEVEL_KEY, level)
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

// The Attempts and Personal Bests the app reads back on every visit
export interface LearnerHistory {
  attempts: Attempt[]
  personalBests: Record<Level, number | null>
}

export const loadLearnerHistory = (): LearnerHistory => ({
  attempts: loadAttempts(),
  personalBests: {
    easy: loadPersonalBest('easy'),
    medium: loadPersonalBest('medium'),
    hard: loadPersonalBest('hard'),
  },
})

// Adds a finished Attempt; only a normal Test, never a Practice Test, can set
// a new Personal Best, and only for its own Level
export function recordAttempt(
  history: LearnerHistory,
  attempt: Attempt
): LearnerHistory {
  const attempts = [...history.attempts, attempt].slice(-MAX_ATTEMPTS)
  try {
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
  } catch {
    // Storage unavailable (private window, blocked site data)
  }

  const level = attemptLevel(attempt)
  const best = history.personalBests[level]
  const isNewBest = !attempt.practice && (best === null || attempt.wpm > best)
  if (!isNewBest) return { attempts, personalBests: history.personalBests }
  savePersonalBest(attempt.wpm, level)
  return {
    attempts,
    personalBests: { ...history.personalBests, [level]: attempt.wpm },
  }
}
