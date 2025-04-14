import { auth, currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase-client'

export default async function Page() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth()

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser()

  // Fetch user data from Supabase
  const { data: supabaseUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user from Supabase:', error)
  }

  // Use `user` to render user details or create UI elements
  return (
    <div>
      Welcome, {user.firstName}!
      {supabaseUser && (
        <p>Supabase Data: {JSON.stringify(supabaseUser)}</p>
      )}
      {error && (
        <p>Error: {error.message}</p>
      )}
    </div>
  )
}