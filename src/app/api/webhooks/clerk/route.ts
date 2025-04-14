import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { supabase } from '@/lib/supabase-client'

const webhookSecret: string = process.env.CLERK_WEBHOOK_SECRET || ''

async function handler(request: Request) {
  const payloadString = await request.text()
  const svixHeaders = headers()
  const svix_id = svixHeaders.get('svix-id')
  const svix_timestamp = svixHeaders.get('svix-timestamp')
  const svix_signature = svixHeaders.get('svix-signature')
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers',
      { status: 400 }
    )
  }
  const wh = new Webhook(webhookSecret)
  let evt: WebhookEvent
  try {
    evt = wh.verify(
      payloadString,
      {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }
    ) as WebhookEvent
  } catch (err) {
    console.error('Error while verifying webhook or fetching user data:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }
  const { id } = evt.data
  const eventType = evt.type
  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data
    const email = email_addresses[0].email_address
    try {
      const { error } = await supabase
        .from('users')
        .insert([{ id, full_name: `${first_name} ${last_name}`, avatar_url: image_url, email }])
      if (error) {
        console.error('Error inserting user into Supabase:', error)
        return new Response('Error inserting user into Supabase', { status: 500 })
      }
      return new Response(JSON.stringify({ message: 'User created and added to Supabase' }), { status: 200 })
    } catch (error) {
      console.error('Error inserting user into Supabase:', error)
      return new Response('Error inserting user into Supabase', { status: 500 })
    }
  }
  return new Response('Received event: ' + eventType)
}

export const POST = handler