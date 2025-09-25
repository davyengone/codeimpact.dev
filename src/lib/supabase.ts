import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export a function to create client instances if needed
export { createClient }

// Export a function to get the default client
export const getSupabaseClient = () => supabase

// Database Types
export interface Technology {
  id: number
  name: string
  description?: string
  category: string
  created_at: string
  updated_at: string
}

export interface Vote {
  id: number
  user_id: string
  technology_id: number
  impact_value: number
  reasoning?: string
  created_at: string
  updated_at: string
}

export interface VoteWithTechnology extends Vote {
  technologies: Technology
}