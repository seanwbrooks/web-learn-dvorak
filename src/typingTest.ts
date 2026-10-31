// A Test: one pass through a Passage, from the first keypress to the Attempt
// it ends in. Plain data and functions, so the rules of typing can be tested
// without React; the home page drives it with useReducer.
import { Attempt, KeyStats, Level } from './learnerHistory'
import { specialKeys, toPhysicalKey } from './keyboard'

export interface Test {
  passage: string
  // The Weak Keys a Practice Test targets; null during a normal Test
  practiceKeys: string[] | null
  level: Level
  typedIndex: number
  // Timed from the first correct character
  startedAt: number | null
  // Passage positions with at least one Wrong Keypress (each is one Missed Key)
  missedPositions: number[]
  // Wrong Keypresses, by the physical key the Passage needed
  wrongKeypresses: Record<string, number>
  // The key the learner should have pressed, at the latest Wrong Keypress
  latestWrongKeypress: { neededKey: string; at: number } | null
  // Set once the whole Passage is typed
  attempt: Attempt | null
}

export function startTest(
  passage: string,
  practiceKeys: string[] | null = null,
  level: Level = 'hard'
): Test {
  return {
    passage,
    practiceKeys,
    level,
    typedIndex: 0,
    startedAt: null,
    missedPositions: [],
    wrongKeypresses: {},
    latestWrongKeypress: null,
    attempt: null,
  }
}

// The learner pressed a key at time `now` (ms)
export function press(test: Test, key: string, now: number): Test {
  // Shift, Tab and the like type nothing, and a finished Test takes no keys
  if (test.attempt || specialKeys.includes(key)) return test
  if (key === 'Backspace') {
    if (test.typedIndex === 0) return test
    return { ...test, typedIndex: test.typedIndex - 1 }
  }

  const needed = test.passage.charAt(test.typedIndex)
  if (key !== needed) {
    const neededKey = toPhysicalKey(needed)
    const position = test.typedIndex
    return {
      ...test,
      missedPositions: test.missedPositions.includes(position)
        ? test.missedPositions
        : [...test.missedPositions, position],
      wrongKeypresses: {
        ...test.wrongKeypresses,
        [neededKey]: (test.wrongKeypresses[neededKey] ?? 0) + 1,
      },
      latestWrongKeypress: { neededKey, at: now },
    }
  }

  const typed = {
    ...test,
    typedIndex: test.typedIndex + 1,
    startedAt: test.startedAt ?? now,
  }
  if (typed.typedIndex < typed.passage.length) return typed
  return { ...typed, attempt: finish(typed, now) }
}

export const typedPortion = (test: Test) =>
  test.passage.slice(0, test.typedIndex)

export const remainingPassage = (test: Test) =>
  test.passage.slice(test.typedIndex)

function finish(test: Test, now: number): Attempt {
  const missedKeys: Record<string, number> = {}
  for (const position of test.missedPositions) {
    const key = toPhysicalKey(test.passage.charAt(position))
    missedKeys[key] = (missedKeys[key] ?? 0) + 1
  }
  return {
    wpm: calculateWPM(test.passage.length, now - (test.startedAt ?? now)),
    date: new Date(now).toISOString(),
    keys: buildKeyStats(
      countKeysNeeded(test.passage),
      missedKeys,
      test.wrongKeypresses
    ),
    ...(test.practiceKeys ? { practice: true } : { level: test.level }),
  }
}

// How many times each physical key is needed to type the passage
function countKeysNeeded(passage: string): Record<string, number> {
  const needed: Record<string, number> = {}
  for (const char of passage) {
    const key = toPhysicalKey(char)
    needed[key] = (needed[key] ?? 0) + 1
  }
  return needed
}

// Standard WPM: every five correctly typed characters count as one word
function calculateWPM(charCount: number, elapsedMs: number): number {
  const elapsedMins = elapsedMs / 60000
  if (elapsedMins <= 0) return 0
  return Math.round(charCount / 5 / elapsedMins)
}

function buildKeyStats(
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
