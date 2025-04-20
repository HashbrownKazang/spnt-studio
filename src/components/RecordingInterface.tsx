'use client'

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

const RecordingInterface: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getMicrophonePermission = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(audioStream);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        // Handle error appropriately, e.g., display a message to the user
      }
    };

    getMicrophonePermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [stream]);

  const startRecording = () => {
    if (!stream) {
      console.error("No audio stream available.");
      return;
    }

    setRecording(true);
    setDuration(0);
    audioChunks.current = [];
    setAudioBlob(null);

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      setRecording(false);
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };

    recorder.start();

    timerInterval.current = setInterval(() => {
      setDuration(prevDuration => prevDuration + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const saveRecording = async () => {
    if (!audioBlob || !title) {
      setError('Please add a title and make sure recording is complete');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // 1. Get upload URL from our API
      const response = await fetch('/api/podcasts/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: `${title}-${Date.now()}.webm`,
          contentType: 'audio/webm'
        })
      });

      const { url, key } = await response.json();

      // 2. Upload directly to Cloudflare R2
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: audioBlob,
        headers: {
          'Content-Type': 'audio/webm',
        }
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');

      // 3. Save episode metadata to Supabase
      const { error: dbError } = await supabase
        .from('episodes')
        .insert([{
          title,
          description,
          audio_url: key,
          status: 'recorded',
          duration,
          publication_date: new Date().toISOString()
        }]);

      if (dbError) throw dbError;

      // Reset form on success
      setTitle('');
      setDescription('');
      setAudioBlob(null);
    } catch (err) {
      console.error('Error saving recording:', err);
      setError('Failed to save recording. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    // Add any other necessary cleanup if needed
  };


  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Podcast Recording</h2>
      
      {!recording && !audioBlob && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Episode title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Episode description"
              rows={3}
            />
          </div>
        </div>
      )}

      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded font-medium ${
          recording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {recording && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
          <p>Recording: {formatTime(duration)}</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {audioBlob && (
        <div className="space-y-4">
          <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
          <div className="flex space-x-2">
            <button
              onClick={saveRecording}
              disabled={isUploading}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded disabled:bg-gray-400"
            >
              {isUploading ? 'Uploading...' : 'Save Episode'}
            </button>
            <button
              onClick={discardRecording}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingInterface;
