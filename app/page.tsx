"use client";

import { useState } from "react";
import Header from "./components/Header";
import RegionTabs from "./components/RegionTabs";
import StandingsTable from "./components/StandingsTable";
import MatchSection from "./components/MatchSection";

type Region = "americas" | "emea" | "pacific" | "china";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region>("americas");

  const regions = [
    { id: "americas", name: "Americas" },
    { id: "emea", name: "EMEA" },
    { id: "pacific", name: "Pacific" },
    { id: "china", name: "China" },
  ] as const;

  // Sample data for now
  const groupAStandings = [
    {
      id: "lev",
      name: "Leviatán",
      abbreviation: "LEV",
      position: 1,
      wins: 1,
      losses: 0,
      mapWins: 2,
      mapLosses: 0,
      roundWins: 26,
      roundLosses: 9,
      isQualified: true,
    },
    {
      id: "eg",
      name: "Evil Geniuses",
      abbreviation: "EG",
      position: 2,
      wins: 1,
      losses: 0,
      mapWins: 2,
      mapLosses: 1,
      roundWins: 33,
      roundLosses: 20,
      isQualified: true,
    },
    {
      id: "kru",
      name: "KRÜ Esports",
      abbreviation: "KRU",
      position: 3,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: 0,
      roundLosses: 0,
      isQualified: true,
    },
    {
      id: "loud",
      name: "LOUD",
      abbreviation: "LOUD",
      position: 4,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: 0,
      roundLosses: 0,
      isQualified: true,
    },
    {
      id: "mibr",
      name: "MIBR",
      abbreviation: "MIBR",
      position: 5,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: 0,
      roundLosses: 0,
      isQualified: false,
    },
    {
      id: "sen",
      name: "Sentinels",
      abbreviation: "SEN",
      position: 6,
      wins: 0,
      losses: 2,
      mapWins: 0,
      mapLosses: 3,
      roundWins: 9,
      roundLosses: 26,
      isQualified: false,
    },
  ];

  // Sample data for now
  const groupBStandings = [
    {
      id: "nrg",
      name: "NRG Esports",
      abbreviation: "NRG",
      position: 1,
      wins: 1,
      losses: 0,
      mapWins: 2,
      mapLosses: 0,
      roundWins: 26,
      roundLosses: 9,
      isQualified: true,
    },
    {
      id: "c9",
      name: "Cloud9",
      abbreviation: "C9",
      position: 2,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: 0,
      roundLosses: 0,
      isQualified: true,
    },
    {
      id: "100t",
      name: "100 Thieves",
      abbreviation: "100T",
      position: 3,
      wins: 0,
      losses: 1,
      mapWins: 0,
      mapLosses: 2,
      roundWins: 9,
      roundLosses: 26,
      isQualified: false,
    },
    {
      id: "furia",
      name: "FURIA",
      abbreviation: "FUR",
      position: 4,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: 0,
      roundLosses: 0,
      isQualified: true,
    },
    {
      id: "g2",
      name: "G2 Esports",
      abbreviation: "G2",
      position: 5,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: 0,
      roundLosses: 0,
      isQualified: false,
    },
    {
      id: "liquid",
      name: "Team Liquid",
      abbreviation: "TL",
      position: 6,
      wins: 0,
      losses: 0,
      mapWins: 0,
      mapLosses: 0,
      roundWins: 0,
      roundLosses: 0,
      isQualified: false,
    },
  ];

  // Sample match data for Group Alpha
  const [groupAlphaMatches, setGroupAlphaMatches] = useState([
    {
      id: "sen-vs-lev",
      team1: { id: "sen", name: "Sentinels", abbreviation: "SEN" },
      team2: { id: "lev", name: "Leviatán", abbreviation: "LEV" },
      team1Score: 0,
      team2Score: 2,
    },
    {
      id: "eg-vs-kru",
      team1: { id: "eg", name: "Evil Geniuses", abbreviation: "EG" },
      team2: { id: "kru", name: "KRÜ Esports", abbreviation: "KRU" },
      team1Score: 2,
      team2Score: 1,
    },
    {
      id: "loud-vs-mibr",
      team1: { id: "loud", name: "LOUD", abbreviation: "LOUD" },
      team2: { id: "mibr", name: "MIBR", abbreviation: "MIBR" },
      team1Score: 0,
      team2Score: 0,
    },
  ]);

  // Sample match data for Group Omega
  const [groupOmegaMatches, setGroupOmegaMatches] = useState([
    {
      id: "nrg-vs-100t",
      team1: { id: "nrg", name: "NRG Esports", abbreviation: "NRG" },
      team2: { id: "100t", name: "100 Thieves", abbreviation: "100T" },
      team1Score: 2,
      team2Score: 0,
    },
    {
      id: "c9-vs-fur",
      team1: { id: "c9", name: "Cloud9", abbreviation: "C9" },
      team2: { id: "furia", name: "FURIA", abbreviation: "FUR" },
      team1Score: 0,
      team2Score: 0,
    },
    {
      id: "g2-vs-tl",
      team1: { id: "g2", name: "G2 Esports", abbreviation: "G2" },
      team2: { id: "liquid", name: "Team Liquid", abbreviation: "TL" },
      team1Score: 0,
      team2Score: 0,
    },
  ]);

  const handleResetAll = () => {
    // TODO: Implement reset all functionality
    console.log("Reset all predictions");
  };

  const handleShareLink = () => {
    // TODO: Implement share link functionality
    console.log("Share current predictions");
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleGroupAlphaMatchChange = (
    matchId: string,
    team1Score: number,
    team2Score: number
  ) => {
    setGroupAlphaMatches((prev) =>
      prev.map((match) =>
        match.id === matchId ? { ...match, team1Score, team2Score } : match
      )
    );
  };

  const handleGroupOmegaMatchChange = (
    matchId: string,
    team1Score: number,
    team2Score: number
  ) => {
    setGroupOmegaMatches((prev) =>
      prev.map((match) =>
        match.id === matchId ? { ...match, team1Score, team2Score } : match
      )
    );
  };

  const handleGroupAlphaReset = () => {
    setGroupAlphaMatches((prev) =>
      prev.map((match) => ({ ...match, team1Score: 0, team2Score: 0 }))
    );
  };

  const handleGroupOmegaReset = () => {
    setGroupOmegaMatches((prev) =>
      prev.map((match) => ({ ...match, team1Score: 0, team2Score: 0 }))
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        selectedRegion={
          regions.find((r) => r.id === selectedRegion)?.name || "Americas"
        }
        onResetAll={handleResetAll}
        onShareLink={handleShareLink}
      />

      <RegionTabs
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
      />

      {/* Main Table Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StandingsTable
            title="Group Alpha"
            subtitle="Top 4 teams qualify for playoffs"
            standings={groupAStandings}
          />

          <StandingsTable
            title="Group Omega"
            subtitle="Top 4 teams qualify for playoffs"
            standings={groupBStandings}
          />

          <MatchSection
            title="Group Alpha Matches"
            matches={groupAlphaMatches}
            onMatchScoreChange={handleGroupAlphaMatchChange}
            onReset={handleGroupAlphaReset}
          />

          <MatchSection
            title="Group Omega Matches"
            matches={groupOmegaMatches}
            onMatchScoreChange={handleGroupOmegaMatchChange}
            onReset={handleGroupOmegaReset}
          />
        </div>
      </main>
    </div>
  );
}
