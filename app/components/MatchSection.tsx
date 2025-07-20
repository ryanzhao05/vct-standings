import MatchPrediction from "./MatchPrediction";
import { MatchWithTeams } from "../../lib/supabase";

interface MatchSectionProps {
  title: string;
  matches: MatchWithTeams[];
  onMatchScoreChange: (
    matchId: number,
    team1Score: number,
    team2Score: number
  ) => void;
  onReset: () => void;
}

export default function MatchSection({
  title,
  matches,
  onMatchScoreChange,
  onReset,
}: MatchSectionProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-4">
        {matches.map((match) => (
          <MatchPrediction
            key={match.id}
            team1={{
              id: match.team1.id.toString(),
              name: match.team1.name,
              abbreviation: match.team1.name.substring(0, 3).toUpperCase(),
              logo_url: match.team1.logo_url,
            }}
            team2={{
              id: match.team2.id.toString(),
              name: match.team2.name,
              abbreviation: match.team2.name.substring(0, 3).toUpperCase(),
              logo_url: match.team2.logo_url,
            }}
            team1Score={match.team1_score}
            team2Score={match.team2_score}
            onScoreChange={(team1Score, team2Score) =>
              onMatchScoreChange(match.id, team1Score, team2Score)
            }
          />
        ))}
        <div className="text-center">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors text-sm cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
