export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      couples: {
        Row: {
          id: string
          invite_code: string
          created_at: string
        }
        Insert: {
          id?: string
          invite_code: string
          created_at?: string
        }
        Update: {
          invite_code?: string
        }
      }
      profiles: {
        Row: {
          id: string
          display_name: string | null
          couple_id: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          couple_id?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          display_name?: string | null
          couple_id?: string | null
          avatar_url?: string | null
        }
      }
      dates: {
        Row: {
          id: string
          couple_id: string
          title: string
          date: string
          location: string | null
          mood: string | null
          rating: number | null
          notes: string | null
          photos: string[] | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          title: string
          date: string
          location?: string | null
          mood?: string | null
          rating?: number | null
          notes?: string | null
          photos?: string[] | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          date?: string
          location?: string | null
          mood?: string | null
          rating?: number | null
          notes?: string | null
          photos?: string[] | null
        }
      }
      milestones: {
        Row: {
          id: string
          couple_id: string
          title: string
          date: string
          emoji: string | null
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          title: string
          date: string
          emoji?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          date?: string
          emoji?: string | null
        }
      }
    }
  }
}
