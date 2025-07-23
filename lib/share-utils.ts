import { LocalPrediction } from './local-storage';

// Encode predictions into a URL-safe string
export function encodePredictions(predictions: LocalPrediction[], region: string): string {
  const shareData = {
    region,
    predictions,
    timestamp: Date.now()
  };
  
  try {
    const jsonString = JSON.stringify(shareData);
    return btoa(jsonString); 
  } catch (error) {
    console.error('Error encoding predictions:', error);
    return '';
  }
}

// Decode predictions from a URL-safe string
export function decodePredictions(encodedData: string): { region: string; predictions: LocalPrediction[] } | null {
  try {
    const jsonString = atob(encodedData); 
    const shareData = JSON.parse(jsonString);
    
    return {
      region: shareData.region,
      predictions: shareData.predictions || []
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
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
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