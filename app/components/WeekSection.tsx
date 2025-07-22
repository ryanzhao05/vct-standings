"use client";

import { useState } from "react";
import MatchPrediction from "./MatchPrediction";
import { MatchWithTeams } from "../../lib/supabase";
import { ChevronDownIcon, ChevronRightIcon, RotateCcwIcon } from "lucide-react";

interface WeekSectionProps {
  title: string;
  matches: MatchWithTeams[];
  onMatchScoreChange: (
    matchId: number,
    team1Score: number,
    team2Score: number
  ) => void;
  onReset: () => void;
}

export default function WeekSection({
  title,
  matches,
  onMatchScoreChange,
  onReset,
}: WeekSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if all matches in this week are completed
  const isWeekCompleted = matches.every((match) => match.is_completed);

  return (
    <div
      className={`bg-card rounded-lg border overflow-hidden ${
        isWeekCompleted ? "border-green-500/30" : "border-border"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer relative"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {isWeekCompleted && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              COMPLETED
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 px-6 pb-4 space-y-4">
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
              isCompleted={match.is_completed}
              onScoreChange={(team1Score, team2Score) =>
                onMatchScoreChange(match.id, team1Score, team2Score)
              }
            />
          ))}
          {!isWeekCompleted && (
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  // Reset predictions for this week's matches only
                  matches.forEach((match) => {
                    onMatchScoreChange(match.id, 0, 0);
                  });
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm cursor-pointer flex items-center gap-2 mx-auto"
              >
                <RotateCcwIcon className="h-4 w-4" />
                Reset Week
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
