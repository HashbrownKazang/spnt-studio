export class AnalyticsService {
    private listeners: Set<string> = new Set();
    private listenerStats: Map<string, {
      joinTime: number;
      duration: number;
      isLive: boolean;
    }> = new Map();
  
    addListener(sessionId: string, isLive: boolean) {
      this.listeners.add(sessionId);
      this.listenerStats.set(sessionId, {
        joinTime: Date.now(),
        duration: 0,
        isLive
      });
    }
  
    removeListener(sessionId: string) {
      const stats = this.listenerStats.get(sessionId);
      if (stats) {
        stats.duration = Date.now() - stats.joinTime;
        // Here you would typically save these stats to your database
      }
      this.listeners.delete(sessionId);
    }
  
    getCurrentListeners(): number {
      return this.listeners.size;
    }
  
    getListenerStats() {
      return Array.from(this.listenerStats.entries()).map(([sessionId, stats]) => ({
        sessionId,
        ...stats
      }));
    }
  }