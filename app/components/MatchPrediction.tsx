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
    if (newScore < 0 || newScore > 2) return;

    let newTeam1Score = team1Score;
    let newTeam2Score = team2Score;

    if (team === "team1") {
      newTeam1Score = newScore;
    } else {
      newTeam2Score = newScore;
    }

    // Game not yet played
    if (newTeam1Score === 0 && newTeam2Score === 0) {
      onScoreChange(newTeam1Score, newTeam2Score);
      return;
    }

    if (newTeam1Score === 1 && newTeam2Score === 1) {
      onScoreChange(newTeam1Score, newTeam2Score);
      return;
    }

    // Check if both teams have 2 wins (impossible in BO3)
    if (newTeam1Score === 2 && newTeam2Score === 2) {
      return; // Don't allow both teams to have 2 wins
    }

    // If we get here, the combination is valid
    onScoreChange(newTeam1Score, newTeam2Score);
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
