import WeekSection from "./WeekSection";
import { MatchWithTeams } from "../../lib/supabase";
import { groupMatchesByWeek } from "../../lib/match-utils";
import { RotateCcwIcon } from "lucide-react";

interface GroupMatchesProps {
  title: string;
  matches: MatchWithTeams[];
  onMatchScoreChange: (
    matchId: number,
    team1Score: number,
    team2Score: number
  ) => void;
  onReset: () => void;
}

export default function GroupMatches({
  title,
  matches,
  onMatchScoreChange,
  onReset,
}: GroupMatchesProps) {
  const weeks = groupMatchesByWeek(matches);

  // Check if all matches in this group are completed
  const isGroupCompleted = matches.every((match) => match.is_completed);

  return (
    <div
      className={`bg-card rounded-lg p-4 lg:p-6 border h-full flex flex-col ${
        isGroupCompleted ? "border-green-500/30" : "border-border"
      }`}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 lg:gap-3">
          <h2 className="text-lg lg:text-xl font-bold text-white">{title}</h2>
          {isGroupCompleted && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              ALL COMPLETED
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 lg:space-y-4 pr-2">
        {weeks.map((week) => (
          <WeekSection
            key={week.week}
            title={week.title}
            matches={week.matches}
            onMatchScoreChange={onMatchScoreChange}
            onReset={onReset}
          />
        ))}
      </div>
    </div>
  );
}
