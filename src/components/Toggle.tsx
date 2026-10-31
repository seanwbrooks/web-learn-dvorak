import React, { JSX } from 'react'
import './Toggle.css'

interface ToggleProps<T> {
  label: string
  options: readonly T[]
  selected: T
  onChange: (option: T) => void
  optionLabel?: (option: T) => string
  unit?: string
}

function Toggle<T extends string | number>({
  label,
  options,
  selected,
  onChange,
  optionLabel = String,
  unit,
}: ToggleProps<T>): JSX.Element {
  return (
    <div className="toggle" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === selected}
          onClick={(e) => {
            // Drop focus so the next Space types instead of clicking again
            e.currentTarget.blur()
            if (option !== selected) onChange(option)
          }}
        >
          {optionLabel(option)}
        </button>
      ))}
      {unit && <span className="toggle-unit">{unit}</span>}
    </div>
  )
}

export default Toggle
