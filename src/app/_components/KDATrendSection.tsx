import React from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

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
  const avgKDA = topChampions.reduce((sum, c) => sum + c.kda, 0) / topChampions.length;

  return (
    <section id="kda-trend" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground uppercase tracking-wide">
              Performance Analysis
            </h2>
          </div>
          <div className="w-20 h-1 bg-primary mt-2"></div>
        </div>

        {/* KDA Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border-2 border-noxus-gold p-6 transition-all duration-300 hover:shadow-xl hover:shadow-noxus-gold/30">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-noxus-gold" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Best KDA</p>
            </div>
            <p className="text-4xl font-bold text-noxus-gold">{bestKDA.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {topChampions.find((c) => c.kda === bestKDA)?.name}
            </p>
          </div>

          <div className="bg-card border-2 border-primary p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Average KDA</p>
            </div>
            <p className="text-4xl font-bold text-primary">{avgKDA.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Across {topChampions.length} champions
            </p>
          </div>

          <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Lowest KDA</p>
            </div>
            <p className="text-4xl font-bold text-muted-foreground">{worstKDA.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {topChampions.find((c) => c.kda === worstKDA)?.name}
            </p>
          </div>
        </div>

        {/* KDA Chart */}
        <div className="bg-card border-2 border-border p-6 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
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

        {/* K/D/A Breakdown Chart */}
        <div className="bg-card border-2 border-border p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
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
              <Bar dataKey="Kills" fill="hsl(0, 70%, 45%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Deaths" fill="hsl(0, 5%, 60%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Assists" fill="hsl(40, 45%, 61%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
