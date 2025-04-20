'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatMessage {
  id: string
  content: string
  user: {
    id: string
    name: string
    avatar: string
  }
  timestamp: string
}

export function LiveChat({ episodeId }: { episodeId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Connect to WebSocket when component mounts
  useEffect(() => {
    const socket = new WebSocket(`wss://your-durable-object.example.com/chat/${episodeId}`)

    socket.onopen = () => {
      setIsConnected(true)
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [...prev, message])
    }

    socket.onerror = (error) => {
      setError('Connection error. Try refreshing.')
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      setIsConnected(false)
    }

    return () => {
      socket.close()
    }
  }, [episodeId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const { userId } = await auth()
    if (!userId) return

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          episodeId,
          content: newMessage,
          userId
        })
      })

      if (!response.ok) throw new Error('Failed to send message')
      
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-bold">Live Chat</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length ? (
          messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <Image
                src={message.user.avatar || '/default-avatar.png'}
                alt={message.user.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium">{message.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            {isConnected ? 'No messages yet' : 'Connecting...'}
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!isConnected || !newMessage.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
