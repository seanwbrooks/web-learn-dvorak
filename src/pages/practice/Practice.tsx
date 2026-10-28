import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Keyboard from '../../components/Keyboard'
import TypingDisplay from '../../components/TypingDisplay'
import Performance from '../../components/Performance'
import Progress from '../../components/Progress'
import IntroModal from '../../components/IntroModal'
import Site from '../site/Site'
import {
  generatePassage,
  generatePracticePassage,
  calculateWPM,
  countKeysNeeded,
  toPhysicalKey,
} from '../../utils'
import { keyMap, specialKeys } from '../../data'
import { findWeakKeys } from '../../missRate'
import {
  Attempt,
  loadAttempts,
  loadPersonalBest,
  loadIntroSeen,
  saveIntroSeen,
  loadPassageLength,
  savePassageLength,
  PassageLength,
  savePersonalBest,
  recordAttempt,
  buildKeyStats,
} from '../../history'

function Practice() {
  const [passage, setPassage] = useState('')
  const [typedPortion, setTypedPortion] = useState('')
  const [typedIndex, setTypedIndex] = useState(0)
  const [highlightedKey, setHighlightedKey] = useState<
    keyof typeof keyMap | null
  >(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  const [personalBest, setPersonalBest] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  // Passage positions with at least one Wrong Keypress (each is one Missed Key)
  const [missedPositions, setMissedPositions] = useState<Set<number>>(new Set())
  const [wrongKeypresses, setWrongKeypresses] = useState<
    Record<string, number>
  >({})
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [introOpen, setIntroOpen] = useState(() => !loadIntroSeen())
  // The Weak Keys a Practice Test targets; null during a normal Test
  const [practiceKeys, setPracticeKeys] = useState<string[] | null>(null)
  const [passageLength, setPassageLength] = useState(loadPassageLength)

  useEffect(() => {
    setPassage(generatePassage(loadPassageLength()))
    setPersonalBest(loadPersonalBest())
    setAttempts(loadAttempts())
  }, [])

  const startTest = (newPassage: string, newPracticeKeys: string[] | null) => {
    setPassage(newPassage)
    setPracticeKeys(newPracticeKeys)
    setTypedPortion('')
    setTypedIndex(0)
    setHighlightedKey(null)
    setStartTime(null)
    setWpm(null)
    setIsComplete(false)
    setMissedPositions(new Set())
    setWrongKeypresses({})
  }

  const keyStats = useMemo(() => {
    const missedKeys: Record<string, number> = {}
    for (const position of missedPositions) {
      const key = toPhysicalKey(passage.charAt(position))
      missedKeys[key] = (missedKeys[key] ?? 0) + 1
    }
    return buildKeyStats(countKeysNeeded(passage), missedKeys, wrongKeypresses)
  }, [passage, missedPositions, wrongKeypresses])

  const weakKeys = useMemo(() => findWeakKeys(attempts), [attempts])

  const restartTest = () => startTest(generatePassage(passageLength), null)
  // Switching lengths starts a fresh Test; the abandoned one isn't recorded
  const changePassageLength = (length: PassageLength) => {
    setPassageLength(length)
    savePassageLength(length)
    startTest(generatePassage(length), null)
  }
  const startPractice = () =>
    startTest(generatePracticePassage(weakKeys, 25), weakKeys)

  const highlightKey = useCallback((key: keyof typeof keyMap) => {
    setHighlightedKey(key)
    setTimeout(() => {
      setHighlightedKey(null)
    }, 2000)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // The Test is over, or the intro is covering it
      if (isComplete || introOpen) {
        return
      }

      // A key pressed on a button (the length toggle, the nav bar's ?) works
      // that control; it isn't typing
      if (e.target instanceof Element && e.target.closest('button, a')) {
        return
      }

      // Handle backspace
      if (e.key === 'Backspace') {
        if (typedIndex === 0) {
          return
        }
        setTypedIndex((prev) => prev - 1)
        setTypedPortion((prev) => prev.slice(0, -1))
        return
      }

      // Ignore special keys
      if (specialKeys.includes(e.key)) {
        return
      }

      // Check if the key matches the expected character
      if (e.key === passage.charAt(typedIndex)) {
        const newTypedPortion = typedPortion + e.key
        const newTypedIndex = typedIndex + 1
        // Start timing on the first correct character
        const testStart = startTime ?? new Date()
        if (!startTime) {
          setStartTime(testStart)
        }

        setTypedPortion(newTypedPortion)
        setTypedIndex(newTypedIndex)

        // Check if completed
        if (newTypedIndex >= passage.length) {
          const calculatedWpm = calculateWPM(
            passage.length,
            Date.now() - testStart.getTime()
          )
          const isPractice = practiceKeys !== null
          setWpm(calculatedWpm)
          setIsComplete(true)

          if (!isPractice && (!personalBest || calculatedWpm > personalBest)) {
            setPersonalBest(calculatedWpm)
            savePersonalBest(calculatedWpm)
          }

          setAttempts((currentAttempts) =>
            recordAttempt(currentAttempts, {
              wpm: calculatedWpm,
              date: new Date().toISOString(),
              keys: keyStats,
              ...(isPractice && { practice: true }),
            })
          )
        }
      } else {
        // Highlight the correct key; count the Wrong Keypress, and the
        // position as a Missed Key the first time it goes wrong
        const keyToHit = toPhysicalKey(passage.charAt(typedIndex))
        highlightKey(keyToHit)
        setWrongKeypresses((prev) => ({
          ...prev,
          [keyToHit]: (prev[keyToHit] ?? 0) + 1,
        }))
        setMissedPositions((prev) =>
          prev.has(typedIndex) ? prev : new Set(prev).add(typedIndex)
        )
      }
    }

    window.addEventListener('keyup', handleKeyPress)
    return () => window.removeEventListener('keyup', handleKeyPress)
  }, [
    passage,
    typedPortion,
    typedIndex,
    startTime,
    highlightKey,
    personalBest,
    isComplete,
    keyStats,
    practiceKeys,
    introOpen,
  ])

  const remainingPassage = passage.substring(typedIndex)

  return (
    <Site
      current="practice"
      onHelp={() => setIntroOpen(true)}
      outside={
        <IntroModal
          open={introOpen}
          onClose={() => {
            setIntroOpen(false)
            saveIntroSeen()
          }}
        />
      }
    >
      {/* Results take the finished Passage's place, so the page fits one
         screen with the keyboard (and its Weak Keys) still in view */}
      {isComplete ? (
        <>
          <Performance
            wpm={wpm}
            personalBest={personalBest}
            isComplete={isComplete}
            isPractice={practiceKeys !== null}
            onRestart={restartTest}
            onPractice={weakKeys.length > 0 ? startPractice : null}
          />
          {practiceKeys === null && (
            <Progress attempts={attempts} personalBest={personalBest} />
          )}
        </>
      ) : (
        <TypingDisplay
          practiceKeys={practiceKeys}
          typedPortion={typedPortion}
          remainingPassage={remainingPassage}
          passageLength={passageLength}
          onPassageLength={changePassageLength}
        />
      )}

      <Keyboard highlightedKey={highlightedKey} weakKeys={weakKeys} />
    </Site>
  )
}

export default Practice
