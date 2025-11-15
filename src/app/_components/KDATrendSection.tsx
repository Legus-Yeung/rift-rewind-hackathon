"use client";

import React from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface ChampionKDA {
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  games: number;
}

interface KDATrendSectionProps {
  championKDAs: ChampionKDA[];
}

export function KDATrendSection({ championKDAs }: KDATrendSectionProps) {
  // Sort by games played and take top 8
  const topChampions = [...championKDAs]
    .sort((a, b) => b.games - a.games)
    .slice(0, 8);

  const chartData = topChampions.map((champ) => ({
    name: champ.name,
    KDA: parseFloat(champ.kda.toFixed(2)),
    Kills: parseFloat((champ.kills / champ.games).toFixed(1)),
    Deaths: parseFloat((champ.deaths / champ.games).toFixed(1)),
    Assists: parseFloat((champ.assists / champ.games).toFixed(1)),
    games: champ.games,
  }));

  const getKDAColor = (kda: number) => {
    if (kda >= 5) return "hsl(40, 45%, 61%)"; // Gold
    if (kda >= 3) return "hsl(0, 70%, 45%)"; // Red
    if (kda >= 2) return "hsl(0, 75%, 55%)"; // Light Red
    return "hsl(0, 5%, 60%)"; // Gray
  };

  const bestKDA = Math.max(...topChampions.map((c) => c.kda));
  const worstKDA = Math.min(...topChampions.map((c) => c.kda));
  const avgKDA =
    topChampions.reduce((sum, c) => sum + c.kda, 0) / topChampions.length;

  return (
    <section id="kda-trend" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-primary h-8 w-8" />
            <h2 className="text-foreground text-3xl font-bold tracking-wide uppercase">
              Performance Analysis
            </h2>
          </div>
          <div className="bg-primary mt-2 h-1 w-20"></div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-card border-noxus-gold hover:shadow-noxus-gold/30 border-2 p-6 transition-all duration-300 hover:shadow-xl">
            <div className="mb-3 flex items-center gap-3">
              <TrendingUp className="text-noxus-gold h-6 w-6" />
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Best KDA
              </p>
            </div>
            <p className="text-noxus-gold text-4xl font-bold">
              {bestKDA.toFixed(2)}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              {topChampions.find((c) => c.kda === bestKDA)?.name}
            </p>
          </div>

          <div className="bg-card border-primary hover:shadow-primary/30 border-2 p-6 transition-all duration-300 hover:shadow-xl">
            <div className="mb-3 flex items-center gap-3">
              <BarChart3 className="text-primary h-6 w-6" />
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Average KDA
              </p>
            </div>
            <p className="text-primary text-4xl font-bold">
              {avgKDA.toFixed(2)}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Across {topChampions.length} champions
            </p>
          </div>

          <div className="bg-card border-border hover:shadow-primary/20 border-2 p-6 transition-all duration-300 hover:shadow-xl">
            <div className="mb-3 flex items-center gap-3">
              <BarChart3 className="text-muted-foreground h-6 w-6" />
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Lowest KDA
              </p>
            </div>
            <p className="text-muted-foreground text-4xl font-bold">
              {worstKDA.toFixed(2)}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              {topChampions.find((c) => c.kda === worstKDA)?.name}
            </p>
          </div>
        </div>

        <div className="bg-card border-border mb-8 border-2 p-6">
          <h3 className="text-foreground mb-6 text-xl font-bold tracking-wide uppercase">
            KDA by Champion (Top 8 Most Played)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 20%, 20%)" />
              <XAxis
                dataKey="name"
                stroke="hsl(0, 5%, 60%)"
                style={{ fontSize: "12px", fontWeight: "bold" }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="hsl(0, 5%, 60%)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsla(0, 0%, 100%, 1.00)",
                  border: "2px solid hsl(0, 70%, 45%)",
                  borderRadius: "4px",
                  color: "hsl(0, 5%, 95%)",
                }}
                labelStyle={{ color: "hsl(0, 70%, 45%)", fontWeight: "bold" }}
              />
              <Legend
                wrapperStyle={{ color: "hsl(0, 5%, 95%)", paddingTop: "20px" }}
                iconType="circle"
              />
              <Bar dataKey="KDA" name="KDA Ratio" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getKDAColor(entry.KDA)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border-border border-2 p-6">
          <h3 className="text-foreground mb-6 text-xl font-bold tracking-wide uppercase">
            Average K/D/A per Game by Champion
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 20%, 20%)" />
              <XAxis
                dataKey="name"
                stroke="hsl(0, 5%, 60%)"
                style={{ fontSize: "12px", fontWeight: "bold" }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="hsl(0, 5%, 60%)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 15%, 10%)",
                  border: "2px solid hsl(0, 70%, 45%)",
                  borderRadius: "4px",
                  color: "hsl(0, 5%, 95%)",
                }}
                labelStyle={{ color: "hsl(0, 70%, 45%)", fontWeight: "bold" }}
              />
              <Legend
                wrapperStyle={{ color: "hsl(0, 5%, 95%)", paddingTop: "20px" }}
                iconType="circle"
              />
              <Bar
                dataKey="Kills"
                fill="hsl(0, 70%, 45%)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Deaths"
                fill="hsl(0, 5%, 60%)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Assists"
                fill="hsl(40, 45%, 61%)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
