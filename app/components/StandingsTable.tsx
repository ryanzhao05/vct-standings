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
}

export default function StandingsTable({
  title,
  subtitle,
  standings,
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
                Maps
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                Rounds
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
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
                    ? "border-l-8 !border-l-emerald-600"
                    : "border-l-8 !border-l-rose-500"
                }`}
              >
                <td className="py-3 px-4 text-sm text-white">
                  {team.position}
                </td>
                <td className="py-3 px-2 text-sm text-white">
                  <div className="flex items-center gap-3">
                    {team.logo_url ? (
                      <div className="relative w-8 h-8">
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
                    <span className="ml-2 font-semibold">{team.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-sm text-white">
                  {team.wins}-{team.losses}
                </td>
                <td className="py-3 px-2 text-sm text-white">
                  {getMapRecord(team)}
                </td>
                <td className="py-3 px-2 text-sm text-white">
                  {getRoundsRecord(team)}
                </td>
                <td
                  className={`py-3 px-2 text-sm ${getDifferentialColor(team)}`}
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
