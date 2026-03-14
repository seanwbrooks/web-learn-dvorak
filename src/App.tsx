import React, { useState, useEffect, useCallback } from 'react'
import Keyboard from './components/Keyboard'
import TypingDisplay from './components/TypingDisplay'
import Performance from './components/Performance'
import { generateDisplayWords } from './utils'
import { keyMap, specialKeys, badKeys } from './data'
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
  const [started, setStarted] = useState(false)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [scoreBadKeys, setBadKeys] = useState(badKeys)

  useEffect(() => {
    setDisplayWords(generateDisplayWords(50))
    // Load best score from localStorage
    const savedBestScore = window.localStorage.getItem('dvorakBestWPM')
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10))
    }
  }, [])

  const restartGame = () => {
    setDisplayWords(generateDisplayWords(50))
    setGoodWords('')
    setGoodIndex(0)
    setHighlightedKey(null)
    setStartTime(null)
    setWpm(null)
    setStarted(false)
    setIsComplete(false)
    setBadKeys(badKeys)
  }

  const highlightKey = useCallback((key: keyof typeof keyMap) => {
    setHighlightedKey(key)
    setTimeout(() => {
      setHighlightedKey(null)
    }, 2000)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Start timing on first key press
      if (!started) {
        const start = new Date()
        setStartTime(start)
        setStarted(true)
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

        setGoodWords(newGoodWords)
        setGoodIndex(newGoodIndex)

        // Check if completed
        if (newGoodIndex >= displayWords.length) {
          const endTime = new Date()
          const elapsedTimeInMins =
            (endTime.getTime() - startTime!.getTime()) / 60000
          const calculatedWpm = Math.round(50 / elapsedTimeInMins)
          setWpm(calculatedWpm)
          setIsComplete(true)

          // Update best score if this is better
          if (!bestScore || calculatedWpm > bestScore) {
            setBestScore(calculatedWpm)
            window.localStorage.setItem(
              'dvorakBestWPM',
              calculatedWpm.toString()
            )
          }

          // Store this attempt in history
          const history = JSON.parse(
            window.localStorage.getItem('dvorakHistory') || '[]'
          )
          history.push({
            wpm: calculatedWpm,
            date: new Date().toISOString(),
          })
          // Keep only last 10 attempts
          if (history.length > 10) {
            history.shift()
          }
        }
      } else {
        // Highlight the correct key
        let keyToHit = displayWords.charAt(goodIndex).toLowerCase()
        // eslint-disable-next-line no-prototype-builtins
        if (keyMap.hasOwnProperty(keyToHit)) {
          keyToHit = keyMap[keyToHit]
        }
        highlightKey(keyToHit)
        // eslint-disable-next-line no-prototype-builtins
        if (scoreBadKeys.hasOwnProperty(keyToHit)) {
          scoreBadKeys[keyToHit] += 1
        } else {
          scoreBadKeys[keyToHit] = 1
        }
        setBadKeys({ 
            [keyToHit]: scoreBadKeys[keyToHit],
            ...scoreBadKeys 
        })
      }
    }

    window.addEventListener('keyup', handleKeyPress)
    return () => window.removeEventListener('keyup', handleKeyPress)
  }, [
    displayWords,
    goodWords,
    goodIndex,
    started,
    startTime,
    highlightKey,
    bestScore,
    badKeys,
    setBadKeys,
  ])

  const remainingWords = displayWords.substring(goodIndex)

  return (
    <div className="app">
      <div className="title">
        <h1>Learn Dvorak</h1>
      </div>

      <Keyboard highlightedKey={highlightedKey} />

      <TypingDisplay goodWords={goodWords} displayWords={remainingWords} />

      <Performance
        wpm={wpm}
        bestScore={bestScore}
        badKeys={badKeys}
        isComplete={isComplete}
        onRestart={restartGame}
      />
    </div>
  )
}

export default App
