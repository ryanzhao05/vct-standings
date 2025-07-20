interface Team {
  id: string;
  name: string;
  abbreviation: string;
}

interface Match {
  id: string;
  team1: Team;
  team2: Team;
  team1Score: number;
  team2Score: number;
}

interface TeamStanding {
  id: string;
  name: string;
  abbreviation: string;
  position: number;
  wins: number;
  losses: number;
  mapWins: number;
  mapLosses: number;
  roundWins: number;
  roundLosses: number;
  isQualified: boolean;
}

export function calculateStandings(teams: Team[], matches: Match[]): TeamStanding[] {
  // Initialize standings for all teams
  const standings: { [key: string]: TeamStanding } = {};
  
  teams.forEach(team => {
    standings[team.id] = {
      id: team.id,
      name: team.name,
      abbreviation: team.abbreviation,
      position: 0,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: 0,
      roundLosses: 0,
      isQualified: false,
    };
  });

  // Process each match
  matches.forEach(match => {
    const team1 = standings[match.team1.id];
    const team2 = standings[match.team2.id];
    
    if (!team1 || !team2) return;

    // Determine winner and loser
    if (match.team1Score > match.team2Score) {
      // Team 1 wins
      team1.wins++;
      team2.losses++;
      
      // Map differentials
      team1.mapWins += match.team1Score;
      team1.mapLosses += match.team2Score;
      team2.mapWins += match.team2Score;
      team2.mapLosses += match.team1Score;
      
      // Round differentials (assuming 13 rounds per map for now)
      const team1Rounds = match.team1Score * 13;
      const team2Rounds = match.team2Score * 13;
      team1.roundWins += team1Rounds;
      team1.roundLosses += team2Rounds;
      team2.roundWins += team2Rounds;
      team2.roundLosses += team1Rounds;
      
    } else if (match.team2Score > match.team1Score) {
      // Team 2 wins
      team2.wins++;
      team1.losses++;
      
      // Map differentials
      team2.mapWins += match.team2Score;
      team2.mapLosses += match.team1Score;
      team1.mapWins += match.team1Score;
      team1.mapLosses += match.team2Score;
      
      // Round differentials
      const team1Rounds = match.team1Score * 13;
      const team2Rounds = match.team2Score * 13;
      team2.roundWins += team2Rounds;
      team2.roundLosses += team1Rounds;
      team1.roundWins += team1Rounds;
      team1.roundLosses += team2Rounds;
      
    } else {
      // Tie - both teams get 0.5 wins (or we could handle ties differently)
      team1.mapWins += match.team1Score;
      team1.mapLosses += match.team2Score;
      team2.mapWins += match.team2Score;
      team2.mapLosses += match.team1Score;
      
      const team1Rounds = match.team1Score * 13;
      const team2Rounds = match.team2Score * 13;
      team1.roundWins += team1Rounds;
      team1.roundLosses += team2Rounds;
      team2.roundWins += team2Rounds;
      team2.roundLosses += team1Rounds;
    }
  });

  // Convert to array and sort by standings criteria
  const standingsArray = Object.values(standings);
  
  standingsArray.sort((a, b) => {
    // Primary: Win-Loss record
    const aWinRate = a.wins / (a.wins + a.losses) || 0;
    const bWinRate = b.wins / (b.wins + b.losses) || 0;
    
    if (aWinRate !== bWinRate) {
      return bWinRate - aWinRate;
    }
    
    // Secondary: Map differential
    const aMapDiff = a.mapWins - a.mapLosses;
    const bMapDiff = b.mapWins - b.mapLosses;
    
    if (aMapDiff !== bMapDiff) {
      return bMapDiff - aMapDiff;
    }
    
    // Tertiary: Round differential
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