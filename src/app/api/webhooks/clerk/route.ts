import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Error: Missing Svix headers' }, { status: 400 })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return NextResponse.json({ error: 'Error: Verification error' }, { status: 400 })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  try{
    switch(eventType) {
      case 'user.created':
        console.log(`User created with ID: ${id}`)
        break
      case 'user.updated':
        await pool.query("UPDATE users SET username = $1, first_name = $2, last_name = $3, image_url = $4, email=$5 WHERE id = $6", [evt.data.username, evt.data.first_name, evt.data.last_name, evt.data.image_url, evt.data.email_addresses.find((emailAddress)=>emailAddress.id===evt.data.primary_email_address_id)?.email_address, id]);
        console.log(`User updated with ID: ${id}`)
        break
      case 'user.deleted':
        console.log(`User deleted with ID: ${id}`)
        break
      default:
        console.log(`Webhook received with ID: ${id}`)
    }
  }
  catch(err){
    console.error('Error: Could not process webhook:', err)
    return NextResponse.json({ error: 'Error: Processing error' }, { status: 400 })
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
}