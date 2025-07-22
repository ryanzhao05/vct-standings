import { MatchWithTeams } from './supabase';

export interface WeekGroup {
  week: number;
  title: string;
  matches: MatchWithTeams[];
}

export function groupMatchesByWeek(matches: MatchWithTeams[]): WeekGroup[] {
  const weeks: WeekGroup[] = [];
  const matchesPerWeek = 3;
  
  for (let i = 0; i < matches.length; i += matchesPerWeek) {
    const weekMatches = matches.slice(i, i + matchesPerWeek);
    const weekNumber = Math.floor(i / matchesPerWeek) + 1;
    
    weeks.push({
      week: weekNumber,
      title: `Week ${weekNumber}`,
      matches: weekMatches
    });
  }
  
  return weeks;
} 