import React, { JSX } from 'react'
import { keyboardLayout, KeyDef, ROW_UNITS } from '../data'
import { keyLabel } from '../utils'
import './Keyboard.css'

// Each row is a grid of quarter-unit columns, so any width that is a
// multiple of 0.25u lines up exactly across rows.
const COLUMNS_PER_UNIT = 4

const keyUnits = (key: KeyDef): number => key.width ?? 1
const toColumns = (units: number): number => units * COLUMNS_PER_UNIT

interface KeyboardProps {
  highlightedKey: string | number | null
  weakKeys: string[]
}

function Keyboard({ highlightedKey, weakKeys }: KeyboardProps): JSX.Element {
  return (
    <div className="keyboard">
      {keyboardLayout.map((row, rowIndex) => {
        const rowUnits = row.reduce((sum, key) => sum + keyUnits(key), 0)
        // Centre rows narrower than a full row, e.g. the space bar.
        const offset = (ROW_UNITS - rowUnits) / 2
        return (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key, keyIndex) => (
              <div
                key={key.id}
                className={`cell ${highlightedKey === key.id ? 'highlight' : ''} ${weakKeys.includes(key.id) ? 'weak' : ''}`}
                style={{
                  backgroundColor: key.color,
                  gridColumn: `${keyIndex === 0 ? toColumns(offset) + 1 : 'auto'} / span ${toColumns(keyUnits(key))}`,
                }}
              >
                {key.compact ? (
                  <>
                    <span className="key-full">{key.display}</span>
                    <span className="key-compact">{key.compact}</span>
                  </>
                ) : (
                  key.display
                )}
                {key.shift && <span className="key-shift">{key.shift}</span>}
              </div>
            ))}
          </div>
        )
      })}
      {weakKeys.length > 0 && (
        <div className="weak-key-legend">
          <span className="weak-key-dot" aria-hidden="true" />
          <span>
            Weak Key (high Miss Rate over your last 10 Attempts):{' '}
            {weakKeys.map(keyLabel).join(', ')}
          </span>
        </div>
      )}
    </div>
  )
}

export default Keyboard
