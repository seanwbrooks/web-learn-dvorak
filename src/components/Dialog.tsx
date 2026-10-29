import React, { JSX, ReactNode, useEffect, useRef } from 'react'
import './Button.css'
import './Dialog.css'

interface DialogProps {
  open: boolean
  onClose: () => void
  // Also the dialog's accessible name
  title: string
  // The button that closes the dialog, and takes focus when it opens
  action: string
  // Names the dialog's own styles, and the title's id
  className: string
  children: ReactNode
}

// A modal over the page; a native <dialog> handles focus, Escape and the backdrop
function Dialog({
  open,
  onClose,
  title,
  action,
  className,
  children,
}: DialogProps): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const actionRef = useRef<HTMLButtonElement>(null)
  const titleId = `${className}-title`

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // showModal focuses the first control (Close); start on the main action
      actionRef.current?.focus({ preventScroll: true })
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={`dialog ${className}`}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the dialog itself, not its content, is on the backdrop
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dialog-content">
        <button
          type="button"
          className="dialog-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <h2 id={titleId}>{title}</h2>

        {children}

        <button
          type="button"
          className="restart-button dialog-action"
          ref={actionRef}
          onClick={onClose}
        >
          {action}
        </button>
      </div>
    </dialog>
  )
}

export default Dialog
