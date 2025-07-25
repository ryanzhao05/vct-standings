// Admin functions to sync data from PandaScore to Supabase

import { createClient } from '@supabase/supabase-js';

// PandaScore API interfaces
export interface PandaScoreTeam {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  location?: string;
  modified_at: string;
}

export interface PandaScoreMatch {
  id: number;
  name: string;
  begin_at: string;
  end_at?: string;
  winner_id?: number;
  winner_type?: string;
  status: string;
  opponents: Array<{
    type: string;
    opponent: PandaScoreTeam;
  }>;
  results: Array<{
    team_id: number;
    score: number;
  }>;
  games: Array<{
    id: number;
    winner_id?: number;
    results: Array<{
      team1: number;
      team2: number;
    }>;
  }>;
  modified_at: string;
}

export interface PandaScoreSeries {
  id: number;
  name: string;
  slug: string;
  league_id: number;
  modified_at: string;
}

// Server-side PandaScore API client
class ServerPandaScoreAPI {
  private token: string;

  constructor() {
    this.token = process.env.PANDASCORE_TOKEN!;
  }

  private async makeRequest(endpoint: string, params: Record<string, string | number> = {}) {
    const url = new URL(`https://api.pandascore.co${endpoint}`);
    url.searchParams.append('token', this.token);
    
    // Add other params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`PandaScore API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('PandaScore API request failed:', error);
      throw error;
    }
  }

  async getCompletedMatches(seriesId: number): Promise<PandaScoreMatch[]> {
    return this.makeRequest('/valorant/matches', {
      'filter[serie_id]': seriesId,
      'per_page': 100,
      'sort': 'begin_at'
    });
  }

  async getUpcomingMatches(seriesId: number): Promise<PandaScoreMatch[]> {
    return this.makeRequest('/valorant/matches', {
      'filter[serie_id]': seriesId,
      'per_page': 100,
      'sort': 'begin_at'
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/valorant/matches', { 'per_page': 1 });
      return true;
    } catch {
      return false;
    }
  }
}

const pandascoreAPI = new ServerPandaScoreAPI();

// Create server-side Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export interface SyncResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
}

