export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          plan: 'free' | 'pro';
          theme_pref: 'dark' | 'light';
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          plan?: 'free' | 'pro';
          theme_pref?: 'dark' | 'light';
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          plan?: 'free' | 'pro';
          theme_pref?: 'dark' | 'light';
          created_at?: string;
        };
      };
      saves: {
        Row: {
          id: string;
          user_id: string;
          slot_name: string;
          current_mode: 'player' | 'manager';
          season_year: number;
          generation: number;
          game_state: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          slot_name: string;
          current_mode: 'player' | 'manager';
          season_year?: number;
          generation?: number;
          game_state: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          slot_name?: string;
          current_mode?: 'player' | 'manager';
          season_year?: number;
          generation?: number;
          game_state?: Json;
          updated_at?: string;
        };
      };
      leaderboard: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          mode: 'player' | 'manager';
          trophies_count: number;
          points: number;
          club_name: string | null;
          season_year: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          mode: 'player' | 'manager';
          trophies_count?: number;
          points?: number;
          club_name?: string | null;
          season_year?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          mode?: 'player' | 'manager';
          trophies_count?: number;
          points?: number;
          club_name?: string | null;
          season_year?: number;
          updated_at?: string;
        };
      };
      community_packs: {
        Row: {
          id: string;
          author_id: string | null;
          name: string;
          description: string | null;
          data: Json;
          downloads: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          name: string;
          description?: string | null;
          data: Json;
          downloads?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string | null;
          name?: string;
          description?: string | null;
          data?: Json;
          downloads?: number;
          created_at?: string;
        };
      };
    };
  };
}
