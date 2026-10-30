import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json | undefined };

export interface Database {
  public: {
    Tables: {
      citizen_app_data: {
        Row: {
          user_id: string;
          saved_scheme_ids: string[];
          tracked_items: Json;
          profile: Json | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          saved_scheme_ids?: string[];
          tracked_items?: Json;
          profile?: Json | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          saved_scheme_ids?: string[];
          tracked_items?: Json;
          profile?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      app_admins: {
        Row: { user_id: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
      managed_official_sites: {
        Row: {
          id: string;
          title: string;
          url: string;
          description: string;
          category: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          description: string;
          category: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          description?: string;
          category?: string;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY?.trim();

export let supabase: SupabaseClient<Database> | null = null;
export let supabaseConfigurationError: string | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
      throw new Error('Supabase URL must use HTTPS.');
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    supabaseConfigurationError = error instanceof Error ? error.message : 'Invalid Supabase configuration.';
  }
} else {
  supabaseConfigurationError = 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the root .env file.';
}
