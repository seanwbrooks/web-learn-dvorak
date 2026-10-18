import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Keyboard from './components/Keyboard'
import TypingDisplay from './components/TypingDisplay'
import Performance from './components/Performance'
import Progress from './components/Progress'
import {
  generatePassage,
  calculateWPM,
  countKeysNeeded,
  toPhysicalKey,
} from './utils'
import { keyMap, specialKeys } from './data'
import { findWeakKeys } from './missRate'
import {
  Attempt,
  loadAttempts,
  loadPersonalBest,
  savePersonalBest,
  recordAttempt,
  buildKeyStats,
} from './history'
import './App.css'

function App() {
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
  const [missedKeys, setMissedKeys] = useState<Record<string, number>>({})
  const [attempts, setAttempts] = useState<Attempt[]>([])

  useEffect(() => {
    setPassage(generatePassage(50))
    setPersonalBest(loadPersonalBest())
    setAttempts(loadAttempts())
  }, [])

  const restartTest = () => {
    setPassage(generatePassage(50))
    setTypedPortion('')
    setTypedIndex(0)
    setHighlightedKey(null)
    setStartTime(null)
    setWpm(null)
    setIsComplete(false)
    setMissedKeys({})
  }

  const keyStats = useMemo(
    () => buildKeyStats(countKeysNeeded(passage), missedKeys),
    [passage, missedKeys]
  )

  const weakKeys = useMemo(() => findWeakKeys(attempts), [attempts])

  const highlightKey = useCallback((key: keyof typeof keyMap) => {
    setHighlightedKey(key)
    setTimeout(() => {
      setHighlightedKey(null)
    }, 2000)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // The Test is over; only restarting starts a new one
      if (isComplete) {
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
          setWpm(calculatedWpm)
          setIsComplete(true)

          if (!personalBest || calculatedWpm > personalBest) {
            setPersonalBest(calculatedWpm)
            savePersonalBest(calculatedWpm)
          }

          setAttempts((currentAttempts) =>
            recordAttempt(currentAttempts, {
              wpm: calculatedWpm,
              date: new Date().toISOString(),
              keys: keyStats,
            })
          )
        }
      } else {
        // Highlight the correct key and count it as a Missed Key
        const keyToHit = toPhysicalKey(passage.charAt(typedIndex))
        highlightKey(keyToHit)
        setMissedKeys((prev) => ({
          ...prev,
          [keyToHit]: (prev[keyToHit] ?? 0) + 1,
        }))
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
  ])

  const remainingPassage = passage.substring(typedIndex)

  return (
    <div className="app">
      <div className="title">
        <h1>Learn Dvorak</h1>
      </div>

      <Keyboard highlightedKey={highlightedKey} weakKeys={weakKeys} />

      <TypingDisplay
        typedPortion={typedPortion}
        remainingPassage={remainingPassage}
      />

      <Performance
        wpm={wpm}
        personalBest={personalBest}
        keyStats={keyStats}
        isComplete={isComplete}
        onRestart={restartTest}
      />

      {isComplete && (
        <Progress attempts={attempts} personalBest={personalBest} />
      )}
    </div>
  )
}

export default App
