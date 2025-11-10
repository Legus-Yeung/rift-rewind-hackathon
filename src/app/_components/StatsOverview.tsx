import React from "react";

interface StatsOverviewProps {
  aggregate: {
    kills: number;
    deaths: number;
    assists: number;
    goldEarned: number;
    totalDamageDealtToChampions: number;
    games: number;
  };
  avgGameMinutes: number;
  compareWith?: any;
}


export function StatsOverview({ aggregate, avgGameMinutes }: StatsOverviewProps) {
  const kda = ((aggregate.kills + aggregate.assists) / Math.max(1, aggregate.deaths)).toFixed(2);

  const stats = [
    { label: "K / D / A", value: `${aggregate.kills} / ${aggregate.deaths} / ${aggregate.assists}`, highlight: true },
    { label: "KDA Ratio", value: kda, highlight: true },
    { label: "Total Games", value: aggregate.games.toLocaleString() },
    { label: "Avg Game Length", value: `${avgGameMinutes.toFixed(1)} min` },
    { label: "Gold Earned", value: aggregate.goldEarned.toLocaleString() },
    { label: "Total Damage", value: aggregate.totalDamageDealtToChampions.toLocaleString() },
  ];

  return (
    <section id="overview" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground uppercase tracking-wide">
            Season Overview
          </h2>
          <div className="w-20 h-1 bg-primary mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-card border border-border p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 ${
                stat.highlight ? "lg:col-span-2" : "lg:col-span-2"
              }`}
            >
              <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {stat.label}
              </div>
              <div className={`font-bold ${stat.highlight ? "text-3xl" : "text-2xl"} text-primary`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
