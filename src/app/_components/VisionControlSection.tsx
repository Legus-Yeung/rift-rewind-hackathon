"use client";

import React from "react";
import { Eye, MapPin, Target, Shield } from "lucide-react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PositionVisionData {
  position: string;
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  games: number;
}

interface VisionControlSectionProps {
  totalVisionScore: number;
  totalWardsPlaced: number;
  totalWardsKilled: number;
  totalDetectorWards: number;
  totalGames: number;
  positionVisionData: PositionVisionData[];
}

export function VisionControlSection({
  totalVisionScore,
  totalWardsPlaced,
  totalWardsKilled,
  totalDetectorWards,
  totalGames,
  positionVisionData,
}: VisionControlSectionProps) {
  // Helper: Normalize internal Riot position names to human-friendly display
  const displayPositionName = (pos: string) => {
    const map: Record<string, string> = {
      UTILITY: "SUPPORT",
      MIDDLE: "MID",
      BOTTOM: "BOT",
    };
    return map[pos.toUpperCase()] ?? pos;
  };

  // Helper: Color by role (consistent with display name)
  const getPositionColor = (position: string) => {
    const normalized = displayPositionName(position);
    const colors: Record<string, string> = {
      TOP: "hsl(0, 70%, 45%)",
      JUNGLE: "hsl(0, 60%, 35%)",
      MID: "hsl(0, 75%, 55%)",
      BOT: "hsl(25, 35%, 45%)",
      SUPPORT: "hsl(40, 45%, 61%)",
    };
    return colors[normalized] ?? "hsl(0, 70%, 45%)";
  };

  // Derived stats
  const avgVisionScore = (totalVisionScore / totalGames).toFixed(1);
  const avgWardsPlaced = (totalWardsPlaced / totalGames).toFixed(1);
  const avgWardsKilled = (totalWardsKilled / totalGames).toFixed(1);
  const wardKillRate = ((totalWardsKilled / totalWardsPlaced) * 100).toFixed(0);

  // Prepare chart data
  const positionChartData = positionVisionData
    .map((pos) => ({
      name: displayPositionName(pos.position),
      visionScore: parseFloat((pos.visionScore / pos.games).toFixed(1)),
      wardsPlaced: parseFloat((pos.wardsPlaced / pos.games).toFixed(1)),
      wardsKilled: parseFloat((pos.wardsKilled / pos.games).toFixed(1)),
    }))
    .sort((a, b) => b.visionScore - a.visionScore);

  return (
    <section id="vision" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Eye className="text-primary h-8 w-8" />
            <h2 className="text-foreground text-3xl font-bold tracking-wide uppercase">
              Vision Control
            </h2>
          </div>
          <div className="bg-primary mt-2 h-1 w-20"></div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="bg-card border-border hover:border-primary hover:shadow-primary/20 border-2 p-6 transition-all hover:shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/15.20.1/img/item/3340.png"
                }
                alt={"ward"}
                width={40}
                height={40}
              />
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Avg Vision Score
              </p>
            </div>
            <p className="text-primary text-4xl font-bold">{avgVisionScore}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Total: {totalVisionScore.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border-border hover:border-primary hover:shadow-primary/20 border-2 p-6 transition-all hover:shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <Image
                src={
                  "https://static.wikia.nocookie.net/leagueoflegends/images/b/b7/Need_Vision_ping.png/revision/latest/scale-to-width-down/128?cb=20221118214211"
                }
                alt={"need vision ping"}
                width={40}
                height={40}
              />
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Avg Wards Placed
              </p>
            </div>
            <p className="text-noxus-gold text-4xl font-bold">
              {avgWardsPlaced}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Total: {totalWardsPlaced.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border-border hover:border-primary hover:shadow-primary/20 border-2 p-6 transition-all hover:shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <Image
                src={
                  "https://static.wikia.nocookie.net/leagueoflegends/images/a/ab/Enemy_Vision_ping.png/revision/latest/scale-to-width-down/128?cb=20221118235903"
                }
                alt={"enemy vision ping"}
                width={40}
                height={40}
              />
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Avg Wards Killed
              </p>
            </div>
            <p className="text-noxus-red text-4xl font-bold">
              {avgWardsKilled}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Total: {totalWardsKilled.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border-border hover:border-primary hover:shadow-primary/20 border-2 p-6 transition-all hover:shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/15.20.1/img/item/2055.png"
                }
                alt={"control ward"}
                width={40}
                height={40}
              />
              <p className="text-muted-foreground text-sm tracking-wider uppercase">
                Control Wards
              </p>
            </div>
            <p className="text-primary text-4xl font-bold">
              {totalDetectorWards}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Efficiency: {wardKillRate}%
            </p>
          </div>
        </div>

        <div className="bg-card border-border mb-8 border-2 p-6">
          <h3 className="text-foreground mb-6 text-xl font-bold tracking-wide uppercase">
            Vision Score by Position
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={positionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 20%, 20%)" />
              <XAxis
                dataKey="name"
                stroke="hsl(0, 5%, 60%)"
                style={{ fontSize: "12px", fontWeight: "bold" }}
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
              <Bar dataKey="visionScore" radius={[8, 8, 0, 0]}>
                {positionChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getPositionColor(entry.name)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {positionVisionData.map((pos) => {
            const displayName = displayPositionName(pos.position);
            return (
              <div
                key={pos.position}
                className="bg-card border-border hover:border-primary hover:shadow-primary/20 border-2 p-5 transition-all hover:shadow-lg"
              >
                <div className="mb-4">
                  <h4
                    className="mb-1 text-lg font-bold tracking-wide uppercase"
                    style={{ color: getPositionColor(pos.position) }}
                  >
                    {displayName}
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    {pos.games} games
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Vision Score
                    </span>
                    <span className="text-primary text-lg font-bold">
                      {(pos.visionScore / pos.games).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Wards Placed
                    </span>
                    <span className="text-noxus-gold text-lg font-bold">
                      {(pos.wardsPlaced / pos.games).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Wards Killed
                    </span>
                    <span className="text-noxus-red text-lg font-bold">
                      {(pos.wardsKilled / pos.games).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
