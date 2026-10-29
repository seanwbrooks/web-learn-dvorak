// Stores a Contact form message in DynamoDB (see docs/adr/0004). Invoked by
// the HTTP API at POST /api/contact, which CloudFront serves on the site's
// own domain.
import { randomUUID } from 'node:crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const LIMITS = { name: 100, email: 254, message: 5000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const reply = (statusCode, body) => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
})

// Returns the cleaned message, or a reason it can't be stored
export function validate(input) {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Send name, email and message as JSON.' }
  }
  const fields = {}
  for (const [field, limit] of Object.entries(LIMITS)) {
    const value = typeof input[field] === 'string' ? input[field].trim() : ''
    if (!value) return { error: `Enter your ${field}.` }
    if (value.length > limit) {
      return { error: `Keep your ${field} under ${limit} characters.` }
    }
    fields[field] = value
  }
  if (!EMAIL.test(fields.email))
    return { error: 'Enter a valid email address.' }
  return { fields }
}

// send is injectable so the handler can be exercised without AWS
export const createHandler = (send) => async (event) => {
  let input
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
      : event.body
    input = JSON.parse(raw ?? '')
  } catch {
    return reply(400, { error: 'Send name, email and message as JSON.' })
  }

  // The form's hidden "website" field is left empty by people and filled by
  // bots; accept those quietly and store nothing
  if (input?.website) return reply(201, { ok: true })

  const { fields, error } = validate(input)
  if (error) return reply(400, { error })

  await send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        ...fields,
      },
    })
  )
  return reply(201, { ok: true })
}

export const handler = createHandler((command) => db.send(command))
