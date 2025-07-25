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

// Track share button events
export async function trackShareEvent(region: string, predictionCount: number, shareUrl: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('share_events')
      .insert({
        region,
        prediction_count: predictionCount,
        share_url: shareUrl
      });

    if (error) {
      console.error('Failed to track share event:', error);
    }
  } catch (error) {
    console.error('Error tracking share event:', error);
  }
}

// Contact form submission
export async function submitContactForm(data: {
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        email: data.email,
        subject: data.subject,
        message: data.message
      });

    if (error) {
      console.error('Failed to submit contact form:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to submit contact form' };
  }
} 