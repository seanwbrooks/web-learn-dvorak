import words from './words-full.json'
import { toPhysicalKey } from './keyboard'
import { Level } from './learnerHistory'

const HOME_ROW_WORDS = words.filter((word) => /^[aoeuidhtns]+$/.test(word))

const pickWords = (pool: string[], wordCount: number) =>
  Array.from(
    { length: wordCount },
    () => pool[Math.floor(Math.random() * pool.length)]
  ).join(' ')

export function generatePassage(wordCount = 50, level: Level = 'hard') {
  if (level === 'easy') return pickWords(HOME_ROW_WORDS, wordCount)
  if (level === 'medium') return pickWords(words, wordCount)

  let passage = ''

  // Count only space-terminated words, so punctuation (which attaches to the
  // next word) can't take the last word's place
  while (passage.split(' ').length <= wordCount) {
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
