// @vitest-environment jsdom
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import Contact from '../../src/pages/contact/Contact'

// The network is the one thing these tests replace: /api/contact answers
// however `respond` says
const answer = (respond: () => Promise<Response>) => {
  const fetch = vi.fn(respond)
  vi.stubGlobal('fetch', fetch)
  return fetch
}
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status })

const field = (label: string) =>
  screen.getByLabelText(label) as HTMLInputElement | HTMLTextAreaElement
const fillIn = () => {
  fireEvent.change(field('Name'), { target: { value: 'Ada' } })
  fireEvent.change(field('Email'), { target: { value: 'ada@example.com' } })
  fireEvent.change(field('Message'), { target: { value: 'Hello' } })
}
const send = async () => {
  await act(async () => {
    fireEvent.submit(screen.getByRole('button', { name: 'Send message' }))
  })
}
const status = () => screen.getByRole('status').textContent

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('the Contact form', () => {
  it('sends the message as JSON, then thanks the sender and clears the form', async () => {
    const fetch = answer(async () => json(201, { ok: true }))
    render(<Contact />)
    fillIn()
    await send()

    expect(fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello',
        website: '',
      }),
    })
    expect(status()).toBe('Thanks, your message was sent.')
    expect(field('Message').value).toBe('')
  })

  it('locks the form while the message is sending', async () => {
    answer(() => new Promise(() => {}))
    render(<Contact />)
    fillIn()
    await send()

    const button = screen.getByRole('button', { name: 'Sending…' })
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(field('Name').readOnly).toBe(true)
    expect(field('Message').readOnly).toBe(true)
  })

  it("shows the server's sentence when it rejects the message, keeping what was typed", async () => {
    answer(async () => json(400, { error: 'Enter your name.' }))
    render(<Contact />)
    fillIn()
    await send()

    expect(status()).toBe('Enter your name.')
    expect(field('Message').value).toBe('Hello')
  })

  it('asks the sender to try again later when the server gives no reason', async () => {
    answer(async () => new Response('Bad gateway', { status: 502 }))
    render(<Contact />)
    fillIn()
    await send()

    expect(status()).toBe('Your message wasn’t sent. Try again in a minute.')
  })

  it('asks the sender to check their connection when the request never arrives', async () => {
    answer(() => Promise.reject(new TypeError('Failed to fetch')))
    render(<Contact />)
    fillIn()
    await send()

    expect(status()).toBe(
      'Your message wasn’t sent. Check your connection and try again.'
    )
  })
})
