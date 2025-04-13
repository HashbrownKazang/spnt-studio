import { StorageService } from './services/storage';
import { AnalyticsService } from './services/analytics';

const storageService = new StorageService();
const analyticsService = new AnalyticsService();

export async function handleRecordingComplete(audioBlob: Blob, metadata: {
  title: string;
  description: string;
  duration: number;
}) {
  try {
    // Upload to R2
    const episodeId = await storageService.uploadEpisode(audioBlob, metadata);

    // Export to YouTube if background image is provided
    if (metadata.backgroundImage) {
      const videoBlob = await storageService.exportToYouTube(episodeId, metadata.backgroundImage);
      // Here you would handle the YouTube upload through your backend
    }

    return episodeId;
  } catch (error) {
    console.error('Failed to process recording:', error);
    throw error;
  }
}

export function initializeAnalytics() {
  // Set up WebSocket connection for live listener tracking
  const ws = new WebSocket(import.meta.env.VITE_WS_ENDPOINT);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'listener_join':
        analyticsService.addListener(data.sessionId, data.isLive);
        break;
      case 'listener_leave':
        analyticsService.removeListener(data.sessionId);
        break;
    }
  };

  return {
    getCurrentListeners: () => analyticsService.getCurrentListeners(),
    getListenerStats: () => analyticsService.getListenerStats()
  };
}