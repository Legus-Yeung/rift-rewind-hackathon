import React from "react";
import { Eye, MapPin, Target, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
  const avgVisionScore = (totalVisionScore / totalGames).toFixed(1);
  const avgWardsPlaced = (totalWardsPlaced / totalGames).toFixed(1);
  const avgWardsKilled = (totalWardsKilled / totalGames).toFixed(1);
  const wardKillRate = ((totalWardsKilled / totalWardsPlaced) * 100).toFixed(0);

  const positionChartData = positionVisionData
    .map((pos) => ({
      name: pos.position,
      visionScore: parseFloat((pos.visionScore / pos.games).toFixed(1)),
      wardsPlaced: parseFloat((pos.wardsPlaced / pos.games).toFixed(1)),
      wardsKilled: parseFloat((pos.wardsKilled / pos.games).toFixed(1)),
    }))
    .sort((a, b) => b.visionScore - a.visionScore);

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      TOP: "hsl(0, 70%, 45%)",
      JUNGLE: "hsl(0, 60%, 35%)",
      MIDDLE: "hsl(0, 75%, 55%)",
      BOTTOM: "hsl(25, 35%, 45%)",
      SUPPORT: "hsl(40, 45%, 61%)",
    };
    return colors[position] || "hsl(0, 70%, 45%)";
  };

  return (
    <section id="vision" className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground uppercase tracking-wide">
              Vision Control
            </h2>
          </div>
          <div className="w-20 h-1 bg-primary mt-2"></div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-6 h-6 text-primary" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Avg Vision Score
              </p>
            </div>
            <p className="text-4xl font-bold text-primary">{avgVisionScore}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Total: {totalVisionScore.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-noxus-gold" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Avg Wards Placed
              </p>
            </div>
            <p className="text-4xl font-bold text-noxus-gold">{avgWardsPlaced}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Total: {totalWardsPlaced.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-noxus-red" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Avg Wards Killed
              </p>
            </div>
            <p className="text-4xl font-bold text-noxus-red">{avgWardsKilled}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Total: {totalWardsKilled.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-primary" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Control Wards
              </p>
            </div>
            <p className="text-4xl font-bold text-primary">{totalDetectorWards}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Efficiency: {wardKillRate}%
            </p>
          </div>
        </div>

        {/* Vision Score by Position */}
        <div className="bg-card border-2 border-border p-6 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
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
                  backgroundColor: "hsl(0, 15%, 10%)",
                  border: "2px solid hsl(0, 70%, 45%)",
                  borderRadius: "4px",
                  color: "hsl(0, 5%, 95%)",
                }}
                labelStyle={{ color: "hsl(0, 70%, 45%)", fontWeight: "bold" }}
              />
              <Bar dataKey="visionScore" radius={[8, 8, 0, 0]}>
                {positionChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getPositionColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Position Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {positionVisionData.map((pos) => (
            <div
              key={pos.position}
              className="bg-card border-2 border-border p-5 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="mb-4">
                <h4
                  className="text-lg font-bold uppercase tracking-wide mb-1"
                  style={{ color: getPositionColor(pos.position) }}
                >
                  {pos.position}
                </h4>
                <p className="text-xs text-muted-foreground">{pos.games} games</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Vision Score</span>
                  <span className="text-lg font-bold text-primary">
                    {(pos.visionScore / pos.games).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wards Placed</span>
                  <span className="text-lg font-bold text-noxus-gold">
                    {(pos.wardsPlaced / pos.games).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wards Killed</span>
                  <span className="text-lg font-bold text-noxus-red">
                    {(pos.wardsKilled / pos.games).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
