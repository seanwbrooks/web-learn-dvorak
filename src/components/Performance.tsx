import React, { JSX } from 'react'
import { KeyStats } from '../history'
import { rankByMissRate } from '../missRate'
import './Performance.css'

// A key must come up this often in the Passage before its Miss Rate is ranked
const MIN_NEEDED = 3

const keyLabel = (key: string) => (key === ' ' ? 'Space' : key.toUpperCase())

interface PerformanceProps {
  wpm: number | null
  bestScore: number | null
  badKeys: Record<string, KeyStats>
  isComplete: boolean
  onRestart: () => void
}

function Performance({
  wpm,
  bestScore,
  badKeys,
  isComplete,
  onRestart,
}: PerformanceProps): JSX.Element | null {
  if (wpm === null) return null

  const missedKeys = rankByMissRate(badKeys, {
    minNeeded: MIN_NEEDED,
    limit: 5,
  })

  const getColor = () => {
    if (wpm >= 60) return 'green'
    if (wpm >= 40) return 'orange'
    return 'red'
  }

  const getMotivationalMessage = () => {
    if (!bestScore || wpm > bestScore) {
      return '🎉 New Personal Best!'
    }
    const diff = bestScore - wpm
    if (diff === 0) {
      return '🔥 Tied your best score!'
    }
    if (diff <= 5) {
      return `💪 Almost there! Just ${diff} WPM to beat your best!`
    }
    if (diff <= 10) {
      return `⚡ Getting close! ${diff} WPM away from your best!`
    }
    return `🎯 Your best is ${bestScore} WPM - Keep practicing!`
  }

  return (
    <div className="performance">
      <div className="wpm" style={{ color: getColor() }}>
        {wpm} wpm
      </div>

      {bestScore && <div className="best-score">Best: {bestScore} WPM</div>}

      {isComplete && (
        <div className="completion-message">
          <div className="motivational-message">{getMotivationalMessage()}</div>
          <button className="restart-button" onClick={onRestart}>
            Try Again
          </button>
        </div>
      )}
      {missedKeys.length > 0 && (
        <div className="bad-keys">
          <h3>Keys to Practice:</h3>
          <ul>
            {missedKeys.map(({ key, missed, needed, missRate }) => (
              <li key={key}>
                {keyLabel(key)} {missed} of {needed} missed (
                {Math.round(missRate * 100)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Performance
