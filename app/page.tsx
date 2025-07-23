"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import RegionTabs from "./components/RegionTabs";
import StandingsTable from "./components/StandingsTable";
import GroupMatches from "./components/GroupMatches";
import Notification from "./components/Notification";
import { calculateStandings } from "../lib/standings-calculator";
import { getTeamsByRegion, getMatchesByRegion } from "../lib/supabase-data";
import { dataCache } from "../lib/data-cache";
import {
  getPredictionsForRegion,
  savePrediction,
  deleteAllPredictions,
} from "../lib/local-storage";
import {
  generateShareUrl,
  copyToClipboard,
  extractShareDataFromUrl,
  formatShareData,
} from "../lib/share-utils";
import { Team, MatchWithTeams } from "../lib/supabase";

type Region = "americas" | "emea" | "pacific" | "china";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region>("americas");
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<{
    [key: number]: { team1Score: number; team2Score: number };
  }>({});
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({ message: "", type: "success", isVisible: false });

  const regions = [
    { id: "americas", name: "Americas" },
    { id: "emea", name: "EMEA" },
    { id: "pacific", name: "Pacific" },
    { id: "china", name: "China" },
  ] as const;

  // Preload data for other regions in the background
  useEffect(() => {
    const preloadOtherRegions = async () => {
      const otherRegions = regions.filter((r) => r.id !== selectedRegion);

      for (const region of otherRegions) {
        // Only preload if not already cached
        if (!dataCache.hasCachedData(region.id)) {
          try {
            const [teamsData, matchesData] = await Promise.all([
              getTeamsByRegion(region.id),
              getMatchesByRegion(region.id),
            ]);

            dataCache.setTeams(region.id, teamsData);
            dataCache.setMatches(region.id, matchesData);
          } catch (error) {
            console.error(`Error preloading data for ${region.id}:`, error);
          }
        }
      }
    };

    // Preload after a short delay to not interfere with current region loading
    const timer = setTimeout(preloadOtherRegions, 1000);
    return () => clearTimeout(timer);
  }, [selectedRegion]);

  useEffect(() => {
    const shareData = extractShareDataFromUrl();
    if (shareData) {
      setSelectedRegion(shareData.region as Region);

      // Convert predictions to the format expected by the app
      const predictionsMap: {
        [key: number]: { team1Score: number; team2Score: number };
      } = {};
      shareData.predictions.forEach((pred) => {
        predictionsMap[pred.matchId] = {
          team1Score: pred.team1Score,
          team2Score: pred.team2Score,
        };
      });
      setPredictions(predictionsMap);

      shareData.predictions.forEach((pred) => {
        savePrediction(
          pred.matchId,
          pred.team1Score,
          pred.team2Score,
          pred.region
        );
      });

      // Clear the URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("share");
      window.history.replaceState({}, "", url.toString());

      setNotification({
        message: `Imported ${shareData.predictions.length} predictions`,
        type: "success",
        isVisible: true,
      });
    }
  }, []);

  // Fetch data when region changes
  useEffect(() => {
    async function fetchData() {
      // Check if we have cached data
      const cachedTeams = dataCache.getTeams(selectedRegion);
      const cachedMatches = dataCache.getMatches(selectedRegion);

      if (cachedTeams && cachedMatches) {
        // Use cached data
        setTeams(cachedTeams);
        setMatches(cachedMatches);
      } else {
        // Fetch fresh data
        setLoading(true);
        try {
          const [teamsData, matchesData] = await Promise.all([
            getTeamsByRegion(selectedRegion),
            getMatchesByRegion(selectedRegion),
          ]);

          // Cache the data
          dataCache.setTeams(selectedRegion, teamsData);
          dataCache.setMatches(selectedRegion, matchesData);

          setTeams(teamsData);
          setMatches(matchesData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }

      // Load user's predictions for this region
      const userPredictions = getPredictionsForRegion(selectedRegion);
      const predictionsMap: {
        [key: number]: { team1Score: number; team2Score: number };
      } = {};
      userPredictions.forEach((pred) => {
        predictionsMap[pred.matchId] = {
          team1Score: pred.team1Score,
          team2Score: pred.team2Score,
        };
      });
      setPredictions(predictionsMap);
    }

    fetchData();
  }, [selectedRegion]);

  // Group teams by their group
  const groupAlphaTeams = teams.filter((team) => team.group_name === "alpha");
  const groupOmegaTeams = teams.filter((team) => team.group_name === "omega");

  // Group matches by their group and merge with user predictions
  const groupAlphaMatches = matches
    .filter((match) =>
      groupAlphaTeams.some(
        (team) => team.id === match.team1_id || team.id === match.team2_id
      )
    )
    .map((match) => ({
      ...match,
      team1_score: predictions[match.id]?.team1Score ?? match.team1_score,
      team2_score: predictions[match.id]?.team2Score ?? match.team2_score,
    }));

  const groupOmegaMatches = matches
    .filter((match) =>
      groupOmegaTeams.some(
        (team) => team.id === match.team1_id || team.id === match.team2_id
      )
    )
    .map((match) => ({
      ...match,
      team1_score: predictions[match.id]?.team1Score ?? match.team1_score,
      team2_score: predictions[match.id]?.team2Score ?? match.team2_score,
    }));

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
    // Delete all predictions for current region
    deleteAllPredictions(selectedRegion);
    setPredictions({});
  };

  const handleShareLink = async () => {
    try {
      // Get current predictions for the selected region
      const currentPredictions = getPredictionsForRegion(selectedRegion);

      if (currentPredictions.length === 0) {
        setNotification({
          message: "No predictions to share. Make some predictions first!",
          type: "error",
          isVisible: true,
        });
        return;
      }

      // Generate share URL
      const shareUrl = generateShareUrl(currentPredictions, selectedRegion);

      if (!shareUrl) {
        setNotification({
          message: "Failed to generate share link",
          type: "error",
          isVisible: true,
        });
        return;
      }

      // Copy to clipboard
      const success = await copyToClipboard(shareUrl);

      if (success) {
        setNotification({
          message: "Share link copied to clipboard!",
          type: "success",
          isVisible: true,
        });
      } else {
        setNotification({
          message: "Failed to copy to clipboard. Please copy manually.",
          type: "error",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error sharing predictions:", error);
      setNotification({
        message: "Failed to share predictions",
        type: "error",
        isVisible: true,
      });
    }
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleMatchScoreChange = (
    matchId: number,
    team1Score: number,
    team2Score: number
  ) => {
    // Save prediction to local storage
    savePrediction(matchId, team1Score, team2Score, selectedRegion);

    // Update local state
    setPredictions((prev) => ({
      ...prev,
      [matchId]: { team1Score, team2Score },
    }));
  };

  const handleGroupReset = (groupMatches: MatchWithTeams[]) => {
    // Delete predictions for matches in this group
    groupMatches.forEach((match) => {
      deleteAllPredictions(selectedRegion);
    });
    setPredictions({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">
            Loading {regions.find((r) => r.id === selectedRegion)?.name} data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />
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

          <div className="h-[600px]">
            <GroupMatches
              title="Group Alpha Matches"
              matches={groupAlphaMatches}
              onMatchScoreChange={handleMatchScoreChange}
              onReset={() => handleGroupReset(groupAlphaMatches)}
            />
          </div>

          <div className="h-[600px]">
            <GroupMatches
              title="Group Omega Matches"
              matches={groupOmegaMatches}
              onMatchScoreChange={handleMatchScoreChange}
              onReset={() => handleGroupReset(groupOmegaMatches)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
