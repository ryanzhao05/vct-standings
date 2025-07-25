import Image from "next/image";

interface MatchPredictionProps {
  team1: {
    id: string;
    name: string;
    abbreviation: string;
    logo_url?: string;
  };
  team2: {
    id: string;
    name: string;
    abbreviation: string;
    logo_url?: string;
  };
  team1Score: number;
  team2Score: number;
  isCompleted?: boolean;
  onScoreChange: (team1Score: number, team2Score: number) => void;
}

export default function MatchPrediction({
  team1,
  team2,
  team1Score,
  team2Score,
  isCompleted = false,
  onScoreChange,
}: MatchPredictionProps) {
  // Determine winner for green underline
  const team1Wins = team1Score == 2;
  const team2Wins = team2Score == 2;

  const handleScoreChange = (team: "team1" | "team2", newScore: number) => {
    if (isCompleted || newScore < 0 || newScore > 2) return;

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
    <div
      className={`flex flex-col sm:flex-row items-center justify-between p-3 lg:p-4 rounded-lg gap-3 ${
        isCompleted ? "bg-accent/50 border !border-green-500/20" : "bg-accent"
      }`}
    >
      {/* Team 1 */}
      <div
        className={`flex items-center justify-center gap-2 lg:gap-3 w-full sm:w-auto ${
          team1Wins ? "relative" : ""
        }`}
      >
        <div className="flex items-center gap-2 lg:gap-3">
          {team1Wins && (
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 lg:h-1 bg-emerald-600"></div>
          )}
          <div className="flex items-center gap-1 lg:gap-2">
            {team1.logo_url ? (
              <div className="relative w-6 h-6 lg:w-8 lg:h-8">
                <Image
                  src={team1.logo_url}
                  alt={`${team1.name} logo`}
                  fill
                  className="object-contain"
                  onError={() => {}}
                />
              </div>
            ) : null}
            <span
              className={`text-xs lg:text-sm font-medium text-white ${
                team1.logo_url ? "hidden" : "inline"
              }`}
            >
              {team1.abbreviation}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 lg:gap-2">
            <button
              onClick={() => handleScoreChange("team1", team1Score - 1)}
              disabled={team1Score <= 0 || isCompleted}
              className="w-6 h-6 lg:w-8 lg:h-8 bg-background text-foreground rounded flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs lg:text-sm"
            >
              -
            </button>
            <span className="w-8 lg:w-12 text-center text-white font-bold text-xs lg:text-sm">
              {team1Score}
            </span>
            <button
              onClick={() => handleScoreChange("team1", team1Score + 1)}
              disabled={team1Score >= 2 || isCompleted}
              className="w-6 h-6 lg:w-8 lg:h-8 bg-background text-foreground rounded flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs lg:text-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <span className="text-xs lg:text-sm text-gray-400">VS</span>
      </div>
      {/* Team 2 */}
      <div
        className={`flex items-center justify-center gap-2 lg:gap-3 w-full sm:w-auto ${
          team2Wins ? "relative" : ""
        }`}
      >
        <div className="flex items-center gap-2 lg:gap-3">
          {team2Wins && (
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 lg:h-1 bg-emerald-600"></div>
          )}
          <div className="flex items-center gap-1 lg:gap-2">
            {team2.logo_url ? (
              <div className="relative w-6 h-6 lg:w-8 lg:h-8">
                <Image
                  src={team2.logo_url}
                  alt={`${team2.name} logo`}
                  fill
                  className="object-contain"
                  onError={() => {
                    // Fallback is handled by the span below
                  }}
                />
              </div>
            ) : null}
            <span
              className={`text-xs lg:text-sm font-medium text-white ${
                team2.logo_url ? "hidden" : "inline"
              }`}
            >
              {team2.abbreviation}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 lg:gap-2">
            <button
              onClick={() => handleScoreChange("team2", team2Score - 1)}
              disabled={team2Score <= 0 || isCompleted}
              className="w-6 h-6 lg:w-8 lg:h-8 bg-background text-foreground rounded flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs lg:text-sm"
            >
              -
            </button>
            <span className="w-8 lg:w-12 text-center text-white font-bold text-xs lg:text-sm">
              {team2Score}
            </span>
            <button
              onClick={() => handleScoreChange("team2", team2Score + 1)}
              disabled={team2Score >= 2 || isCompleted}
              className="w-6 h-6 lg:w-8 lg:h-8 bg-background text-foreground rounded flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs lg:text-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
