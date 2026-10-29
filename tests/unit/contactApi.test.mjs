import { beforeEach, describe, expect, it } from 'vitest'
import { createHandler } from '../../src/api/contact/index.mjs'

// DynamoDB is the boundary: record what would be written instead of writing it
let stored
const handler = createHandler(async (command) => {
  stored.push(command.input)
})
beforeEach(() => {
  stored = []
  process.env.TABLE_NAME = 'contact-table'
})

const post = (body, options = {}) =>
  handler({ body: JSON.stringify(body), ...options })
const message = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Is there a Dvorak layout for numbers?',
}
const replyOf = (response) => ({
  status: response.statusCode,
  ...JSON.parse(response.body),
})

describe('POST /api/contact', () => {
  it('stores a message with an id and time', async () => {
    const response = await post(message)

    expect(replyOf(response)).toEqual({ status: 201, ok: true })
    expect(stored).toHaveLength(1)
    expect(stored[0].TableName).toBe('contact-table')
    expect(stored[0].Item).toMatchObject(message)
    expect(stored[0].Item.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(Date.parse(stored[0].Item.createdAt)).not.toBeNaN()
  })

  it('trims spaces around each field', async () => {
    await post({ ...message, name: '  Ada  ', email: ' ada@example.com ' })
    expect(stored[0].Item).toMatchObject({
      name: 'Ada',
      email: 'ada@example.com',
    })
  })

  it('reads a base64-encoded body', async () => {
    const body = Buffer.from(JSON.stringify(message)).toString('base64')
    const response = await handler({ body, isBase64Encoded: true })
    expect(response.statusCode).toBe(201)
    expect(stored[0].Item).toMatchObject(message)
  })

  it.each([
    ['name', 'Enter your name.'],
    ['email', 'Enter your email.'],
    ['message', 'Enter your message.'],
  ])('rejects a missing %s', async (field, error) => {
    const response = await post({ ...message, [field]: '   ' })
    expect(replyOf(response)).toEqual({ status: 400, error })
    expect(stored).toEqual([])
  })

  it('rejects an email address without a domain', async () => {
    const response = await post({ ...message, email: 'ada@example' })
    expect(replyOf(response)).toEqual({
      status: 400,
      error: 'Enter a valid email address.',
    })
    expect(stored).toEqual([])
  })

  it.each([
    ['name', 100],
    ['email', 254],
    ['message', 5000],
  ])('accepts a %s of %i characters but not one more', async (field, limit) => {
    const fill = (length) =>
      field === 'email'
        ? 'a'.repeat(length - '@example.com'.length) + '@example.com'
        : 'a'.repeat(length)

    expect((await post({ ...message, [field]: fill(limit) })).statusCode).toBe(
      201
    )
    const tooLong = await post({ ...message, [field]: fill(limit + 1) })
    expect(replyOf(tooLong)).toEqual({
      status: 400,
      error: `Keep your ${field} under ${limit} characters.`,
    })
    expect(stored).toHaveLength(1)
  })

  it('accepts but never stores a message with the hidden field filled', async () => {
    const response = await post({ ...message, website: 'https://spam.example' })
    expect(replyOf(response)).toEqual({ status: 201, ok: true })
    expect(stored).toEqual([])
  })

  it.each([
    ['not JSON', { body: 'name=Ada' }],
    ['no body', {}],
    ['JSON that is not an object', { body: 'null' }],
  ])('rejects %s', async (_, event) => {
    const response = await handler(event)
    expect(replyOf(response)).toEqual({
      status: 400,
      error: 'Send name, email and message as JSON.',
    })
    expect(stored).toEqual([])
  })
})
