import { describe, expect, it } from 'vitest'
import {
  press,
  remainingPassage,
  startTest,
  Test,
  typedPortion,
} from '../../src/typingTest'

const START = Date.parse('2026-10-29T12:00:00Z')
// Presses each key one second apart, starting at START
const typeKeys = (test: Test, keys: string[], from = START) =>
  keys.reduce((t, key, i) => press(t, key, from + i * 1000), test)

describe('a Test', () => {
  it('moves the Typed Portion forward on each correct character', () => {
    const test = typeKeys(startTest('the cat'), [...'the'])
    expect(typedPortion(test)).toBe('the')
    expect(remainingPassage(test)).toBe(' cat')
    expect(test.attempt).toBeNull()
  })

  it('ends with an Attempt timed from the first correct character', () => {
    // 10 characters (2 words) over 30 seconds: 4 WPM
    const passage = 'abcde fghi'
    const test = [...passage].reduce(
      (t, key, i) => press(t, key, START + (i === 9 ? 30_000 : i * 1000)),
      startTest(passage)
    )
    expect(test.attempt).toMatchObject({
      wpm: 4,
      date: '2026-10-29T12:00:30.000Z',
    })
    expect(test.attempt).not.toHaveProperty('practice')
  })

  it('stays put on a Wrong Keypress and names the key that was needed', () => {
    const test = press(startTest('the'), 'x', START)
    expect(typedPortion(test)).toBe('')
    expect(test.latestWrongKeypress).toEqual({ neededKey: 't', at: START })
  })

  it('names the physical key, not the character', () => {
    // Shift+' types " on the Dvorak layout
    const test = press(startTest('"hi"'), 'x', START)
    expect(test.latestWrongKeypress?.neededKey).toBe("'")
  })
})

describe('a finished Test', () => {
  it('counts Missed Keys once per position and every Wrong Keypress', () => {
    // Three wrong presses before the first t, one before the second
    const test = typeKeys(startTest('tot'), [...'xxxtoxt'])
    expect(test.attempt?.keys).toEqual({
      t: { needed: 2, missed: 2, wrongKeypresses: 4 },
      o: { needed: 1, missed: 0, wrongKeypresses: 0 },
    })
  })

  it('marks a Practice Test as Practice', () => {
    const test = typeKeys(startTest('ss', ['s']), [...'ss'])
    expect(test.attempt?.practice).toBe(true)
  })
})

describe('keys that change nothing', () => {
  it('Backspace takes back the last typed character, but not past the start', () => {
    const test = typeKeys(startTest('the'), ['t', 'h', 'Backspace'])
    expect(typedPortion(test)).toBe('t')
    expect(typedPortion(typeKeys(test, ['Backspace', 'Backspace']))).toBe('')
  })

  it.each(['Shift', 'Tab', 'Enter', 'Escape', 'Meta', 'Alt', 'Control'])(
    'ignores %s',
    (key) => {
      const test = startTest('the')
      expect(press(test, key, START)).toBe(test)
    }
  )

  it('ignores keys once the Passage is finished', () => {
    const finished = typeKeys(startTest('hi'), [...'hi'])
    expect(press(finished, 'x', START + 5000)).toBe(finished)
  })
})
