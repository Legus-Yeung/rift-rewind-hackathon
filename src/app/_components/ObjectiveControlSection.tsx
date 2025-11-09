import React from "react";
import { Crown, Flame, Shield, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,  } from "recharts";
import type { PieLabelRenderProps } from "recharts";

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
  const baronContribution = teamBaronKills > 0 ? ((baronTakedowns / teamBaronKills) * 100) : 0;
  const heraldContribution = teamRiftHeraldKills > 0 ? ((riftHeraldTakedowns / teamRiftHeraldKills) * 100) : 0;

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

  const pieData = objectiveData.map((obj) => ({
    name: obj.name,
    value: obj.value,
  }));

  const totalObjectives = baronTakedowns + dragonTakedowns + riftHeraldTakedowns + scuttleCrabKills;

  return (
    <section id="objectives" className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground uppercase tracking-wide">
              Objective Control
            </h2>
          </div>
          <div className="w-20 h-1 bg-primary mt-2"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Objective Distribution Pie Chart */}
          <div className="bg-card border-2 border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
              Objective Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name?: string; percent?: number }) => (
                        <text fill="white" textAnchor="middle" dominantBaseline="central">
                        {`${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        </text>
                    )}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"/>

                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={objectiveData[index]?.color ?? "#8884d8"}/>
                    ))}

                <Tooltip
                    contentStyle={{
                    backgroundColor: "hsl(0, 15%, 10%)",
                    border: "2px solid hsl(0, 70%, 45%)",
                    borderRadius: "4px",
                    color: "hsl(0, 5%, 95%)",
                    }}
                />
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Total Objectives
              </p>
              <p className="text-4xl font-bold text-primary">{totalObjectives}</p>
            </div>
          </div>

          {/* Team Contribution */}
          <div className="bg-card border-2 border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
              Team Contribution %
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[hsl(270,60%,50%)]" />
                    <span className="text-foreground font-semibold">Baron Nashor</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {baronContribution.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${baronContribution}%`,
                      background: "linear-gradient(90deg, hsl(270, 60%, 50%), hsl(270, 70%, 60%))",
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {baronTakedowns} / {teamBaronKills} team barons
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[hsl(40,45%,61%)]" />
                    <span className="text-foreground font-semibold">Rift Herald</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {heraldContribution.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${heraldContribution}%`,
                      background: "linear-gradient(90deg, hsl(40, 45%, 61%), hsl(40, 55%, 71%))",
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {riftHeraldTakedowns} / {teamRiftHeraldKills} team heralds
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                  Personal Takedowns
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Flame className="w-6 h-6 text-noxus-red mx-auto mb-2" />
                    <p className="text-2xl font-bold text-noxus-red">{dragonTakedowns}</p>
                    <p className="text-xs text-muted-foreground">Dragons</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-6 h-6 text-[hsl(180,50%,50%)] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[hsl(180,50%,50%)]">{scuttleCrabKills}</p>
                    <p className="text-xs text-muted-foreground">Scuttles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Objective Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {objectiveData.map((obj) => {
            const Icon = obj.icon;
            return (
              <div
                key={obj.name}
                className="bg-card border-2 border-border p-6 transition-all duration-300 hover:border-primary hover:shadow-lg"
                style={{
                  boxShadow: `0 0 20px -5px ${obj.color}40`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6" style={{ color: obj.color }} />
                  <h4 className="text-sm font-bold text-foreground uppercase">{obj.name}</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Total
                    </p>
                    <p className="text-3xl font-bold" style={{ color: obj.color }}>
                      {obj.value}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Avg per Game
                    </p>
                    <p className="text-xl font-bold text-primary">{obj.avgPerGame}</p>
                  </div>

                  {obj.contribution > 0 && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Contribution
                      </p>
                      <p className="text-xl font-bold text-noxus-gold">
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
