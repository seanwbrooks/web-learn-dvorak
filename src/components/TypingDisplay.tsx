import React, { JSX } from 'react'
import './TypingDisplay.css'

interface TypingDisplayProps {
  typedPortion: string
  remainingPassage: string
}

function TypingDisplay({
  typedPortion,
  remainingPassage,
}: TypingDisplayProps): JSX.Element {
  return (
    <div className="typing-display">
      <span className="typed-portion">{typedPortion}</span>
      <span className="remaining-passage">{remainingPassage}</span>
    </div>
  )
}

export default TypingDisplay