// Sync all VCT teams from PandaScore
export async function syncVCTTeams(): Promise<SyncResult> {
  try {
    console.log('Starting VCT teams sync...');
    
    // Define series and their regions
    const seriesRegions = [
      { seriesId: 9442, region: 'americas', name: 'Americas Stage 2 2025' },
      { seriesId: 9441, region: 'emea', name: 'EMEA Stage 2 2025' },
      { seriesId: 9435, region: 'pacific', name: 'Pacific Stage 2 2025' },
      { seriesId: 9434, region: 'china', name: 'China Stage 2 2025' }
    ];
    
    const allTeams = new Map(); // Use Map to deduplicate teams
    
    // Fetch teams from each series
    for (const seriesInfo of seriesRegions) {
      console.log(`Fetching teams for ${seriesInfo.region}...`);
      
      try {
        // Get matches from this series to extract teams
        const matches = await pandascoreAPI.getCompletedMatches(seriesInfo.seriesId);
        const upcomingMatches = await pandascoreAPI.getUpcomingMatches(seriesInfo.seriesId);
        const allMatches = [...matches, ...upcomingMatches];
        
        // Extract teams from matches and assign them to the correct region
        allMatches.forEach((match: PandaScoreMatch) => {
          match.opponents.forEach((opponent) => {
            if (opponent.type === 'Team' && opponent.opponent) {
              const team = opponent.opponent;
              if (!allTeams.has(team.id)) {
                allTeams.set(team.id, {
                  pandascore_id: team.id,
                  name: team.name,
                  logo_url: team.image_url,
                  region: seriesInfo.region, // Use the series region
                  group_name: 'alpha', // Will be updated based on actual groups
                  created_at: new Date().toISOString()
                });
              }
            }
          });
        });
        
        console.log(`Found ${allMatches.length} matches for ${seriesInfo.region}`);
      } catch (error) {
        console.error(`Error fetching matches for ${seriesInfo.region}:`, error);
      }
    }
    
    const processedTeams = Array.from(allTeams.values());
    console.log(`Total unique teams found: ${processedTeams.length}`);
    
    // Only insert teams that don't exist yet, don't update existing ones
    const { error } = await supabase
      .from('teams')
      .upsert(processedTeams, { 
        onConflict: 'pandascore_id',
        ignoreDuplicates: true // Don't update existing teams at all
      });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return {
      success: true,
      message: `Successfully synced ${processedTeams.length} VCT teams`,
      data: { teamsCount: processedTeams.length }
    };
    
  } catch (error) {
    console.error('Error syncing VCT teams:', error);
    return {
      success: false,
      message: 'Failed to sync VCT teams',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Sync completed matches for a specific region
export async function syncCompletedMatches(region: string, seriesId: number): Promise<SyncResult> {
  try {
    console.log(`Starting completed matches sync for ${region}...`);
    
    // Fetch all matches from PandaScore and filter for completed ones
    const allMatches = await pandascoreAPI.getCompletedMatches(seriesId);
    const matches = allMatches.filter(match => 
      match.status === 'finished' && 
      match.winner_id && 
      match.end_at
    );
    console.log(`Found ${matches.length} completed matches for ${region} out of ${allMatches.length} total matches`);
    
    // Get teams mapping from our database
    const { data: teams } = await supabase
      .from('teams')
      .select('id, pandascore_id')
      .eq('region', region);
    
    const teamMapping = new Map(teams?.map(t => [t.pandascore_id, t.id]) || []);
    
    // Process matches
    const processedMatches = matches
      .filter(match => {
        // Extract team IDs from opponents array
        const team1 = match.opponents[0]?.opponent;
        const team2 = match.opponents[1]?.opponent;
        
        if (!team1 || !team2) {
          console.warn(`Skipping match ${match.id} - invalid team structure`);
          return false;
        }
        
        // Only include matches where both teams exist in our database
        return teamMapping.has(team1.id) && teamMapping.has(team2.id);
      })
              .map(match => {
          // Extract team IDs from opponents array
          const team1 = match.opponents[0]?.opponent;
          const team2 = match.opponents[1]?.opponent;
          
          if (!team1 || !team2) {
            console.warn(`Skipping match ${match.id} - invalid team structure`);
            return null;
          }
          
          // Check if both teams exist in our database
          if (!teamMapping.has(team1.id) || !teamMapping.has(team2.id)) {
            console.warn(`Skipping match ${match.id} - teams not found in database`);
            return null;
          }
          
          // Calculate scores from results array
          const team1Result = match.results.find(r => r.team_id === team1.id);
          const team2Result = match.results.find(r => r.team_id === team2.id);
          const team1Score = team1Result?.score || 0;
          const team2Score = team2Result?.score || 0;
          
          return {
            pandascore_id: match.id,
            team1_id: teamMapping.get(team1.id)!,
            team2_id: teamMapping.get(team2.id)!,
            region,
            match_date: new Date(match.begin_at).toISOString(),
            team1_score: team1Score,
            team2_score: team2Score,
            is_completed: true,
            created_at: new Date().toISOString()
          };
        })
        .filter(match => match !== null);
    
    // Insert matches into Supabase
    const { error } = await supabase
      .from('matches')
      .upsert(processedMatches, { 
        onConflict: 'pandascore_id',
        ignoreDuplicates: false 
      });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return {
      success: true,
      message: `Successfully synced ${processedMatches.length} completed matches for ${region}`,
      data: { matchesCount: processedMatches.length }
    };
    
  } catch (error) {
    console.error(`Error syncing completed matches for ${region}:`, error);
    return {
      success: false,
      message: `Failed to sync completed matches for ${region}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Sync upcoming matches for a specific region
export async function syncUpcomingMatches(region: string, seriesId: number): Promise<SyncResult> {
  try {
    console.log(`Starting upcoming matches sync for ${region}...`);
    
    // Fetch all matches from PandaScore and filter for upcoming ones
    const allMatches = await pandascoreAPI.getUpcomingMatches(seriesId);
    const matches = allMatches.filter(match => 
      match.status === 'not_started' || 
      match.status === 'running' ||
      (!match.winner_id && !match.end_at)
    );
    console.log(`Found ${matches.length} upcoming matches for ${region} out of ${allMatches.length} total matches`);
    
    // Get teams mapping from our database
    const { data: teams } = await supabase
      .from('teams')
      .select('id, pandascore_id')
      .eq('region', region);
    
    const teamMapping = new Map(teams?.map(t => [t.pandascore_id, t.id]) || []);
    
    // Process matches
    const processedMatches = matches
              .filter(match => {
          // Extract team IDs from opponents array
          const team1 = match.opponents[0]?.opponent;
          const team2 = match.opponents[1]?.opponent;
          
          if (!team1 || !team2) {
            console.warn(`Skipping upcoming match ${match.id} - invalid team structure`);
            return false;
          }
          
          // Only include matches where both teams exist in our database
          return teamMapping.has(team1.id) && teamMapping.has(team2.id);
        })
        .map(match => {
          const team1 = match.opponents[0]?.opponent;
          const team2 = match.opponents[1]?.opponent;
          
          if (!team1 || !team2) {
            console.warn(`Skipping upcoming match ${match.id} - invalid team structure`);
            return null;
          }
          
          return {
            pandascore_id: match.id,
            team1_id: teamMapping.get(team1.id)!,
            team2_id: teamMapping.get(team2.id)!,
            region,
            match_date: new Date(match.begin_at).toISOString(),
            team1_score: 0, // Default for upcoming matches
            team2_score: 0, // Default for upcoming matches
            is_completed: false,
            created_at: new Date().toISOString()
          };
        })
        .filter(match => match !== null);
    
    // Insert matches into Supabase
    const { error } = await supabase
      .from('matches')
      .upsert(processedMatches, { 
        onConflict: 'pandascore_id',
        ignoreDuplicates: false 
      });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return {
      success: true,
      message: `Successfully synced ${processedMatches.length} upcoming matches for ${region}`,
      data: { matchesCount: processedMatches.length }
    };
    
  } catch (error) {
    console.error(`Error syncing upcoming matches for ${region}:`, error);
    return {
      success: false,
      message: `Failed to sync upcoming matches for ${region}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Sync all data for a specific region
export async function syncRegionData(region: string, seriesId: number): Promise<SyncResult> {
  try {
    console.log(`Starting full sync for ${region}...`);
    
    // Sync teams first
    const teamsResult = await syncVCTTeams();
    if (!teamsResult.success) {
      return teamsResult;
    }
    
    // Sync completed matches
    const completedResult = await syncCompletedMatches(region, seriesId);
    if (!completedResult.success) {
      return completedResult;
    }
    
    // Sync upcoming matches
    const upcomingResult = await syncUpcomingMatches(region, seriesId);
    if (!upcomingResult.success) {
      return upcomingResult;
    }
    
    return {
      success: true,
      message: `Successfully synced all data for ${region}`,
      data: {
        teams: teamsResult.data,
        completedMatches: completedResult.data,
        upcomingMatches: upcomingResult.data
      }
    };
    
  } catch (error) {
    console.error(`Error syncing region data for ${region}:`, error);
    return {
      success: false,
      message: `Failed to sync region data for ${region}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Test PandaScore API connection
export async function testPandaScoreConnection(): Promise<SyncResult> {
  try {
    const isConnected = await pandascoreAPI.testConnection();
    
    if (isConnected) {
      return {
        success: true,
        message: 'PandaScore API connection successful'
      };
    } else {
      return {
        success: false,
        message: 'PandaScore API connection failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'PandaScore API connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get sync status for all regions
export async function getSyncStatus(): Promise<{
  apiStatus: boolean;
  regions: Record<string, { teams: number; completedMatches: number; upcomingMatches: number }>;
}> {
  try {
    // Test API connection
    const apiStatus = await pandascoreAPI.testConnection();
    
    // Get data counts for each region
    const regions = ['americas', 'emea', 'pacific', 'china'];
    const status: Record<string, { teams: number; completedMatches: number; upcomingMatches: number }> = {};
    
    for (const region of regions) {
      const { data: teams } = await supabase
        .from('teams')
        .select('id', { count: 'exact' })
        .eq('region', region);
      
      const { data: completedMatches } = await supabase
        .from('matches')
        .select('id', { count: 'exact' })
        .eq('region', region)
        .eq('is_completed', true);
      
      const { data: upcomingMatches } = await supabase
        .from('matches')
        .select('id', { count: 'exact' })
        .eq('region', region)
        .eq('is_completed', false);
      
      status[region] = {
        teams: teams?.length || 0,
        completedMatches: completedMatches?.length || 0,
        upcomingMatches: upcomingMatches?.length || 0
      };
    }
    
    return { apiStatus, regions: status };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      apiStatus: false,
      regions: {}
    };
  }
} 