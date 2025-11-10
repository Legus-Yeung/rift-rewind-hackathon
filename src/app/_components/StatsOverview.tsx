import React from "react";
import type { AggregateStats } from "~/lib/summoner/summoner-interface-utils";

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
  compareWith?: AggregateStats;
  insightParagraph?: string;
}

export function StatsOverview({
  aggregate,
  avgGameMinutes,
  insightParagraph,
}: StatsOverviewProps) {
  const kda = (
    (aggregate.kills + aggregate.assists) /
    Math.max(1, aggregate.deaths)
  ).toFixed(2);

  const stats = [
    {
      label: "Total K / D / A",
      value: `${aggregate.kills} / ${aggregate.deaths} / ${aggregate.assists}`,
      highlight: true,
    },
    { label: "KDA Ratio", value: kda, highlight: true },
    { label: "Total Games", value: aggregate.games.toLocaleString() },
    { label: "Avg Game Length", value: `${avgGameMinutes.toFixed(1)} min` },
    { label: "Gold Earned", value: aggregate.goldEarned.toLocaleString() },
    {
      label: "Total Damage",
      value: aggregate.totalDamageDealtToChampions.toLocaleString(),
    },
  ];

  return (
    <section id="overview" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-foreground text-3xl font-bold tracking-wide uppercase">
            Season Overview
          </h2>
          <div className="bg-primary mt-2 h-1 w-20"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-card border-border hover:border-primary hover:shadow-primary/20 border p-6 transition-all duration-300 hover:shadow-lg ${
                stat.highlight ? "lg:col-span-2" : "lg:col-span-2"
              }`}
            >
              <div className="text-muted-foreground mb-2 text-sm tracking-wider uppercase">
                {stat.label}
              </div>
              <div
                className={`font-bold ${stat.highlight ? "text-3xl" : "text-2xl"} text-primary`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {insightParagraph && (
          <div className="mt-8 bg-card/50 border border-border p-6 rounded-lg">
            <p className="text-foreground text-base leading-relaxed">
              {insightParagraph}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
