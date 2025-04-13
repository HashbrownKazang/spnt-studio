export interface Database {
    public: {
      Tables: {
        episodes: {
          Row: Episode;
          Insert: Omit<Episode, 'id' | 'created_at'>;
          Update: Partial<Omit<Episode, 'id' | 'created_at'>>;
        };
        analytics: {
          Row: Analytics;
          Insert: Omit<Analytics, 'id' | 'join_time'>;
          Update: Partial<Omit<Analytics, 'id' | 'join_time'>>;
        };
        chat_messages: {
          Row: ChatMessage;
          Insert: Omit<ChatMessage, 'id' | 'created_at'>;
          Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>>;
        };
      };
      Views: {
        [key: string]: {
          Row: Record<string, unknown>;
          Insert: Record<string, unknown>;
          Update: Record<string, unknown>;
        };
      };
      Functions: {
        [key: string]: {
          Args: Record<string, unknown>;
          Returns: unknown;
        };
      };
      Enums: {
        [key: string]: string[];
      };
    };
  }
  
  export interface Episode {
    id: string;
    title: string;
    description: string | null;
    duration: number | null;
    audio_url: string | null;
    created_at: string;
    user_id: string;
    is_live: boolean;
    status: 'draft' | 'published' | 'archived';
  }
  
  export interface Analytics {
    id: string;
    episode_id: string;
    session_id: string;
    join_time: string;
    leave_time: string | null;
    user_id: string | null;
    is_live: boolean;
  }
  
  export interface ChatMessage {
    id: string;
    episode_id: string;
    user_id: string | null;
    message: string;
    created_at: string;
    is_system: boolean;
  }
  
  export type { Database as default };