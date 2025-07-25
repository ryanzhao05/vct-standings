import Image from "next/image";

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

interface StandingsTableProps {
  title: string;
  subtitle: string;
  standings: TeamStanding[];
  hasPredictions?: boolean;
  predictionCount?: number;
}

export default function StandingsTable({
  title,
  subtitle,
  standings,
  hasPredictions = false,
  predictionCount = 0,
}: StandingsTableProps) {
  const getMapRecord = (team: TeamStanding) => {
    return `${team.mapWins}-${team.mapLosses}`;
  };

  const getRoundsRecord = (team: TeamStanding) => {
    return `${team.roundWins}/${team.roundLosses}`;
  };

  const getRoundDifferential = (team: TeamStanding) => {
    const diff = team.roundWins - team.roundLosses;
    return diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0";
  };

  const getDifferentialColor = (team: TeamStanding) => {
    const diff = team.roundWins - team.roundLosses;

    if (diff > 0) return "text-green-400";
    if (diff < 0) return "text-red-400";
    return "text-white";
  };

  return (
    <div
      className={`rounded-lg p-4 lg:p-6 border border-border ${
        hasPredictions
          ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30"
          : "bg-card"
      }`}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between min-h-[60px] lg:min-h-[80px]">
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-white">{title}</h2>
            <p className="text-xs lg:text-sm text-gray-400">{subtitle}</p>
          </div>

          {hasPredictions ? (
            <div className="flex flex-col sm:flex-row items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg min-w-[120px]">
              <div className="text-center sm:text-right flex-1">
                <div className="text-xs font-semibold text-blue-300 flex items-center justify-center sm:justify-end gap-1">
                  <span className="text-blue-400 text-sm">🔮</span>
                  PREDICTED STANDINGS
                </div>
                <div className="text-xs text-blue-200">
                  {predictionCount} match{predictionCount !== 1 ? "es" : ""}{" "}
                  predicted
                </div>
              </div>
            </div>
          ) : (
            <div className="min-w-[120px]"></div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm font-medium text-gray-400">
                #
              </th>
              <th className="text-left py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm font-medium text-gray-400">
                Team
              </th>
              <th className="text-left py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm font-medium text-gray-400">
                W-L
              </th>
              <th className="text-left py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm font-medium text-gray-400">
                Maps
              </th>
              <th className="text-left py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm font-medium text-gray-400">
                Rounds
              </th>
              <th className="text-left py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm font-medium text-gray-400">
                Round Diff
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr
                key={team.id}
                className={`border-b border-border/50 relative ${
                  team.isQualified
                    ? "border-l-4 lg:border-l-8 !border-l-emerald-600"
                    : "border-l-4 lg:border-l-8 !border-l-rose-500"
                }`}
              >
                <td className="py-2 lg:py-3 px-2 lg:px-4 text-xs lg:text-sm text-white">
                  {team.position}
                </td>
                <td className="py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm text-white">
                  <div className="flex items-center gap-2 lg:gap-3">
                    {team.logo_url ? (
                      <div className="relative w-6 h-6 lg:w-8 lg:h-8">
                        <Image
                          src={team.logo_url}
                          alt={`${team.name} logo`}
                          fill
                          className="object-contain"
                          onError={() => {
                            // Fallback is handled by the span below
                          }}
                        />
                      </div>
                    ) : null}
                    <span className={team.logo_url ? "hidden" : "inline"}>
                      {team.abbreviation ||
                        team.name.substring(0, 3).toUpperCase()}
                    </span>
                    <span className="ml-1 lg:ml-2 font-semibold truncate max-w-[80px] lg:max-w-none">
                      {team.name}
                    </span>
                  </div>
                </td>
                <td className="py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm text-white font-extrabold">
                  {team.wins}-{team.losses}
                </td>
                <td className="py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm text-white">
                  {getMapRecord(team)}
                </td>
                <td className="py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm text-white">
                  {getRoundsRecord(team)}
                </td>
                <td
                  className={`py-2 lg:py-3 px-1 lg:px-2 text-xs lg:text-sm ${getDifferentialColor(
                    team
                  )}`}
                >
                  {getRoundDifferential(team)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
