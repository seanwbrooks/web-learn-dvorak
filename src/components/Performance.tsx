import React, { JSX } from 'react'
import { KeyStats } from '../history'
import { rankByMissRate } from '../missRate'
import { keyLabel } from '../utils'
import './Performance.css'

// A key must come up this often in the Passage before its Miss Rate is ranked
const MIN_NEEDED = 3

interface PerformanceProps {
  wpm: number | null
  personalBest: number | null
  keyStats: Record<string, KeyStats>
  isComplete: boolean
  isPractice: boolean
  graduatedKeys: string[]
  onRestart: () => void
  // Starts a Practice Test; null when the learner has no Weak Keys
  onPractice: (() => void) | null
}

function Performance({
  wpm,
  personalBest,
  keyStats,
  isComplete,
  isPractice,
  graduatedKeys,
  onRestart,
  onPractice,
}: PerformanceProps): JSX.Element | null {
  if (wpm === null) return null

  const missedKeys = rankByMissRate(keyStats, {
    minNeeded: MIN_NEEDED,
    limit: 5,
  })

  const getColor = () => {
    if (wpm >= 60) return 'green'
    if (wpm >= 40) return 'orange'
    return 'red'
  }

  const getMotivationalMessage = () => {
    if (!personalBest || wpm > personalBest) {
      return '🎉 New Personal Best!'
    }
    const diff = personalBest - wpm
    if (diff === 0) {
      return '🔥 Tied your best score!'
    }
    if (diff <= 5) {
      return `💪 Almost there! Just ${diff} WPM to beat your best!`
    }
    if (diff <= 10) {
      return `⚡ Getting close! ${diff} WPM away from your best!`
    }
    return `🎯 Your best is ${personalBest} WPM - Keep practicing!`
  }

  return (
    <div className="performance">
      <div className="wpm" style={{ color: getColor() }}>
        {isPractice && 'Practice: '}
        {wpm} wpm
      </div>

      {personalBest && !isPractice && (
        <div className="personal-best">Personal Best: {personalBest} WPM</div>
      )}

      {graduatedKeys.length > 0 && (
        <ul className="graduated-keys">
          {graduatedKeys.map((key) => (
            <li key={key}>✅ {keyLabel(key)} is no longer a Weak Key</li>
          ))}
        </ul>
      )}

      {isComplete && (
        <div className="completion-message">
          {!isPractice && (
            <div className="motivational-message">
              {getMotivationalMessage()}
            </div>
          )}
          <div className="completion-buttons">
            {isPractice ? (
              <>
                {onPractice && (
                  <button className="restart-button" onClick={onPractice}>
                    Practice Again
                  </button>
                )}
                <button
                  className="restart-button secondary-button"
                  onClick={onRestart}
                >
                  Back to Test
                </button>
              </>
            ) : (
              <>
                <button className="restart-button" onClick={onRestart}>
                  Try Again
                </button>
                {onPractice && (
                  <button
                    className="restart-button secondary-button"
                    onClick={onPractice}
                  >
                    Practice Weak Keys
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {missedKeys.length > 0 && (
        <div className="missed-keys">
          <h3>Missed Keys:</h3>
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
