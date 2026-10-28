import React, { JSX, useEffect, useRef } from 'react'
import '../pages/site/Button.css'
import './IntroModal.css'

interface IntroModalProps {
  open: boolean
  onClose: () => void
}

// How to play. Shown on a first visit and from the
// nav bar's "How to play" button; a native <dialog> handles focus, Escape and the backdrop.
function IntroModal({ open, onClose }: IntroModalProps): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // showModal focuses the first control (Close); start on the main action
      startRef.current?.focus({ preventScroll: true })
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="intro"
      aria-labelledby="intro-title"
      onClose={onClose}
      // A click on the dialog itself, not its content, is on the backdrop
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="intro-content">
        <button
          type="button"
          className="intro-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <h2 id="intro-title">Welcome to Learn Dvorak</h2>

        <section>
          <h3>How to play</h3>
          <ol className="intro-steps">
            <li>
              <strong>Switch your keyboard to Dvorak.</strong> On a Mac, add the
              Dvorak input source in System Settings › Keyboard; on Windows, add
              the United States-Dvorak keyboard in Settings › Time &amp;
              language.
            </li>
            <li>
              <strong>Type the Passage.</strong> The clock starts at your first
              correct character. A wrong key doesn&apos;t move you forward, so
              type the right one to continue.
            </li>
            <li>
              <strong>Learn from the keyboard.</strong> After a wrong key, the
              key you needed lights up. Key colors show which finger to use:
              yellow for pinkies, orange for ring fingers, red for middle
              fingers, dark red and purple for index fingers.
            </li>
            <li>
              <strong>Check your speed.</strong> Finish the Passage to see your
              WPM and Personal Best. Every five characters count as one word.
            </li>
            <li>
              <strong>Practice your Weak Keys.</strong> Keys you often miss get
              a red dot. Practice Weak Keys gives you a short Test built around
              them, and it doesn&apos;t affect your Personal Best.
            </li>
          </ol>
        </section>

        <p className="intro-note">
          Your results stay in this browser; nothing is sent anywhere.
        </p>

        <button
          type="button"
          className="restart-button intro-start"
          ref={startRef}
          onClick={onClose}
        >
          Start typing
        </button>
      </div>
    </dialog>
  )
}

export default IntroModal
