import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Keyboard from './components/Keyboard'
import TypingDisplay from './components/TypingDisplay'
import Performance from './components/Performance'
import Progress from './components/Progress'
import {
  generateDisplayWords,
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
  const [displayWords, setDisplayWords] = useState('')
  const [goodWords, setGoodWords] = useState('')
  const [goodIndex, setGoodIndex] = useState(0)
  const [highlightedKey, setHighlightedKey] = useState<
    keyof typeof keyMap | null
  >(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [missedKeys, setMissedKeys] = useState<Record<string, number>>({})
  const [attempts, setAttempts] = useState<Attempt[]>([])

  useEffect(() => {
    setDisplayWords(generateDisplayWords(50))
    setBestScore(loadPersonalBest())
    setAttempts(loadAttempts())
  }, [])

  const restartGame = () => {
    setDisplayWords(generateDisplayWords(50))
    setGoodWords('')
    setGoodIndex(0)
    setHighlightedKey(null)
    setStartTime(null)
    setWpm(null)
    setIsComplete(false)
    setMissedKeys({})
  }

  const keyStats = useMemo(
    () => buildKeyStats(countKeysNeeded(displayWords), missedKeys),
    [displayWords, missedKeys]
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
        if (goodIndex === 0) {
          return
        }
        setGoodIndex((prev) => prev - 1)
        setGoodWords((prev) => prev.slice(0, -1))
        return
      }

      // Ignore special keys
      if (specialKeys.includes(e.key)) {
        return
      }

      // Check if the key matches the expected character
      if (e.key === displayWords.charAt(goodIndex)) {
        const newGoodWords = goodWords + e.key
        const newGoodIndex = goodIndex + 1
        // Start timing on the first correct character
        const testStart = startTime ?? new Date()
        if (!startTime) {
          setStartTime(testStart)
        }

        setGoodWords(newGoodWords)
        setGoodIndex(newGoodIndex)

        // Check if completed
        if (newGoodIndex >= displayWords.length) {
          const calculatedWpm = calculateWPM(
            displayWords.length,
            Date.now() - testStart.getTime()
          )
          setWpm(calculatedWpm)
          setIsComplete(true)

          if (!bestScore || calculatedWpm > bestScore) {
            setBestScore(calculatedWpm)
            savePersonalBest(calculatedWpm)
          }

          setAttempts(
            recordAttempt({
              wpm: calculatedWpm,
              date: new Date().toISOString(),
              keys: keyStats,
            })
          )
        }
      } else {
        // Highlight the correct key and count it as a Missed Key
        const keyToHit = toPhysicalKey(displayWords.charAt(goodIndex))
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
    displayWords,
    goodWords,
    goodIndex,
    startTime,
    highlightKey,
    bestScore,
    isComplete,
    keyStats,
  ])

  const remainingWords = displayWords.substring(goodIndex)

  return (
    <div className="app">
      <div className="title">
        <h1>Learn Dvorak</h1>
      </div>

      <Keyboard highlightedKey={highlightedKey} weakKeys={weakKeys} />

      <TypingDisplay goodWords={goodWords} displayWords={remainingWords} />

      <Performance
        wpm={wpm}
        bestScore={bestScore}
        badKeys={keyStats}
        isComplete={isComplete}
        onRestart={restartGame}
      />

      {isComplete && <Progress attempts={attempts} personalBest={bestScore} />}
    </div>
  )
}

export default App
