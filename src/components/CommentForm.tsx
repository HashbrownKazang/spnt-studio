'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'

export function CommentForm({ episodeId }: { episodeId: string }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          episode_id: episodeId,
          content,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })

      if (error) throw error
      
      setContent('')
      window.location.reload() // Refresh to show new comment
    } catch (err) {
      console.error('Error submitting comment:', err)
      setError('Failed to post comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your comment..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  )
}
