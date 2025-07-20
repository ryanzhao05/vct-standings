import { supabase, Team, MatchWithTeams } from './supabase';

// Fetch teams for a specific region
export async function getTeamsByRegion(region: string): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('region', region)
    .order('name');

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }

  return data || [];
}

// Fetch matches for a specific region
export async function getMatchesByRegion(region: string): Promise<MatchWithTeams[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      team1:teams!matches_team1_id_fkey(*),
      team2:teams!matches_team2_id_fkey(*)
    `)
    .eq('region', region)
    .order('match_date');

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return data || [];
} 