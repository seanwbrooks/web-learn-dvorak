import React, { JSX } from 'react'
import Dialog from './Dialog'

interface KeyboardWarningProps {
  open: boolean
  onClose: () => void
}

// Shown on a phone or tablet: a Test is touch typed on a physical keyboard.
// It can be dismissed, for a tablet with a keyboard attached.
function KeyboardWarning({ open, onClose }: KeyboardWarningProps): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Learn Dvorak needs a keyboard"
      action="Continue anyway"
      className="keyboard-warning"
    >
      <p>
        You learn Dvorak by touch typing on a physical keyboard, so the typing
        practice doesn&apos;t work with an on-screen keyboard. Open
        learndvorak.com on a computer to practice.
      </p>
      <p>If you&apos;ve connected a keyboard, you can continue.</p>
    </Dialog>
  )
}

export default KeyboardWarning
