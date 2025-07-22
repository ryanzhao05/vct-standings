import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Team {
  id: number
  name: string
  region: 'americas' | 'emea' | 'pacific' | 'china'
  group_name: 'alpha' | 'omega'
  logo_url?: string
  rounds_won?: number
  rounds_lost?: number
  created_at: string
}

export interface Match {
  id: number
  team1_id: number
  team2_id: number
  region: 'americas' | 'emea' | 'pacific' | 'china'
  match_date: string
  team1_score: number
  team2_score: number
  is_completed: boolean
  created_at: string
}

export interface MatchWithTeams extends Match {
  team1: Team
  team2: Team
}

export interface StandingsEntry {
  team: Team
  wins: number
  losses: number
  map_wins: number
  map_losses: number
  map_differential: number
  position: number
} 