import React, { JSX } from 'react'
import { PASSAGE_LENGTHS, PassageLength } from '../history'
import './LengthToggle.css'

interface LengthToggleProps {
  length: PassageLength
  onChange: (length: PassageLength) => void
}

function LengthToggle({ length, onChange }: LengthToggleProps): JSX.Element {
  return (
    <div className="length-toggle" role="group" aria-label="Passage length">
      {PASSAGE_LENGTHS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === length}
          onClick={(e) => {
            // Drop focus so the next Space or Enter types instead of clicking
            e.currentTarget.blur()
            if (option !== length) onChange(option)
          }}
        >
          {option}
        </button>
      ))}
      <span className="length-toggle-unit">words</span>
    </div>
  )
}

export default LengthToggle
