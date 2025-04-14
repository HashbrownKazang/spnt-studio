import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase-client'

export async function POST(request: Request) {
  try {
    const { episodeId, content, userId } = await request.json()

    // Save message to Supabase
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        episode_id: episodeId,
        content,
        user_id: userId,
        is_live: true
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving chat message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
