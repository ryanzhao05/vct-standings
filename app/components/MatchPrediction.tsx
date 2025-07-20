interface MatchPredictionProps {
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
  onScoreChange: (team1Score: number, team2Score: number) => void;
}

export default function MatchPrediction({
  team1,
  team2,
  team1Score,
  team2Score,
  onScoreChange,
}: MatchPredictionProps) {
  const handleScoreChange = (team: "team1" | "team2", newScore: number) => {
    if (newScore < 0 || newScore > 2) return; // Valid scores are 0, 1, or 2

    if (team === "team1") {
      onScoreChange(newScore, team2Score);
    } else {
      onScoreChange(team1Score, newScore);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
      {/* Team 1 */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-white">
          {team1.abbreviation}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScoreChange("team1", team1Score - 1)}
            disabled={team1Score <= 0}
            className="w-8 h-8 bg-background text-foreground rounded flex items-center justify-center hover:bg-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            -
          </button>
          <span className="w-12 text-center text-white font-medium">
            {team1Score}
          </span>
          <button
            onClick={() => handleScoreChange("team1", team1Score + 1)}
            disabled={team1Score >= 2}
            className="w-8 h-8 bg-background text-foreground rounded flex items-center justify-center hover:bg-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* VS */}
      <span className="text-sm text-gray-400">VS</span>

      {/* Team 2 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScoreChange("team2", team2Score - 1)}
            disabled={team2Score <= 0}
            className="w-8 h-8 bg-background text-foreground rounded flex items-center justify-center hover:bg-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            -
          </button>
          <span className="w-12 text-center text-white font-medium">
            {team2Score}
          </span>
          <button
            onClick={() => handleScoreChange("team2", team2Score + 1)}
            disabled={team2Score >= 2}
            className="w-8 h-8 bg-background text-foreground rounded flex items-center justify-center hover:bg-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            +
          </button>
        </div>
        <span className="text-sm font-medium text-white">
          {team2.abbreviation}
        </span>
      </div>
    </div>
  );
}
