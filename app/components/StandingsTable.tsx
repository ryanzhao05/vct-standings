interface TeamStanding {
  id: string;
  name: string;
  abbreviation: string;
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
}

export default function StandingsTable({
  title,
  subtitle,
  standings,
}: StandingsTableProps) {
  const getMapDifferential = (team: TeamStanding) => {
    const diff = team.mapWins - team.mapLosses;
    return diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0";
  };

  const getMapRecord = (team: TeamStanding) => {
    return `${team.mapWins}-${team.mapLosses}`;
  };

  const getRoundDifferential = (team: TeamStanding) => {
    const diff = team.roundWins - team.roundLosses;
    return diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0";
  };

  const getDifferentialColor = (team: TeamStanding, type: "map" | "round") => {
    const diff =
      type === "map"
        ? team.mapWins - team.mapLosses
        : team.roundWins - team.roundLosses;

    if (diff > 0) return "text-green-400";
    if (diff < 0) return "text-red-400";
    return "text-white";
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                #
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                Team
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                W-L
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                Map Record
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                Map Diff
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                Round Diff
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr key={team.id} className="border-b border-border/50">
                <td className="py-3 px-2 text-sm text-white">
                  {team.position}
                </td>
                <td className="py-3 px-2 text-sm text-white">
                  {team.abbreviation} {team.name}
                </td>
                <td className="py-3 px-2 text-sm text-white">
                  {team.wins}-{team.losses}
                </td>
                <td className="py-3 px-2 text-sm text-white">
                  {getMapRecord(team)}
                </td>
                <td
                  className={`py-3 px-2 text-sm ${getDifferentialColor(
                    team,
                    "map"
                  )}`}
                >
                  {getMapDifferential(team)}
                </td>
                <td
                  className={`py-3 px-2 text-sm ${getDifferentialColor(
                    team,
                    "round"
                  )}`}
                >
                  {getRoundDifferential(team)}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      team.isQualified
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {team.isQualified ? "Qualified" : "Eliminated"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
