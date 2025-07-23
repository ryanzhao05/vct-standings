import { Team, MatchWithTeams } from './supabase';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface DataCache {
  teams: { [region: string]: CacheEntry<Team[]> };
  matches: { [region: string]: CacheEntry<MatchWithTeams[]> };
}

const CACHE_DURATION = 5 * 60 * 1000;

class DataCacheManager {
  private cache: DataCache = {
    teams: {},
    matches: {}
  };

  // Check if cache entry is valid
  private isCacheValid(entry: CacheEntry<Team[] | MatchWithTeams[]> | undefined): boolean {
    if (!entry) return false;
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }

  // Get cached teams for a region
  getTeams(region: string): Team[] | null {
    const entry = this.cache.teams[region];
    if (this.isCacheValid(entry)) {
      return entry.data;
    }
    return null;
  }

  // Get cached matches for a region
  getMatches(region: string): MatchWithTeams[] | null {
    const entry = this.cache.matches[region];
    if (this.isCacheValid(entry)) {
      return entry.data;
    }
    return null;
  }

  // Cache teams for a region
  setTeams(region: string, teams: Team[]): void {
    this.cache.teams[region] = {
      data: teams,
      timestamp: Date.now()
    };
  }

  // Cache matches for a region
  setMatches(region: string, matches: MatchWithTeams[]): void {
    this.cache.matches[region] = {
      data: matches,
      timestamp: Date.now()
    };
  }

  // Clear cache for a specific region
  clearRegion(region: string): void {
    delete this.cache.teams[region];
    delete this.cache.matches[region];
  }

  // Clear all cache
  clearAll(): void {
    this.cache = {
      teams: {},
      matches: {}
    };
  }

  // Check if we have cached data for a region
  hasCachedData(region: string): boolean {
    return this.isCacheValid(this.cache.teams[region]) && 
           this.isCacheValid(this.cache.matches[region]);
  }
}

export const dataCache = new DataCacheManager(); 