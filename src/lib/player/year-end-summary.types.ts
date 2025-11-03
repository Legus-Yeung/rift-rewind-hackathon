/**
 * Year-End Summary Data Types
 * Comprehensive data structure for League of Legends player year-end summaries
 */

export interface PlayerOverview {
  summonerName: string;
  tagLine: string;
  currentRank: string;
  currentTier?: string; // e.g., "I", "II", "III", "IV"
  tierProgression: string[]; // Rank progression throughout the year
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  averageKDA: number;
  startingRank?: string; // Rank at the beginning of the year
  rankChange?: string; // e.g., "Diamond IV → Challenger"
}

export interface ChampionStats {
  name: string;
  played: number;
  wins: number;
  losses: number;
  winRate: number;
  averageKDA: number;
  averageKills: number;
  averageDeaths: number;
  averageAssists: number;
  totalDamageDealt?: number;
  totalDamageTaken?: number;
  totalGoldEarned?: number;
  bestMatch?: {
    matchId: string;
    kills: number;
    deaths: number;
    assists: number;
    win: boolean;
  };
}

export interface MonthlyStats {
  month: string;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  averageKDA: number;
  bestChampion?: string;
  rank?: string;
}

export interface TimelineEntry {
  matchNumber: number;
  winRate: number;
  rank?: string;
  timestamp?: number;
}

export interface Highlights {
  mostPlayedChampion: string;
  bestWinRateChampion: string;
  longestWinStreak: number;
  longestLossStreak?: number;
  shortestGame: {
    duration: string;
    champion: string;
    matchId?: string;
  };
  longestGame: {
    duration: string;
    champion: string;
    matchId?: string;
  };
  highestKillsGame: {
    kills: number;
    champion: string;
    matchId?: string;
  };
  highestAssistsGame?: {
    assists: number;
    champion: string;
    matchId?: string;
  };
  perfectKDAGames?: number; // Games with 0 deaths
  firstPentakill?: {
    champion: string;
    date: string;
    matchId?: string;
  };
  totalPentakills?: number;
  clutchMatches?: Array<{
    matchId: string;
    description: string;
    opponentRank?: string;
  }>;
  mostImprovedMonth?: string;
  bestMonth?: string;
}

export interface PositionStats {
  position: string; // TOP, JUNGLE, MIDDLE, BOTTOM, UTILITY
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  averageKDA: number;
  mostPlayedChampion?: string;
}

export interface FriendComparison {
  friendName: string;
  friendTagLine: string;
  totalGames: number;
  winRate: number;
  rank: string;
  comparison?: "better" | "worse" | "similar";
}

export interface Strengths {
  category: string; // e.g., "Team Fighting", "Objective Control", "Lane Dominance"
  description: string;
  evidence: string[];
  rating: number; // 1-10 scale
}

export interface AreasForImprovement {
  category: string; // e.g., "Early Game", "Vision", "Map Awareness"
  description: string;
  impact: "high" | "medium" | "low";
  suggestions: string[];
}

export interface Achievement {
  title: string;
  description: string;
  date?: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  icon?: string;
}

export interface YearEndSummaryData {
  playerOverview: PlayerOverview;
  championStats: ChampionStats[];
  monthlyStats: MonthlyStats[];
  timeline: TimelineEntry[];
  highlights: Highlights;
  positionStats: PositionStats[];
  friendsComparison?: FriendComparison[];
  strengths: Strengths[];
  areasForImprovement: AreasForImprovement[];
  achievements: Achievement[];
  year: number; // e.g., 2024
  yearStartDate?: string;
  yearEndDate?: string;
}

