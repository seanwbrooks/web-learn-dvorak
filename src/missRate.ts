import { KeyStats } from './history'

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
