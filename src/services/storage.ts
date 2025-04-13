import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  private R2_ENDPOINT: string;
  private R2_ACCESS_KEY: string;
  private R2_SECRET_KEY: string;
  private BUCKET_NAME: string;

  constructor() {
    this.R2_ENDPOINT = import.meta.env.VITE_R2_ENDPOINT;
    this.R2_ACCESS_KEY = import.meta.env.VITE_R2_ACCESS_KEY;
    this.R2_SECRET_KEY = import.meta.env.VITE_R2_SECRET_KEY;
    this.BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
  }

  async uploadEpisode(audioBlob: Blob, metadata: {
    title: string;
    description: string;
    duration: number;
  }): Promise<string> {
    const episodeId = uuidv4();
    const fileName = `${episodeId}.mp3`;

    try {
      // Upload the audio file
      const uploadResponse = await fetch(`${this.R2_ENDPOINT}/${fileName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${btoa(`${this.R2_ACCESS_KEY}:${this.R2_SECRET_KEY}`)}`,
          'Content-Type': 'audio/mpeg',
          'x-amz-meta-title': metadata.title,
          'x-amz-meta-description': metadata.description,
          'x-amz-meta-duration': metadata.duration.toString(),
        },
        body: audioBlob
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      // Return the public URL for the uploaded file
      return `${this.R2_ENDPOINT}/${fileName}`;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload episode');
    }
  }

  async exportToYouTube(episodeId: string, imageUrl: string) {
    // First, download the episode from R2
    const audioResponse = await fetch(`${this.R2_ENDPOINT}/${episodeId}.mp3`, {
      headers: {
        'Authorization': `Basic ${btoa(`${this.R2_ACCESS_KEY}:${this.R2_SECRET_KEY}`)}`,
      }
    });

    const audioBlob = await audioResponse.blob();
    
    // Create video with static image and audio using ffmpeg.js
    const ffmpeg = require('ffmpeg.js');
    
    const result = ffmpeg({
      MEMFS: [
        { name: "audio.mp3", data: await audioBlob.arrayBuffer() },
        { name: "image.jpg", data: await (await fetch(imageUrl)).arrayBuffer() }
      ],
      arguments: [
        "-loop", "1",
        "-i", "image.jpg",
        "-i", "audio.mp3",
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        "output.mp4"
      ]
    });

    const outputData = result.MEMFS[0];
    const videoBlob = new Blob([outputData.data], { type: 'video/mp4' });

    return videoBlob;
  }
}