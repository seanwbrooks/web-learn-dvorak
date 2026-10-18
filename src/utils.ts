import { words, keyMap } from './data'

export function generatePassage(wordCount = 50) {
  let passage = ''

  while (passage.split(' ').length < wordCount) {
    const wordNumOrPunc = Math.random()

    if (wordNumOrPunc < 0.08) {
      const num = getRandomNumber()
      passage += num.toString() + ' '
    } else if (wordNumOrPunc >= 0.08 && wordNumOrPunc < 0.16) {
      const punc = getRandomPunctuation()
      passage += punc
    } else if (wordNumOrPunc >= 0.16) {
      const index = Math.floor(Math.random() * words.length)
      passage += words[index] + ' '
    }
  }

  return passage.trim()
}

// Share of a Practice Passage drawn from Weak Key material
const PRACTICE_WEIGHT = 0.7

// A Practice Passage: like a normal Passage, but most words contain a Weak Key
// letter, and Weak number/punctuation keys turn up more often
export function generatePracticePassage(weakKeys: string[], wordCount = 25) {
  const weak = new Set(weakKeys)
  const hitsWeakKey = (text: string) =>
    [...text].some((char) => weak.has(toPhysicalKey(char)))
  const weakWords = words.filter(hitsWeakKey)
  const weakSymbols = [...('0123456789' + PUNCTUATION)].filter(hitsWeakKey)
  const symbolShare = weakSymbols.length > 0 ? 0.3 : 0.16
  const pick = <T>(items: T[]) =>
    items[Math.floor(Math.random() * items.length)]
  const favourWeak = () => Math.random() < PRACTICE_WEIGHT

  let passage = ''
  while (passage.split(' ').length <= wordCount) {
    if (Math.random() < symbolShare) {
      const symbol =
        weakSymbols.length > 0 && favourWeak()
          ? pick(weakSymbols)
          : Math.random() < 0.5
            ? getRandomNumber().toString()
            : getRandomPunctuation()
      // Numbers stand alone; punctuation attaches to the next word
      passage += /[0-9]/.test(symbol) ? symbol + ' ' : symbol
    } else {
      const word =
        weakWords.length > 0 && favourWeak() ? pick(weakWords) : pick(words)
      passage += word + ' '
    }
  }

  return passage.trim()
}

function getRandomNumber() {
  return Math.floor(Math.random() * 100)
}

const PUNCTUATION = "~`!@#$%^&*(){}[]/?=+|'-_,.;:"

function getRandomPunctuation() {
  const randomIndex = Math.floor(Math.random() * PUNCTUATION.length)
  return PUNCTUATION.charAt(randomIndex)
}

// How a physical key is named to the learner
export const keyLabel = (key: string) =>
  key === ' ' ? 'Space' : key.toUpperCase()

// The physical Dvorak key that produces a character, e.g. 'A' -> 'a', '"' -> "'"
export function toPhysicalKey(char: string): string {
  const lower = char.toLowerCase()
  return keyMap[lower] ?? lower
}

// How many times each physical key is needed to type the passage
export function countKeysNeeded(passage: string): Record<string, number> {
  const needed: Record<string, number> = {}
  for (const char of passage) {
    const key = toPhysicalKey(char)
    needed[key] = (needed[key] ?? 0) + 1
  }
  return needed
}

// Standard WPM: every five correctly typed characters count as one word
export function calculateWPM(charCount: number, elapsedMs: number): number {
  const elapsedMins = elapsedMs / 60000
  if (elapsedMins <= 0) return 0
  return Math.round(charCount / 5 / elapsedMins)
}
