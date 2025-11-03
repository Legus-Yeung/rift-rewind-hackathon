import type { YearEndSummaryData } from "./year-end-summary.types";

/**
 * Placeholder data for year-end summary
 * This represents a comprehensive dataset for a player's full year of League of Legends gameplay
 */
export const placeholderYearEndData: YearEndSummaryData = {
  year: 2024,
  yearStartDate: "2024-01-01",
  yearEndDate: "2024-12-31",
  
  playerOverview: {
    summonerName: "RiftMaster",
    tagLine: "NA1",
    currentRank: "Challenger",
    currentTier: "I",
    startingRank: "Diamond IV",
    tierProgression: [
      "Diamond IV",
      "Diamond III",
      "Diamond II",
      "Diamond I",
      "Master",
      "Grandmaster",
      "Challenger"
    ],
    rankChange: "Diamond IV → Challenger",
    totalGames: 784,
    wins: 458,
    losses: 326,
    winRate: 58.4,
    averageKDA: 2.8,
  },

  championStats: [
    {
      name: "Riven",
      played: 399,
      wins: 260,
      losses: 139,
      winRate: 65.2,
      averageKDA: 3.2,
      averageKills: 8.5,
      averageDeaths: 4.2,
      averageAssists: 4.9,
      totalDamageDealt: 15200000,
      totalDamageTaken: 8900000,
      totalGoldEarned: 7800000,
      bestMatch: {
        matchId: "NA1_1234567890",
        kills: 27,
        deaths: 2,
        assists: 12,
        win: true,
      },
    },
    {
      name: "Kayle",
      played: 64,
      wins: 40,
      losses: 24,
      winRate: 62.5,
      averageKDA: 3.5,
      averageKills: 9.2,
      averageDeaths: 3.8,
      averageAssists: 4.1,
      totalDamageDealt: 2100000,
      totalDamageTaken: 1200000,
      totalGoldEarned: 1300000,
    },
    {
      name: "Vayne",
      played: 74,
      wins: 40,
      losses: 34,
      winRate: 54.1,
      averageKDA: 2.9,
      averageKills: 10.1,
      averageDeaths: 5.3,
      averageAssists: 5.3,
      totalDamageDealt: 3100000,
      totalDamageTaken: 2100000,
      totalGoldEarned: 1900000,
    },
    {
      name: "Yasuo",
      played: 90,
      wins: 35,
      losses: 55,
      winRate: 38.9,
      averageKDA: 2.1,
      averageKills: 7.8,
      averageDeaths: 6.2,
      averageAssists: 5.2,
      totalDamageDealt: 2800000,
      totalDamageTaken: 2400000,
      totalGoldEarned: 2200000,
    },
    {
      name: "Sett",
      played: 120,
      wins: 50,
      losses: 70,
      winRate: 41.7,
      averageKDA: 2.3,
      averageKills: 6.5,
      averageDeaths: 5.1,
      averageAssists: 6.2,
      totalDamageDealt: 3500000,
      totalDamageTaken: 4200000,
      totalGoldEarned: 3000000,
    },
  ],

  monthlyStats: [
    { month: "January", games: 45, wins: 27, losses: 18, winRate: 60.0, averageKDA: 2.6, rank: "Diamond IV" },
    { month: "February", games: 62, wins: 34, losses: 28, winRate: 54.8, averageKDA: 2.5, rank: "Diamond III" },
    { month: "March", games: 50, wins: 31, losses: 19, winRate: 62.0, averageKDA: 2.9, rank: "Diamond II" },
    { month: "April", games: 41, wins: 21, losses: 20, winRate: 51.2, averageKDA: 2.4, bestChampion: "Riven", rank: "Diamond II" },
    { month: "May", games: 70, wins: 43, losses: 27, winRate: 61.4, averageKDA: 2.8, bestChampion: "Riven", rank: "Diamond I" },
    { month: "June", games: 89, wins: 53, losses: 36, winRate: 59.6, averageKDA: 2.9, bestChampion: "Riven", rank: "Diamond I" },
    { month: "July", games: 80, wins: 45, losses: 35, winRate: 56.3, averageKDA: 2.7, rank: "Master" },
    { month: "August", games: 95, wins: 57, losses: 38, winRate: 60.0, averageKDA: 3.0, bestChampion: "Riven", rank: "Master" },
    { month: "September", games: 100, wins: 58, losses: 42, winRate: 58.0, averageKDA: 2.8, rank: "Grandmaster" },
    { month: "October", games: 92, wins: 51, losses: 41, winRate: 55.4, averageKDA: 2.7, rank: "Grandmaster" },
    { month: "November", games: 60, wins: 37, losses: 23, winRate: 61.7, averageKDA: 3.1, bestChampion: "Kayle", rank: "Grandmaster" },
    { month: "December", games: 50, wins: 32, losses: 18, winRate: 64.0, averageKDA: 3.2, bestChampion: "Riven", rank: "Challenger" },
  ],

  timeline: [
    { matchNumber: 1, winRate: 45.0, rank: "Diamond IV" },
    { matchNumber: 100, winRate: 52.0, rank: "Diamond III" },
    { matchNumber: 200, winRate: 55.0, rank: "Diamond II" },
    { matchNumber: 300, winRate: 58.0, rank: "Diamond I" },
    { matchNumber: 400, winRate: 60.0, rank: "Master" },
    { matchNumber: 500, winRate: 59.0, rank: "Master" },
    { matchNumber: 600, winRate: 60.0, rank: "Grandmaster" },
    { matchNumber: 700, winRate: 58.5, rank: "Challenger" },
    { matchNumber: 784, winRate: 58.4, rank: "Challenger" },
  ],

  highlights: {
    mostPlayedChampion: "Riven",
    bestWinRateChampion: "Kayle (62.5%)",
    longestWinStreak: 12,
    longestLossStreak: 5,
    shortestGame: {
      duration: "18m 23s",
      champion: "Vayne",
      matchId: "NA1_9876543210",
    },
    longestGame: {
      duration: "54m 12s",
      champion: "Yasuo",
      matchId: "NA1_1122334455",
    },
    highestKillsGame: {
      kills: 27,
      champion: "Riven",
      matchId: "NA1_1234567890",
    },
    highestAssistsGame: {
      assists: 28,
      champion: "Sett",
      matchId: "NA1_2233445566",
    },
    perfectKDAGames: 12,
    firstPentakill: {
      champion: "Riven",
      date: "2024-04-15",
      matchId: "NA1_3344556677",
    },
    totalPentakills: 3,
    clutchMatches: [
      {
        matchId: "NA1_4455667788",
        description: "1v5 Quadra Kill to secure Baron and win",
        opponentRank: "Challenger",
      },
      {
        matchId: "NA1_5566778899",
        description: "Backdoor Nexus kill with 10 HP remaining",
        opponentRank: "Grandmaster",
      },
    ],
    mostImprovedMonth: "November",
    bestMonth: "December",
  },

  positionStats: [
    {
      position: "TOP",
      games: 520,
      wins: 310,
      losses: 210,
      winRate: 59.6,
      averageKDA: 2.9,
      mostPlayedChampion: "Riven",
    },
    {
      position: "MIDDLE",
      games: 180,
      wins: 95,
      losses: 85,
      winRate: 52.8,
      averageKDA: 2.6,
      mostPlayedChampion: "Yasuo",
    },
    {
      position: "BOTTOM",
      games: 84,
      wins: 53,
      losses: 31,
      winRate: 63.1,
      averageKDA: 3.1,
      mostPlayedChampion: "Vayne",
    },
  ],

  friendsComparison: [
    {
      friendName: "Heisenberg",
      friendTagLine: "NA1",
      totalGames: 500,
      winRate: 52.1,
      rank: "Master",
      comparison: "better",
    },
    {
      friendName: "RavenCat",
      friendTagLine: "NA1",
      totalGames: 300,
      winRate: 60.3,
      rank: "Grandmaster",
      comparison: "similar",
    },
    {
      friendName: "LuxMain",
      friendTagLine: "NA1",
      totalGames: 250,
      winRate: 49.8,
      rank: "Diamond I",
      comparison: "better",
    },
  ],

  strengths: [
    {
      category: "Champion Mastery",
      description: "Exceptional performance on Riven with 65.2% win rate over 399 games",
      evidence: [
        "399 games played on Riven",
        "65.2% win rate",
        "27 kill game record",
        "3.2 average KDA",
      ],
      rating: 9,
    },
    {
      category: "Rank Progression",
      description: "Climbed from Diamond IV to Challenger throughout the year",
      evidence: [
        "7 rank tiers improved",
        "Consistent upward trajectory",
        "58.4% overall win rate",
      ],
      rating: 10,
    },
    {
      category: "Team Fighting",
      description: "High assist numbers and clutch plays in team fights",
      evidence: [
        "28 assist game record",
        "Multiple clutch match victories",
        "Strong late game performance",
      ],
      rating: 8,
    },
    {
      category: "Consistency",
      description: "Maintained positive win rate throughout all months",
      evidence: [
        "No month below 50% win rate",
        "Consistent KDA across months",
        "Steady game count",
      ],
      rating: 8,
    },
  ],

  areasForImprovement: [
    {
      category: "Champion Diversity",
      description: "Heavy reliance on Riven (51% of games) may limit adaptability",
      impact: "medium",
      suggestions: [
        "Expand champion pool to 3-4 top champions",
        "Practice counter-picks for difficult matchups",
        "Learn at least one champion per role",
      ],
    },
    {
      category: "Yasuo Performance",
      description: "38.9% win rate on Yasuo suggests matchup knowledge gaps",
      impact: "high",
      suggestions: [
        "Review Yasuo matchups and identify weaknesses",
        "Consider reducing Yasuo picks in ranked",
        "Focus on safe farming and team fight positioning",
      ],
    },
    {
      category: "Early Game",
      description: "Some games show vulnerability in early laning phase",
      impact: "medium",
      suggestions: [
        "Improve wave management and CS",
        "Better jungle pathing awareness",
        "Practice early game trading patterns",
      ],
    },
    {
      category: "Vision Control",
      description: "Average vision score could be improved for higher elo",
      impact: "low",
      suggestions: [
        "Increase control ward purchases",
        "Better ward placement timing",
        "Track enemy jungler through vision",
      ],
    },
  ],

  achievements: [
    {
      title: "Rank Climber",
      description: "Climbed from Diamond IV to Challenger",
      rarity: "legendary",
      date: "2024-12-15",
    },
    {
      title: "Riven Master",
      description: "399 games with 65.2% win rate on Riven",
      rarity: "epic",
    },
    {
      title: "Pentakill Hero",
      description: "Achieved 3 pentakills this year",
      rarity: "rare",
    },
    {
      title: "Win Streak Champion",
      description: "12 game win streak",
      rarity: "epic",
    },
    {
      title: "Consistent Performer",
      description: "Positive win rate every single month",
      rarity: "rare",
    },
    {
      title: "Clutch Player",
      description: "Multiple game-winning plays in high-pressure situations",
      rarity: "uncommon",
    },
  ],
};

