import React from "react";
import Image from "next/image"


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

export function MatchupsSection({ bestMatchups, bestPosition, bestMatch }: MatchupsSectionProps) {
  return (
    <section id="matchups" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground uppercase tracking-wide">
            Best Matchups & Positions
          </h2>
          <div className="w-20 h-1 bg-primary mt-2"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 3 Best Matchups */}
          <div className="lg:col-span-1 space-y-4">
            {bestMatchups.map((matchup, index) => (
              <div
                key={`${matchup.playerChampion}-${matchup.opponentChampion}-${matchup.position}`}
                className="bg-card border-2 border-border p-6 transition-all duration-300 hover:border-primary"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
                    <span className="text-primary font-bold text-sm">#{index + 1}</span>
                  </div>
                  <h3 className="text-sm text-muted-foreground uppercase tracking-wider">
                    {index === 0 ? "Dominant Matchup" : "Strong Matchup"}
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-4 mb-4">
                  {/* Player Champion */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-primary/50 rounded-lg blur group-hover:blur-md transition"></div>
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${matchup.playerChampion}.png`}
                        alt={matchup.playerChampion}
                        width={64}
                        height={64}
                        className="relative rounded-lg border-2 border-primary"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                        }}
                      />
                    </div>
                    <p className="text-base font-bold text-foreground">
                      {matchup.playerChampion}
                    </p>
                  </div>

                  {/* VS */}
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary shrink-0">
                    <span className="text-primary font-bold text-sm">VS</span>
                  </div>

                  {/* Opponent Champion */}
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <p className="text-base font-bold text-muted-foreground text-right">
                      {matchup.opponentChampion}
                    </p>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${matchup.opponentChampion}.png`}
                      alt={matchup.opponentChampion}
                      width={64}
                      height={64}
                      className="rounded-lg border-2 border-border opacity-75"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{matchup.position}</span>
                  <span className="text-xl font-bold text-primary">
                    {(matchup.winrate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Best Position */}
          {bestPosition && (
            <div className="bg-card border-2 border-border p-4 min-h-[250px] transition-all duration-300 hover:border-primary">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-6">
                Strongest Position
              </h3>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary mb-6">
                  <Image
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${
                      {
                        Top: "top",
                        Jungle: "jungle",
                        Mid: "middle",
                        Bot: "bottom",
                        Support: "utility",
                      }[bestPosition.position] || "jungle"
                    }.png`}
                    alt={`Position ${bestPosition.position}`}
                    width={80}
                    height={80}
                  />
                </div>
                <h4 className="text-3xl font-bold text-foreground mb-2 uppercase">
                  {bestPosition.position}
                </h4>
                <p className="text-muted-foreground mb-6">Your best performing role</p>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border">
                <span className="text-muted-foreground">Average KDA</span>
                <span className="text-2xl font-bold text-primary">
                  {bestPosition.avgKda.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {bestMatch && (
            <div
              className="lg:col-span-2 relative bg-card border-2 border-border p-8 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 overflow-hidden rounded-lg"
            >
              {/* Splash background */}
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${bestMatch.champion}_0.jpg`}
                alt={`${bestMatch.champion} splash art`}
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg";
                }}
              />

              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>

              {/* Foreground content */}
              <div className="relative z-10 flex flex-col items-center justify-center py-8">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-6">
                  Best Single Match
                </h3>

                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${bestMatch.champion}.png`}
                  alt={bestMatch.champion}
                  width={96}
                  height={96}
                  className="rounded-lg border-2 border-noxus-gold mb-4 relative z-10"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                  }}
                />
                <h4 className="text-2xl font-bold text-noxus-gold mb-2 uppercase">
                  {bestMatch.champion}
                </h4>
                <p className="text-muted-foreground mb-4">Your standout performance</p>
                <p className="text-xl font-semibold text-primary mb-1">
                  KDA: {bestMatch.kda.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
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
