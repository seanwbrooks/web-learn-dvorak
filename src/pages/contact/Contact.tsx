import React, { JSX, useState } from 'react'
import Site from '../site/Site'
import '../../components/Button.css'
import '../site/page.css'
import './Contact.css'

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'failed'; message: string }

// Stored by api/contact (see docs/adr/0004)
const ENDPOINT = '/api/contact'

function Contact(): JSX.Element {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  // Locked while sending, so the reset after a send can't clear newer edits
  const sending = status.kind === 'sending'

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fields = new FormData(form)
    const data = {
      name: fields.get('name'),
      email: fields.get('email'),
      message: fields.get('message'),
      website: fields.get('website'),
    }
    setStatus({ kind: 'sending' })
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        form.reset()
        setStatus({ kind: 'sent' })
        return
      }
      const body = await response.json().catch(() => ({}))
      setStatus({
        kind: 'failed',
        message:
          body.error ?? 'Your message wasn’t sent. Try again in a minute.',
      })
    } catch {
      setStatus({
        kind: 'failed',
        message:
          'Your message wasn’t sent. Check your connection and try again.',
      })
    }
  }

  return (
    <Site current="contact">
      <main className="page">
        <h1>Contact</h1>
        <p className="page-lede">
          Questions, a bug, or an idea for Learn Dvorak? Send a message.
        </p>

        <form className="contact-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              readOnly={sending}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              readOnly={sending}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              required
              maxLength={5000}
              readOnly={sending}
            />
          </div>
          {/* Left empty by people; bots that fill it are ignored */}
          <div className="field-trap" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="contact-actions">
            <button
              type="submit"
              className="restart-button page-action"
              disabled={sending}
            >
              {sending ? 'Sending…' : 'Send message'}
            </button>
            <p className="contact-status" role="status">
              {status.kind === 'sent' && 'Thanks, your message was sent.'}
              {status.kind === 'failed' && (
                <>
                  <span className="weak-key-dot" aria-hidden="true" />
                  {status.message}
                </>
              )}
            </p>
          </div>
        </form>
      </main>
    </Site>
  )
}

export default Contact
