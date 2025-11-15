"use client";

import React from "react";
import { Crown, Flame, Shield, Target } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import Image from "next/image";

type CustomPieLabelProps = {
  name?: string;
  percent?: number;
};

interface ObjectiveControlSectionProps {
  baronTakedowns: number;
  dragonTakedowns: number;
  riftHeraldTakedowns: number;
  teamBaronKills: number;
  teamRiftHeraldKills: number;
  scuttleCrabKills: number;
  totalGames: number;
}

export function ObjectiveControlSection({
  baronTakedowns,
  dragonTakedowns,
  riftHeraldTakedowns,
  teamBaronKills,
  teamRiftHeraldKills,
  scuttleCrabKills,
  totalGames,
}: ObjectiveControlSectionProps) {
  const baronContribution =
    teamBaronKills > 0 ? (baronTakedowns / teamBaronKills) * 100 : 0;
  const heraldContribution =
    teamRiftHeraldKills > 0
      ? (riftHeraldTakedowns / teamRiftHeraldKills) * 100
      : 0;

  const objectiveData = [
    {
      name: "Barons",
      value: baronTakedowns,
      color: "hsl(270, 60%, 50%)",
      icon: Crown,
      contribution: baronContribution,
      avgPerGame: (baronTakedowns / totalGames).toFixed(2),
    },
    {
      name: "Dragons",
      value: dragonTakedowns,
      color: "hsl(0, 70%, 45%)",
      icon: Flame,
      contribution: 0, // We don't have team dragon data
      avgPerGame: (dragonTakedowns / totalGames).toFixed(2),
    },
    {
      name: "Rift Heralds",
      value: riftHeraldTakedowns,
      color: "hsl(40, 45%, 61%)",
      icon: Shield,
      contribution: heraldContribution,
      avgPerGame: (riftHeraldTakedowns / totalGames).toFixed(2),
    },
    {
      name: "Scuttle Crabs",
      value: scuttleCrabKills,
      color: "hsl(180, 50%, 50%)",
      icon: Target,
      contribution: 0,
      avgPerGame: (scuttleCrabKills / totalGames).toFixed(2),
    },
  ];

  const COLORS = [
    "#FFD700", // gold
    "#FF7F50", // coral
    "#82CA9D", // mint
    "#8884D8", // violet
    "#00C49F", // teal
    "#FFBB28", // yellow-orange
  ];

  const pieData = objectiveData.map((obj) => ({
    name: obj.name,
    value: obj.value,
  }));

  const totalObjectives =
    baronTakedowns + dragonTakedowns + riftHeraldTakedowns + scuttleCrabKills;

  return (
    <section id="objectives" className="bg-card/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Crown className="text-primary h-8 w-8" />
            <h2 className="text-foreground text-3xl font-bold tracking-wide uppercase">
              Objective Control
            </h2>
          </div>
          <div className="bg-primary mt-2 h-1 w-20"></div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Objective Distribution Pie Chart */}
          <div className="bg-card border-border border-2 p-6">
            <h3 className="text-foreground mb-6 text-xl font-bold tracking-wide uppercase">
              Objective Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: CustomPieLabelProps) =>
                    `${name}: ${(percent! * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid hsl(40,45%,61%)",
                    borderRadius: "6px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Total Objectives
              </p>
              <p className="text-primary text-4xl font-bold">
                {totalObjectives}
              </p>
            </div>
          </div>

          {/* Team Contribution */}
          <div className="bg-card border-border border-2 p-6">
            <h3 className="text-foreground mb-6 text-xl font-bold tracking-wide uppercase">
              Team Contribution %
            </h3>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        "https://static.wikia.nocookie.net/leagueoflegends/images/0/04/Clash_BaronNashorLogo_%28Base%29.png/revision/latest?cb=20181226235434"
                      }
                      alt={"Baron Nashor"}
                      width={40}
                      height={40}
                    />
                    <span className="text-foreground font-semibold">
                      Baron Nashor
                    </span>
                  </div>
                  <span className="text-primary text-2xl font-bold">
                    {baronContribution.toFixed(0)}%
                  </span>
                </div>
                <div className="bg-muted h-3 w-full rounded-full">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${baronContribution}%`,
                      background:
                        "linear-gradient(90deg, hsl(270, 60%, 50%), hsl(270, 70%, 60%))",
                    }}
                  ></div>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {baronTakedowns} / {teamBaronKills} team barons
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        "https://static.wikia.nocookie.net/leagueoflegends/images/1/1c/Clash_RiftHeraldLogo_%28Base%29.png/revision/latest?cb=20181226235617"
                      }
                      alt={"Rift Herald"}
                      width={40}
                      height={40}
                    />
                    <span className="text-foreground font-semibold">
                      Rift Herald
                    </span>
                  </div>
                  <span className="text-primary text-2xl font-bold">
                    {heraldContribution.toFixed(0)}%
                  </span>
                </div>
                <div className="bg-muted h-3 w-full rounded-full">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${heraldContribution}%`,
                      background:
                        "linear-gradient(90deg, hsl(40, 45%, 61%), hsl(40, 55%, 71%))",
                    }}
                  ></div>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {riftHeraldTakedowns} / {teamRiftHeraldKills} team heralds
                </p>
              </div>

              <div className="border-border border-t pt-4">
                <p className="text-muted-foreground mb-3 text-sm tracking-wider uppercase">
                  Personal Takedowns
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Image
                      src={
                        "https://static.wikia.nocookie.net/leagueoflegends/images/9/99/Clash_DragonLogo_%28Base%29.png/revision/latest?cb=20181226235501"
                      }
                      alt={"Dragon"}
                      width={40}
                      height={40}
                      className="mx-auto mb-2"
                    />
                    <p className="text-noxus-red text-2xl font-bold">
                      {dragonTakedowns}
                    </p>
                    <p className="text-muted-foreground text-xs">Dragons</p>
                  </div>
                  <div className="text-center">
                    <Image
                      src={
                        "https://static.wikia.nocookie.net/leagueoflegends/images/d/d3/Clash_ScuttleCrabLogo_%28Base%29.png/revision/latest?cb=20181226235622"
                      }
                      alt={"Scuttle Crab"}
                      width={40}
                      height={40}
                      className="mx-auto mb-2"
                    />
                    <p className="text-2xl font-bold text-[hsl(180,50%,50%)]">
                      {scuttleCrabKills}
                    </p>
                    <p className="text-muted-foreground text-xs">Scuttles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Objective Cards */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {objectiveData.map((obj) => {
            const Icon = obj.icon;
            return (
              <div
                key={obj.name}
                className="bg-card border-border hover:border-primary border-2 p-6 transition-all duration-300 hover:shadow-lg"
                style={{
                  boxShadow: `0 0 20px -5px ${obj.color}40`,
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <h4 className="text-foreground text-sm font-bold uppercase">
                    {obj.name}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
                      Total
                    </p>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: obj.color }}
                    >
                      {obj.value}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
                      Avg per Game
                    </p>
                    <p className="text-primary text-xl font-bold">
                      {obj.avgPerGame}
                    </p>
                  </div>

                  {obj.contribution > 0 && (
                    <div className="border-border border-t pt-3">
                      <p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
                        Contribution
                      </p>
                      <p className="text-noxus-gold text-xl font-bold">
                        {obj.contribution.toFixed(0)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
