import React, { JSX } from 'react'
import './Performance.css'

interface PerformanceProps {
  wpm: number | null
  personalBest: number | null
  isComplete: boolean
  isPractice: boolean
  onRestart: () => void
  // Starts a Practice Test; null when the learner has no Weak Keys
  onPractice: (() => void) | null
}

function Performance({
  wpm,
  personalBest,
  isComplete,
  isPractice,
  onRestart,
  onPractice,
}: PerformanceProps): JSX.Element | null {
  if (wpm === null) return null

  const getColor = () => {
    if (wpm >= 60) return 'var(--wpm-fast)'
    if (wpm >= 40) return 'var(--wpm-steady)'
    return 'var(--wpm-slow)'
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

      {isComplete && (
        <div className="completion-message">
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
    </div>
  )
}

export default Performance
