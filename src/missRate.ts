import { Attempt, KeyStats } from './history'

export interface KeyMissRate {
  key: string
  missed: number
  needed: number
  missRate: number
}

interface RankOptions {
  minNeeded: number
  minMissRate?: number
  limit: number
}

// Keys ordered worst-first by Miss Rate, ignoring keys needed too rarely to judge
export function rankByMissRate(
  keys: Record<string, KeyStats>,
  { minNeeded, minMissRate = 0, limit }: RankOptions
): KeyMissRate[] {
  return Object.entries(keys)
    .filter(([, { needed }]) => needed >= minNeeded)
    .map(([key, { needed, missed }]) => ({
      key,
      missed,
      needed,
      missRate: missed / needed,
    }))
    .filter(({ missRate }) => missRate > minMissRate)
    .sort((a, b) => b.missRate - a.missRate || b.missed - a.missed)
    .slice(0, limit)
}

const WEAK_KEY_ATTEMPTS = 10
const WEAK_KEY_MIN_NEEDED = 10
const WEAK_KEY_MIN_MISS_RATE = 0.05

// Weak Keys: worst Miss Rates across the learner's most recent Attempts
export function findWeakKeys(attempts: Attempt[]): string[] {
  const combined: Record<string, KeyStats> = {}
  for (const { keys } of attempts.slice(-WEAK_KEY_ATTEMPTS)) {
    for (const [key, { needed, missed }] of Object.entries(keys)) {
      const total = combined[key] ?? { needed: 0, missed: 0 }
      combined[key] = {
        needed: total.needed + needed,
        missed: total.missed + missed,
      }
    }
  }
  return rankByMissRate(combined, {
    minNeeded: WEAK_KEY_MIN_NEEDED,
    minMissRate: WEAK_KEY_MIN_MISS_RATE,
    limit: 5,
  }).map(({ key }) => key)
}
