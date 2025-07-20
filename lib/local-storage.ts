// Local storage functions for user-specific predictions
export interface LocalPrediction {
  matchId: number;
  team1Score: number;
  team2Score: number;
  region: string;
}

// Get all predictions for a region
export function getPredictionsForRegion(region: string): LocalPrediction[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(`vct-predictions-${region}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading predictions from localStorage:', error);
    return [];
  }
}

// Save a prediction for a specific match
export function savePrediction(
  matchId: number,
  team1Score: number,
  team2Score: number,
  region: string
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const predictions = getPredictionsForRegion(region);
    const existingIndex = predictions.findIndex(p => p.matchId === matchId);
    
    if (existingIndex >= 0) {
      // Update existing prediction
      predictions[existingIndex] = {
        matchId,
        team1Score,
        team2Score,
        region,
      };
    } else {
      // Add new prediction
      predictions.push({
        matchId,
        team1Score,
        team2Score,
        region,
      });
    }
    
    localStorage.setItem(`vct-predictions-${region}`, JSON.stringify(predictions));
  } catch (error) {
    console.error('Error saving prediction to localStorage:', error);
  }
}

// Delete a prediction for a specific match
export function deletePrediction(matchId: number, region: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const predictions = getPredictionsForRegion(region);
    const filtered = predictions.filter(p => p.matchId !== matchId);
    localStorage.setItem(`vct-predictions-${region}`, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting prediction from localStorage:', error);
  }
}

// Delete all predictions for a region
export function deleteAllPredictions(region: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`vct-predictions-${region}`);
  } catch (error) {
    console.error('Error deleting all predictions from localStorage:', error);
  }
}

// Get prediction for a specific match
export function getPredictionForMatch(matchId: number, region: string): LocalPrediction | null {
  const predictions = getPredictionsForRegion(region);
  return predictions.find(p => p.matchId === matchId) || null;
} 