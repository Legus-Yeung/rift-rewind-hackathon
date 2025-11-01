"use client";

import { useState, useEffect } from "react";
import GeneralBarChart from "../_components/generalBarChart";
import GeneralLineChart from "../_components/generalLineChart";
import GeneralPieChart from "../_components/generalPieChart";
import GeneralTable from "../_components/generalTable";
import ShareButton from "../_components/socialLink";

interface MockData {
  playerOverview: {
    summonerName: string;
    rank: string;
    tierProgression: string[];
    totalGames: number;
    wins: number;
    losses: number;
    winRate: number;
  };
  championStats: Array<{
    name: string;
    wins: number;
    played: number;
    winRate: number;
  }>;
  timeline: Array<{
    match: number;
    winRate: number;
  }>;
  monthlyStats: Array<{
    month: string;
    games: number;
    winRate: number;
  }>;
  highlights: {
    mostPlayed: string;
    bestWinRateChampion: string;
    longestWinStreak: number;
    shortestGame: string;
    longestGame: string;
    clutchMatch: string;
    firstPentakill: string;
    mostKillsInGame: number;
  };
  friendsComparison: Array<{
    friend: string;
    totalGames: number;
    winRate: number;
    rank: string;
  }>;
}

export default function DashboardPage() {
  const [mockData, setMockData] = useState<MockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    fetch("/mockData.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMockData(data as MockData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load mock data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!mockData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="text-center">
          <p className="mb-4 text-xl">Failed to load data</p>
          <p className="mb-4 text-gray-400">
            Make sure mockData.json is in the public directory
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const championBarData = mockData.championStats.map((champ) => ({
    name: champ.name,
    wins: champ.wins,
    losses: champ.played - champ.wins,
  }));

  const timelineData = mockData.timeline.map((entry) => ({
    gameNumber: entry.match,
    winRate: entry.winRate,
  }));

  const monthlyData = mockData.monthlyStats.map((month) => ({
    month: month.month,
    games: month.games,
    winRate: month.winRate,
  }));

  const pieChartData = mockData.championStats.slice(0, 5).map((champ) => ({
    name: champ.name,
    played: champ.played,
  }));

  const friendsTableData = mockData.friendsComparison.map((friend) => ({
    friend: friend.friend,
    totalGames: friend.totalGames,
    winRate: `${friend.winRate}%`,
    rank: friend.rank,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">
            {mockData.playerOverview.summonerName}
          </h1>
          <div className="flex items-center justify-center gap-4 text-lg">
            <span className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-1 font-semibold text-black">
              {mockData.playerOverview.rank}
            </span>
            <span>{mockData.playerOverview.totalGames} games</span>
            <span className="text-green-400">
              {mockData.playerOverview.winRate}% win rate
            </span>
          </div>
          <div className="p-6 text-white">
            <button
              onClick={() => setIsShareOpen(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
            >
              Share Profile
            </button>

            {isShareOpen && (
              <ShareButton onClose={() => setIsShareOpen(false)} />
            )}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-900 p-4 text-center">
            <h3 className="mb-1 text-sm text-gray-400">Most Played</h3>
            <p className="text-xl font-bold">
              {mockData.highlights.mostPlayed}
            </p>
          </div>
          <div className="rounded-lg bg-gray-900 p-4 text-center">
            <h3 className="mb-1 text-sm text-gray-400">Best Win Rate</h3>
            <p className="text-xl font-bold">
              {mockData.highlights.bestWinRateChampion}
            </p>
          </div>
          <div className="rounded-lg bg-gray-900 p-4 text-center">
            <h3 className="mb-1 text-sm text-gray-400">Longest Win Streak</h3>
            <p className="text-xl font-bold">
              {mockData.highlights.longestWinStreak}
            </p>
          </div>
          <div className="rounded-lg bg-gray-900 p-4 text-center">
            <h3 className="mb-1 text-sm text-gray-400">Most Kills</h3>
            <p className="text-xl font-bold">
              {mockData.highlights.mostKillsInGame}
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <GeneralBarChart
            title="Champion Win/Loss Distribution"
            xKey="name"
            yKeys={[
              { key: "wins", label: "Wins" },
              { key: "losses", label: "Losses" },
            ]}
            data={championBarData}
          />

          <GeneralPieChart
            title="Champion Play Distribution"
            data={pieChartData}
            dataKey="played"
            nameKey="name"
            colors={["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"]}
            outerRadius={100}
          />
        </div>

        {/* Timeline Charts */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <GeneralLineChart
            title="Win Rate Over Recent Matches"
            xKey={{ key: "gameNumber", label: "Match Number" }}
            yKeys={[{ key: "winRate", label: "Win Rate (%)" }]}
            data={timelineData}
            xType="number"
          />

          <GeneralLineChart
            title="Monthly Performance"
            xKey={{ key: "month", label: "Month" }}
            yKeys={[
              { key: "games", label: "Games Played" },
              { key: "winRate", label: "Win Rate (%)" },
            ]}
            data={monthlyData}
            xType="category"
          />
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-center text-2xl font-bold">
            Friends Comparison
          </h2>
          <div className="rounded-2xl bg-gray-900 p-4">
            <GeneralTable
              data={friendsTableData}
              columns={[
                { key: "friend", label: "Friend" },
                { key: "totalGames", label: "Total Games" },
                { key: "winRate", label: "Win Rate" },
                { key: "rank", label: "Rank" },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-900 p-6">
            <h3 className="mb-4 text-xl font-bold">Game Records</h3>
            <div className="space-y-2">
              <p>
                <span className="text-gray-400">Shortest Game:</span>{" "}
                {mockData.highlights.shortestGame}
              </p>
              <p>
                <span className="text-gray-400">Longest Game:</span>{" "}
                {mockData.highlights.longestGame}
              </p>
              <p>
                <span className="text-gray-400">First Pentakill:</span>{" "}
                {mockData.highlights.firstPentakill}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-gray-900 p-6">
            <h3 className="mb-4 text-xl font-bold">Rank Progression</h3>
            <div className="flex items-center gap-2">
              {mockData.playerOverview.tierProgression.map((tier, index) => (
                <div key={tier} className="flex items-center">
                  <span className="rounded bg-gradient-to-r from-yellow-400 to-yellow-600 px-2 py-1 text-sm font-semibold text-black">
                    {tier}
                  </span>
                  {index <
                    mockData.playerOverview.tierProgression.length - 1 && (
                    <span className="mx-2 text-gray-400">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
