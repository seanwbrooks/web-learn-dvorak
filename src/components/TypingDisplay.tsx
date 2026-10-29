import React, { JSX } from 'react'
import { keyLabel } from '../keyboard'
import { PassageLength } from '../learnerHistory'
import LengthToggle from './LengthToggle'
import './TypingDisplay.css'

interface TypingDisplayProps {
  practiceKeys: string[] | null
  typedPortion: string
  remainingPassage: string
  passageLength: PassageLength
  onPassageLength: (length: PassageLength) => void
}

function TypingDisplay({
  practiceKeys,
  typedPortion,
  remainingPassage,
  passageLength,
  onPassageLength,
}: TypingDisplayProps): JSX.Element {
  return (
    <div className="typing-display">
      {/* Practice Passages are always 25 words, so they have no toggle */}
      {practiceKeys ? (
        <div className="practice-tag">
          Practice: {practiceKeys.map(keyLabel).join(', ')}
        </div>
      ) : (
        <LengthToggle length={passageLength} onChange={onPassageLength} />
      )}
      <span className="typed-portion">{typedPortion}</span>
      <span className="remaining-passage">{remainingPassage}</span>
    </div>
  )
}

export default TypingDisplay
