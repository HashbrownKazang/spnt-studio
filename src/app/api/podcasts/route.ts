import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { name } = await req.json()
    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    // Fetch the user's email from the Supabase users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      console.error('Error fetching user data:', userError)
      return new NextResponse('Error fetching user data', { status: 500 })
    }

    const { email } = userData

    const { data, error } = await supabase
      .from('podcasts')
      .insert([{ name, user_id: userId, user_email: email }]) // Include user_id and user_email
      .select()

    if (error) {
      console.error('Error creating podcast:', error)
      return new NextResponse('Error creating podcast', { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating podcast:', error)
    return new NextResponse('Error creating podcast', { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')

    if (error) {
      console.error('Error fetching podcasts:', error)
      return new NextResponse('Error fetching podcasts', { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching podcasts:', error)
    return new NextResponse('Error fetching podcasts', { status: 500 })
  }
}