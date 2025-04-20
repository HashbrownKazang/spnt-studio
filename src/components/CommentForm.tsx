'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

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
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your comment..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Button
        type="submit"
        variant="default"
        disabled={isSubmitting || !content.trim()}
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  )
}
