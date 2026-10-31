import React, { JSX } from 'react'
import { keyLabel } from '../keyboard'
import {
  LEVELS,
  Level,
  PASSAGE_LENGTHS,
  PassageLength,
  levelLabel,
} from '../learnerHistory'
import Toggle from './Toggle'
import './TypingDisplay.css'

interface TypingDisplayProps {
  practiceKeys: string[] | null
  typedPortion: string
  remainingPassage: string
  passageLength: PassageLength
  onPassageLength: (length: PassageLength) => void
  level: Level
  onLevel: (level: Level) => void
}

function TypingDisplay({
  practiceKeys,
  typedPortion,
  remainingPassage,
  passageLength,
  onPassageLength,
  level,
  onLevel,
}: TypingDisplayProps): JSX.Element {
  return (
    <div className="typing-display">
      {/* Practice Passages are always 25 words and have no Level, so they
         have no toggles */}
      {practiceKeys ? (
        <div className="practice-tag">
          Practice: {practiceKeys.map(keyLabel).join(', ')}
        </div>
      ) : (
        <div className="passage-options">
          <Toggle
            label="Level"
            options={LEVELS}
            selected={level}
            onChange={onLevel}
            optionLabel={levelLabel}
          />
          <Toggle
            label="Passage length"
            options={PASSAGE_LENGTHS}
            selected={passageLength}
            onChange={onPassageLength}
            unit="words"
          />
        </div>
      )}
      <span className="typed-portion">{typedPortion}</span>
      <span className="remaining-passage">{remainingPassage}</span>
    </div>
  )
}

export default TypingDisplay
