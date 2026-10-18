import React, { JSX } from 'react'
import { keyLabel } from '../utils'
import './TypingDisplay.css'

interface TypingDisplayProps {
  practiceKeys: string[] | null
  typedPortion: string
  remainingPassage: string
}

function TypingDisplay({
  practiceKeys,
  typedPortion,
  remainingPassage,
}: TypingDisplayProps): JSX.Element {
  return (
    <div className="typing-display">
      {practiceKeys && (
        <div className="practice-tag">
          Practice: {practiceKeys.map(keyLabel).join(', ')}
        </div>
      )}
      <span className="typed-portion">{typedPortion}</span>
      <span className="remaining-passage">{remainingPassage}</span>
    </div>
  )
}

export default TypingDisplay
