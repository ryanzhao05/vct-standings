import { Team, MatchWithTeams } from './supabase';

interface TeamStanding {
  id: number;
  name: string;
  abbreviation?: string;
  logo_url?: string;
  position: number;
  wins: number;
  losses: number;
  mapWins: number;
  mapLosses: number;
  roundWins: number;
  roundLosses: number;
  isQualified: boolean;
}

export function calculateStandings(teams: Team[], matches: MatchWithTeams[]): TeamStanding[] {
  // Initialize standings for all teams
  const standings: { [key: number]: TeamStanding } = {};
  
  teams.forEach(team => {
    standings[team.id] = {
      id: team.id,
      name: team.name,
      abbreviation: team.name.substring(0, 3).toUpperCase(), // Generate abbreviation from name
      logo_url: team.logo_url,
      position: 0,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: team.rounds_won || 0,
      roundLosses: team.rounds_lost || 0,
      isQualified: false,
    };
  });

  // Process each match
  matches.forEach(match => {
    const team1 = standings[match.team1_id];
    const team2 = standings[match.team2_id];
    
    if (!team1 || !team2) return;

    // Use predicted scores if available, otherwise use actual scores
    const team1Score = match.team1_score;
    const team2Score = match.team2_score;

    // Determine winner and loser
    if (team1Score > team2Score) {
      // Team 1 wins
      team1.wins++;
      team2.losses++;
      
      // Map differentials
      team1.mapWins += team1Score;
      team1.mapLosses += team2Score;
      team2.mapWins += team2Score;
      team2.mapLosses += team1Score;
      
      // Round differentials
      if (!match.is_completed) {
        const totalMaps = team1Score + team2Score;
        
        // For each map, determine winner and apply 13-9 scoring
        for (let map = 0; map < totalMaps; map++) {
          if (map < team1Score) {
            // Team 1 won 
            team1.roundWins += 13;
            team1.roundLosses += 9;
            team2.roundWins += 9;
            team2.roundLosses += 13;
          } else {
            // Team 2 won 
            team2.roundWins += 13;
            team2.roundLosses += 9;
            team1.roundWins += 9;
            team1.roundLosses += 13;
          }
        }
      }
      
    } else if (team2Score > team1Score) {
      // Team 2 wins
      team2.wins++;
      team1.losses++;
      
      // Map differentials
      team2.mapWins += team2Score;
      team2.mapLosses += team1Score;
      team1.mapWins += team1Score;
      team1.mapLosses += team2Score;
      
      // Round differentials 
      if (!match.is_completed) {
        // Calculate per individual map
        const totalMaps = team1Score + team2Score;
        
        // For each map, determine winner and apply 13-9 scoring
        for (let map = 0; map < totalMaps; map++) {
          if (map < team2Score) {
            // Team 2 won 
            team2.roundWins += 13;
            team2.roundLosses += 9;
            team1.roundWins += 9;
            team1.roundLosses += 13;
          } else {
            // Team 1 won 
            team1.roundWins += 13;
            team1.roundLosses += 9;
            team2.roundWins += 9;
            team2.roundLosses += 13;
          }
        }
      }
      
    } else {
      team1.mapWins += team1Score;
      team1.mapLosses += team2Score;
      team2.mapWins += team2Score;
      team2.mapLosses += team1Score;
      
      // Round differentials 
      if (!match.is_completed) {
        // Calculate per individual map
        const totalMaps = team1Score + team2Score;
        
        // For each map, determine winner and apply 13-9 scoring
        for (let map = 0; map < totalMaps; map++) {
          if (map < team1Score) {
            // Team 1 won 
            team1.roundWins += 13;
            team1.roundLosses += 9;
            team2.roundWins += 9;
            team2.roundLosses += 13;
          } else {
            // Team 2 won 
            team2.roundWins += 13;
            team2.roundLosses += 9;
            team1.roundWins += 9;
            team1.roundLosses += 13;
          }
        }
      }
    }
  });

  // Convert to array and sort by standings criteria
  const standingsArray = Object.values(standings);
  
  // Tie-breakers
  standingsArray.sort((a, b) => {
    //  Win-Loss record
    const aWinRate = a.wins / (a.wins + a.losses) || 0;
    const bWinRate = b.wins / (b.wins + b.losses) || 0;
    
    if (aWinRate !== bWinRate) {
      return bWinRate - aWinRate;
    }
    
    // Number of losses 
    if (a.losses !== b.losses) {
      return a.losses - b.losses;
    }
    
    // Map differential
    const aMapDiff = a.mapWins - a.mapLosses;
    const bMapDiff = b.mapWins - b.mapLosses;
    
    if (aMapDiff !== bMapDiff) {
      return bMapDiff - aMapDiff;
    }
    
    // Round differential
    const aRoundDiff = a.roundWins - a.roundLosses;
    const bRoundDiff = b.roundWins - b.roundLosses;
    
    return bRoundDiff - aRoundDiff;
  });

  // Assign positions and qualification status
  standingsArray.forEach((team, index) => {
    team.position = index + 1;
    team.isQualified = index < 4; // Top 4 qualify
  });

  return standingsArray;
} 