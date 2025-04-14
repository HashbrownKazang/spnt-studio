import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import supabase from '@/lib/supabase-client'
import { CommentForm } from '@/components/CommentForm'

export default async function EpisodePage({ params }: { params: { id: string } }) {
  // Fetch episode details
  const { data: episode, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !episode) {
    return notFound()
  }

  // Fetch comments for this episode
  const { data: comments } = await supabase
    .from('comments')
    .select('*, users(*)')
    .eq('episode_id', params.id)
    .order('created_at', { ascending: false })

  const { userId } = await auth()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Episode Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{episode.title}</h1>
        <div className="flex items-center space-x-4 text-gray-500 mb-4">
          <span>{new Date(episode.publication_date).toLocaleDateString()}</span>
          <span>•</span>
          <span>{Math.floor(episode.duration / 60)} min</span>
        </div>
        <p className="text-lg">{episode.description}</p>
      </header>

      {/* Audio Player */}
      <div className="mb-8">
        <audio 
          src={`https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${episode.audio_url}`}
          controls
          className="w-full"
        />
      </div>

      {/* Comments Section */}
      <section className="border-t pt-8">
        {userId && <CommentForm episodeId={params.id} />}
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        
        {comments?.length ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <img 
                    src={comment.users?.avatar_url || '/default-avatar.png'} 
                    alt={comment.users?.full_name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{comment.users?.full_name}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </section>
    </div>
  )
}
