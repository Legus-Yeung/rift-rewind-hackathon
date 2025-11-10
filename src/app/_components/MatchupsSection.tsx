import React from "react";
import Image from "next/image";

interface Matchup {
  playerChampion: string;
  opponentChampion: string;
  position: string;
  winrate: number;
}

interface Position {
  position: string;
  avgKda: number;
}

interface BestMatch {
  champion: string;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
}

interface MatchupsSectionProps {
  bestMatchups: Matchup[];
  bestPosition: Position | null;
  bestMatch?: BestMatch | null;
}

export function MatchupsSection({
  bestMatchups,
  bestPosition,
  bestMatch,
}: MatchupsSectionProps) {
  return (
    <section id="matchups" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-foreground text-3xl font-bold tracking-wide uppercase">
            Best Matchups & Positions
          </h2>
          <div className="bg-primary mt-2 h-1 w-20"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
          {/* Top 3 Best Matchups */}
          <div className="space-y-4 lg:col-span-1">
            {bestMatchups.map((matchup, index) => (
              <div
                key={`${matchup.playerChampion}-${matchup.opponentChampion}-${matchup.position}`}
                className="bg-card border-border hover:border-primary border-2 p-6 transition-all duration-300"
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary/20 border-primary flex h-8 w-8 items-center justify-center rounded-full border-2">
                    <span className="text-primary text-sm font-bold">
                      #{index + 1}
                    </span>
                  </div>
                  <h3 className="text-muted-foreground text-sm tracking-wider uppercase">
                    {index === 0 ? "Dominant Matchup" : "Strong Matchup"}
                  </h3>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                  {/* Player Champion */}
                  <div className="flex flex-1 items-center gap-3">
                    <div className="group relative">
                      <div className="bg-primary/50 absolute -inset-1 rounded-lg blur transition group-hover:blur-md"></div>
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${matchup.playerChampion}.png`}
                        alt={matchup.playerChampion}
                        width={64}
                        height={64}
                        className="border-primary relative rounded-lg border-2"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                        }}
                      />
                    </div>
                    <p className="text-foreground text-base font-bold">
                      {matchup.playerChampion}
                    </p>
                  </div>

                  {/* VS */}
                  <div className="bg-primary/20 border-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2">
                    <span className="text-primary text-sm font-bold">VS</span>
                  </div>

                  {/* Opponent Champion */}
                  <div className="flex flex-1 items-center justify-end gap-3">
                    <p className="text-muted-foreground text-right text-base font-bold">
                      {matchup.opponentChampion}
                    </p>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${matchup.opponentChampion}.png`}
                      alt={matchup.opponentChampion}
                      width={64}
                      height={64}
                      className="border-border rounded-lg border-2 opacity-75"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {matchup.position}
                  </span>
                  <span className="text-primary text-xl font-bold">
                    {(matchup.winrate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Best Position */}
          {bestPosition && (
            <div className="bg-card border-border hover:border-primary min-h-[250px] border-2 p-4 transition-all duration-300">
              <h3 className="text-muted-foreground mb-6 text-sm tracking-wider uppercase">
                Strongest Position
              </h3>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-primary/10 border-primary mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4">
                  <Image
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${
                      {
                        top: "top",
                        jungle: "jungle",
                        mid: "middle",
                        middle: "middle",
                        bot: "bottom",
                        bottom: "bottom",
                        support: "utility",
                        utility: "utility",
                      }[bestPosition.position.toLowerCase()] ?? "jungle"
                    }.png`}
                    alt={`Position ${bestPosition.position}`}
                    width={80}
                    height={80}
                  />
                </div>
                <h4 className="text-foreground mb-2 text-3xl font-bold uppercase">
                  {{
                    top: "Top",
                    jungle: "Jungle",
                    mid: "Mid",
                    middle: "Mid",
                    bot: "Bottom",
                    bottom: "Bottom",
                    support: "Support",
                    utility: "Support",
                  }[bestPosition.position.toLowerCase()] ??
                    bestPosition.position}
                </h4>
                <p className="text-muted-foreground mb-6">
                  Your best performing role
                </p>
              </div>

              <div className="border-border flex items-center justify-between border-t pt-6">
                <span className="text-muted-foreground">Average KDA</span>
                <span className="text-primary text-2xl font-bold">
                  {bestPosition.avgKda.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {bestMatch && (
            <div className="bg-card border-border hover:border-primary hover:shadow-primary/10 relative overflow-hidden rounded-lg border-2 p-8 transition-all duration-300 hover:shadow-xl lg:col-span-2">
              {/* Splash background */}
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${bestMatch.champion}_0.jpg`}
                alt={`${bestMatch.champion} splash art`}
                className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg";
                }}
              />

              {/* Overlay for readability */}
              <div className="from-background via-background/50 absolute inset-0 bg-gradient-to-t to-transparent"></div>

              {/* Foreground content */}
              <div className="relative z-10 flex flex-col items-center justify-center py-8">
                <h3 className="text-muted-foreground mb-6 text-sm tracking-wider uppercase">
                  Best Single Match
                </h3>

                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${bestMatch.champion}.png`}
                  alt={bestMatch.champion}
                  width={96}
                  height={96}
                  className="border-noxus-gold relative z-10 mb-4 rounded-lg border-2"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                  }}
                />
                <h4 className="text-noxus-gold mb-2 text-2xl font-bold uppercase">
                  {bestMatch.champion}
                </h4>
                <p className="text-muted-foreground mb-4">
                  Your standout performance
                </p>
                <p className="text-primary mb-1 text-xl font-semibold">
                  KDA: {bestMatch.kda.toFixed(2)}
                </p>
                <p className="text-muted-foreground text-sm">
                  {bestMatch.kills}/{bestMatch.deaths}/{bestMatch.assists}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
