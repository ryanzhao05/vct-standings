import { LocalPrediction } from './local-storage';

// Encode predictions into a URL-safe string 
export function encodePredictions(predictions: LocalPrediction[], region: string): string {
  const compactData = {
    r: region, 
    p: predictions.map(p => [p.matchId, p.team1Score, p.team2Score]) 
  };
  
  try {
    const jsonString = JSON.stringify(compactData);
    return btoa(jsonString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Error encoding predictions:', error);
    return '';
  }
}

// Decode predictions from a URL-safe string
export function decodePredictions(encodedData: string): { region: string; predictions: LocalPrediction[] } | null {
  try {
    // Restore base64 padding and convert back to standard base64
    let paddedData = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    while (paddedData.length % 4) {
      paddedData += '=';
    }
    
    const jsonString = atob(paddedData);
    const compactData = JSON.parse(jsonString);
    
    // Convert back to LocalPrediction format
    const predictions: LocalPrediction[] = compactData.p.map((p: [number, number, number]) => ({
      matchId: p[0],
      team1Score: p[1],
      team2Score: p[2],
      region: compactData.r
    }));
    
    return {
      region: compactData.r,
      predictions: predictions || []
    };
  } catch (error) {
    console.error('Error decoding predictions:', error);
    return null;
  }
}

// Generate a shareable URL
export function generateShareUrl(predictions: LocalPrediction[], region: string): string {
  const encodedData = encodePredictions(predictions, region);
  if (!encodedData) return '';
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}?share=${encodedData}`;
}

// Extract share data from URL parameters
export function extractShareDataFromUrl(): { region: string; predictions: LocalPrediction[] } | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const shareData = urlParams.get('share');
  
  if (!shareData) return null;
  
  return decodePredictions(shareData);
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch (execError) {
      document.body.removeChild(textArea);
      console.error('execCommand failed:', execError);
      return false;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

// Format share data for display
export function formatShareData(predictions: LocalPrediction[]): string {
  if (predictions.length === 0) return 'No predictions to share';
  
  const totalMatches = predictions.length;
  const completedMatches = predictions.filter(p => p.team1Score > 0 || p.team2Score > 0).length;
  
  return `${completedMatches}/${totalMatches} matches predicted`;
} 