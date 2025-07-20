"use client";

import { useState } from "react";
import Header from "./components/Header";
import RegionTabs from "./components/RegionTabs";
import StandingsTable from "./components/StandingsTable";
import MatchSection from "./components/MatchSection";
import { calculateStandings } from "../lib/standings-calculator";

type Region = "americas" | "emea" | "pacific" | "china";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region>("americas");

  const regions = [
    { id: "americas", name: "Americas" },
    { id: "emea", name: "EMEA" },
    { id: "pacific", name: "Pacific" },
    { id: "china", name: "China" },
  ] as const;

  const groupAlphaTeams = [
    { id: "lev", name: "Leviatán", abbreviation: "LEV" },
    { id: "eg", name: "Evil Geniuses", abbreviation: "EG" },
    { id: "kru", name: "KRÜ Esports", abbreviation: "KRU" },
    { id: "loud", name: "LOUD", abbreviation: "LOUD" },
    { id: "mibr", name: "MIBR", abbreviation: "MIBR" },
    { id: "sen", name: "Sentinels", abbreviation: "SEN" },
  ];

  const groupOmegaTeams = [
    { id: "nrg", name: "NRG Esports", abbreviation: "NRG" },
    { id: "c9", name: "Cloud9", abbreviation: "C9" },
    { id: "100t", name: "100 Thieves", abbreviation: "100T" },
    { id: "furia", name: "FURIA", abbreviation: "FUR" },
    { id: "g2", name: "G2 Esports", abbreviation: "G2" },
    { id: "liquid", name: "Team Liquid", abbreviation: "TL" },
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

  // Calculate standings based on current match predictions
  const groupAlphaStandings = calculateStandings(
    groupAlphaTeams,
    groupAlphaMatches
  );
  const groupOmegaStandings = calculateStandings(
    groupOmegaTeams,
    groupOmegaMatches
  );

  const handleResetAll = () => {
    // Reset all match predictions
    setGroupAlphaMatches((prev) =>
      prev.map((match) => ({ ...match, team1Score: 0, team2Score: 0 }))
    );
    setGroupOmegaMatches((prev) =>
      prev.map((match) => ({ ...match, team1Score: 0, team2Score: 0 }))
    );
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
            standings={groupAlphaStandings}
          />

          <StandingsTable
            title="Group Omega"
            subtitle="Top 4 teams qualify for playoffs"
            standings={groupOmegaStandings}
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
