import MatchPrediction from "./MatchPrediction";

interface Match {
  id: string;
  team1: {
    id: string;
    name: string;
    abbreviation: string;
  };
  team2: {
    id: string;
    name: string;
    abbreviation: string;
  };
  team1Score: number;
  team2Score: number;
}

interface MatchSectionProps {
  title: string;
  matches: Match[];
  onMatchScoreChange: (
    matchId: string,
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
            team1={match.team1}
            team2={match.team2}
            team1Score={match.team1Score}
            team2Score={match.team2Score}
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
