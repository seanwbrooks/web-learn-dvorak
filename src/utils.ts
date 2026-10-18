import { words, keyMap } from './data'

export function generateDisplayWords(wordCount = 50) {
  let displayWords = ''

  while (displayWords.split(' ').length < wordCount) {
    const wordNumOrPunc = Math.random()

    if (wordNumOrPunc < 0.08) {
      const num = getRandomNumber()
      displayWords += num.toString() + ' '
    } else if (wordNumOrPunc >= 0.08 && wordNumOrPunc < 0.16) {
      const punc = getRandomPunctuation()
      displayWords += punc
    } else if (wordNumOrPunc >= 0.16) {
      const index = Math.floor(Math.random() * words.length)
      displayWords += words[index] + ' '
    }
  }

  return displayWords.trim()
}

function getRandomNumber() {
  return Math.floor(Math.random() * 100)
}

function getRandomPunctuation() {
  const punctuation = "~`!@#$%^&*(){}[]/?=+|'-_,.;:"
  const randomIndex = Math.floor(Math.random() * punctuation.length)
  return punctuation.charAt(randomIndex)
}

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
