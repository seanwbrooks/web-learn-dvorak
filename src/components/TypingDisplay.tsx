import React, { JSX } from 'react'
import './TypingDisplay.css'

interface TypingDisplayProps {
  goodWords: string
  displayWords: string
}

function TypingDisplay({
  goodWords,
  displayWords,
}: TypingDisplayProps): JSX.Element {
  return (
    <div className="typing-display">
      <span className="good-words">{goodWords}</span>
      <span className="display-words">{displayWords}</span>
    </div>
  )
}

export default TypingDisplay
