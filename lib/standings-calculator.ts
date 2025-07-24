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
  
  // Helper function to get head-to-head matches between two teams
  const getHeadToHeadMatches = (team1Id: number, team2Id: number) => {
    const h2hMatches = matches.filter(match => 
      (match.team1_id === team1Id && match.team2_id === team2Id) ||
      (match.team1_id === team2Id && match.team2_id === team1Id)
    );
    console.log(`Found ${h2hMatches.length} H2H matches between teams ${team1Id} and ${team2Id}`);
    return h2hMatches;
  };

  // Calculate head-to-head statistics
  const getHeadToHeadStats = (team1Id: number, team2Id: number) => {
    const h2hMatches = getHeadToHeadMatches(team1Id, team2Id);
    
    let team1Wins = 0;
    let team1MapWins = 0;
    let team1MapLosses = 0;
    let team1RoundWins = 0;
    let team1RoundLosses = 0;
    
    h2hMatches.forEach(match => {
      const isTeam1First = match.team1_id === team1Id;
      
      const team1Score = isTeam1First ? match.team1_score : match.team2_score;
      const team2Score = isTeam1First ? match.team2_score : match.team1_score;
      
      if (team1Score > team2Score) {
        team1Wins++;
      }
      
      team1MapWins += team1Score;
      team1MapLosses += team2Score;
      
      // Calculate rounds for this match
      const totalMaps = team1Score + team2Score;
      for (let map = 0; map < totalMaps; map++) {
        if (map < team1Score) {
          team1RoundWins += 13;
          team1RoundLosses += 9;
        } else {
          team1RoundWins += 9;
          team1RoundLosses += 13;
        }
      }
    });
    
    return {
      team1Wins,
      team1MapDiff: team1MapWins - team1MapLosses,
      team1RoundDiff: team1RoundWins - team1RoundLosses
    };
  };

  const haveSameRecord = (a: TeamStanding, b: TeamStanding) => {
    const aWinRate = a.wins / (a.wins + a.losses) || 0;
    const bWinRate = b.wins / (b.wins + b.losses) || 0;
    
    if (aWinRate !== bWinRate) return false;
    if (a.losses !== b.losses) return false;
    
    return true;
  };

    // Helper function to apply tiebreakers between two teams
  const applyTiebreakers = (a: TeamStanding, b: TeamStanding): number => {
    const h2hStats = getHeadToHeadStats(a.id, b.id);
    if (h2hStats.team1Wins > 0) {
      return -1; // Team A wins
    } else if (h2hStats.team1Wins === 0 && h2hStats.team1MapDiff !== 0) {
      return 1; // Team A loses
    }
    
    // Head-to-head Map Differential
    if (h2hStats.team1MapDiff !== 0) {
      return h2hStats.team1MapDiff;
    }
    
    // Head-to-head Round Differential
    if (h2hStats.team1RoundDiff !== 0) {
      return h2hStats.team1RoundDiff;
    }
    
    // Map Differential
    const aMapDiff = a.mapWins - a.mapLosses;
    const bMapDiff = b.mapWins - b.mapLosses;
    if (aMapDiff !== bMapDiff) {
      return bMapDiff - aMapDiff;
    }
    
    // Round Differential
    const aRoundDiff = a.roundWins - a.roundLosses;
    const bRoundDiff = b.roundWins - b.roundLosses;
    return bRoundDiff - aRoundDiff;
  };

  // Get head-to-head match score between two teams
  const getH2HMatchScore = (a: TeamStanding, b: TeamStanding): number => {
    const h2hStats = getHeadToHeadStats(a.id, b.id);
    if (h2hStats.team1Wins > 0) return 1; // A wins
    if (h2hStats.team1Wins === 0 && h2hStats.team1MapDiff !== 0) return -1; 
    return 0; // Tie
  };

  // Get head-to-head map differential between two teams
  const getH2HMapDiff = (a: TeamStanding, b: TeamStanding): number => {
    const h2hStats = getHeadToHeadStats(a.id, b.id);
    return h2hStats.team1MapDiff;
  };

  // Get head-to-head round differential between two teams
  const getH2HRoundDiff = (a: TeamStanding, b: TeamStanding): number => {
    const h2hStats = getHeadToHeadStats(a.id, b.id);
    return h2hStats.team1RoundDiff;
  };

  // Helper function to apply subgroup tiebreaker
  const applySubgroupTiebreaker = (teams: TeamStanding[], criterion: 'match' | 'map' | 'round' | 'overallMap' | 'overallRound'): TeamStanding[] => {
    if (teams.length <= 1) return teams;
    if (teams.length === 2) {
      const result = applyTiebreakers(teams[0], teams[1]);
      return result <= 0 ? teams : [teams[1], teams[0]];
    }

    // For 3+ teams, find subgroups
    const subgroups: TeamStanding[][] = [];
    const processed = new Set<number>();

    for (let i = 0; i < teams.length; i++) {
      if (processed.has(teams[i].id)) continue;

      const subgroup = [teams[i]];
      processed.add(teams[i].id);

      // Find all teams that tie with this team
      for (let j = i + 1; j < teams.length; j++) {
        if (processed.has(teams[j].id)) continue;

        let tie = false;
        switch (criterion) {
          case 'match':
            tie = getH2HMatchScore(teams[i], teams[j]) === 0;
            break;
          case 'map':
            tie = getH2HMapDiff(teams[i], teams[j]) === 0;
            break;
          case 'round':
            tie = getH2HRoundDiff(teams[i], teams[j]) === 0;
            break;
          case 'overallMap':
            tie = (teams[i].mapWins - teams[i].mapLosses) === (teams[j].mapWins - teams[j].mapLosses);
            break;
          case 'overallRound':
            tie = (teams[i].roundWins - teams[i].roundLosses) === (teams[j].roundWins - teams[j].roundLosses);
            break;
        }

        if (tie) {
          subgroup.push(teams[j]);
          processed.add(teams[j].id);
        }
      }

      subgroups.push(subgroup);
    }

    // If we can't create subgroups, move to next category
    if (subgroups.length === 1) {
      const nextCriterion = criterion === 'match' ? 'map' : 
                           criterion === 'map' ? 'round' : 
                           criterion === 'round' ? 'overallMap' : 
                           criterion === 'overallMap' ? 'overallRound' : null;
      
      if (nextCriterion) {
        return applySubgroupTiebreaker(teams, nextCriterion);
      }
      return teams; 
    }

    // Sort subgroups and recursively apply tiebreakers
    const sortedSubgroups = subgroups.map(subgroup => {
      if (subgroup.length === 1) return subgroup;
      return applySubgroupTiebreaker(subgroup, 'match'); // Start from beginning for each subgroup
    });

    return sortedSubgroups.flat();
  };

  standingsArray.sort((a, b) => {
    // Primary: Win-Loss record
    const aWinRate = a.wins / (a.wins + a.losses) || 0;
    const bWinRate = b.wins / (b.wins + b.losses) || 0;
    
    if (aWinRate !== bWinRate) {
      return bWinRate - aWinRate;
    }
    
    if (a.losses !== b.losses) {
      return a.losses - b.losses;
    }
    
    // Check if teams have the same W/L record, if so apply tiebreakers
    if (haveSameRecord(a, b)) {
      return applyTiebreakers(a, b);
    }
    
    // Map differential
    const aMapDiff = a.mapWins - a.mapLosses;
    const bMapDiff = b.mapWins - b.mapLosses;
    
    if (aMapDiff !== bMapDiff) {
      return bMapDiff - aMapDiff;
    }
    
    //Round differential
    const aRoundDiff = a.roundWins - a.roundLosses;
    const bRoundDiff = b.roundWins - b.roundLosses;
    
    return bRoundDiff - aRoundDiff;
  });

  // Apply subgroup tiebreaker for teams with same record
  let i = 0;
  while (i < standingsArray.length) {
    let j = i + 1;
    while (j < standingsArray.length && haveSameRecord(standingsArray[i], standingsArray[j])) {
      j++;
    }
    
    if (j - i > 2) {
      // 3+ teams tied, apply subgroup tiebreaker
      const tiedTeams = standingsArray.slice(i, j);
      const sortedTiedTeams = applySubgroupTiebreaker(tiedTeams, 'match');
      
      // Replace the tied teams with sorted result
      for (let k = 0; k < sortedTiedTeams.length; k++) {
        standingsArray[i + k] = sortedTiedTeams[k];
      }
    }
    
    i = j;
  }

  // Assign positions and qualification status
  standingsArray.forEach((team, index) => {
    team.position = index + 1;
    team.isQualified = index < 4; // Top 4 qualify
  });

  return standingsArray;
} 