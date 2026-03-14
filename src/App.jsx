import React, { useState, useEffect, useCallback } from 'react'
import Keyboard from './components/Keyboard'
import TypingDisplay from './components/TypingDisplay'
import Performance from './components/Performance'
import { generateDisplayWords, calculateWPM } from './utils'
import { keyMap, specialKeys } from './data'
import './App.css'

function App() {
    const [displayWords, setDisplayWords] = useState('')
    const [goodWords, setGoodWords] = useState('')
    const [goodIndex, setGoodIndex] = useState(0)
    const [highlightedKey, setHighlightedKey] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [wpm, setWpm] = useState(null)
    const [started, setStarted] = useState(false)
    const [bestScore, setBestScore] = useState(null)
    const [isComplete, setIsComplete] = useState(false)
    const [badKeys, setBadKeys] = useState({
        '`': 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        0: 0,
        '[': 0,
        ']': 0,
        "\'": 0,
        ',': 0,
        '.': 0,
        p: 0,
        y: 0,
        f: 0,
        g: 0,
        c: 0,
        r: 0,
        l: 0,
        '/': 0,
        '=': 0,
        '\\': 0,
        a: 0,
        o: 0,
        e: 0,
        u: 0,
        i: 0,
        d: 0,
        h: 0,
        t: 0,
        n: 0,
        s: 0,
        '-': 0,
        ':': 0,
        q: 0,
        j: 0,
        k: 0,
        x: 0,
        b: 0,
        m: 0,
        w: 0,
        v: 0,
        z: 0,
    })

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
        setBadKeys({
            '`': 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            0: 0,
            '[': 0,
            ']': 0,
            "\'": 0,
            ',': 0,
            '.': 0,
            p: 0,
            y: 0,
            f: 0,
            g: 0,
            c: 0,
            r: 0,
            l: 0,
            '/': 0,
            '=': 0,
            '\\': 0,
            a: 0,
            o: 0,
            e: 0,
            u: 0,
            i: 0,
            d: 0,
            h: 0,
            t: 0,
            n: 0,
            s: 0,
            '-': 0,
            ':': 0,
            q: 0,
            j: 0,
            k: 0,
            x: 0,
            b: 0,
            m: 0,
            w: 0,
            v: 0,
            z: 0,
        })
    }

    const highlightKey = useCallback((key) => {
        setHighlightedKey(key)
        setTimeout(() => {
            setHighlightedKey(null)
        }, 2000)
    }, [])

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Start timing on first key press
            if (!started) {
                setStartTime(Date.now())
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
                    const endTime = Date.now()
                    const elapsedTimeInMins = (endTime - startTime) / 60000
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
                if (keyMap.hasOwnProperty(keyToHit)) {
                    keyToHit = keyMap[keyToHit]
                }
                highlightKey(keyToHit)
                setBadKeys((prev) => ({
                    ...prev,
                    [keyToHit]: (prev[keyToHit] || 0) + 1,
                }))
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
    ])

    const remainingWords = displayWords.substring(goodIndex)

    return (
        <div className="app">
            <div className="title">
                <h1>Learn Dvorak</h1>
            </div>

            <Keyboard highlightedKey={highlightedKey} />

            <TypingDisplay
                goodWords={goodWords}
                displayWords={remainingWords}
            />

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
