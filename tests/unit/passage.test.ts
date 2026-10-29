import { describe, expect, it } from 'vitest'
import { generatePassage, generatePracticePassage } from '../../src/passage'

// The generator is random, so each property is checked over many Passages
const many = <T>(make: () => T, runs = 500) =>
  Array.from({ length: runs }, make)
const lastWord = (passage: string) => passage.split(' ').slice(-1)[0]
const allWords = (passages: string[]) =>
  passages.reduce<string[]>(
    (all, passage) => all.concat(passage.split(' ')),
    []
  )

describe('generatePassage', () => {
  it.each([25, 50])('has exactly %i words', (length) => {
    const lengths = many(() => generatePassage(length).split(' ').length)
    expect(new Set(lengths)).toEqual(new Set([length]))
  })

  it('ends on a word or number, never on punctuation alone', () => {
    const endings = many(() => lastWord(generatePassage(50)))
    expect(endings.filter((word) => !/[a-z0-9]/i.test(word))).toEqual([])
  })
})

describe('generatePracticePassage', () => {
  // Q and J are rare in English, so a normal Passage seldom needs them
  const weakKeys = ['q', 'j']
  const shareNeedingWeakKey = (passages: string[]) => {
    const words = allWords(passages)
    return words.filter((word) => /[qj]/i.test(word)).length / words.length
  }

  it('has exactly 25 words', () => {
    const lengths = many(
      () => generatePracticePassage(weakKeys).split(' ').length
    )
    expect(new Set(lengths)).toEqual(new Set([25]))
  })

  it('makes most words need a Weak Key', () => {
    const practice = many(() => generatePracticePassage(weakKeys), 200)
    expect(shareNeedingWeakKey(practice)).toBeGreaterThan(0.5)
  })

  it('falls back to ordinary words when no word needs a Weak Key', () => {
    // A Weak Key no word or symbol needs leaves nothing to favour
    const passages = many(() => generatePracticePassage(['not-a-key']), 100)
    const words = allWords(passages)
    const timesUsed: Record<string, number> = {}
    for (const word of words) timesUsed[word] = (timesUsed[word] ?? 0) + 1

    expect(words).toHaveLength(100 * 25)
    // A random mix from 10,000 words: no word makes up 5% of them
    expect(Math.max(...Object.values(timesUsed))).toBeLessThan(
      words.length / 20
    )
  })
})
