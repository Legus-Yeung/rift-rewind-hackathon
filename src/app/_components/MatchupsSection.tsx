import React from "react";

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

interface MatchupsSectionProps {
  bestMatchup: Matchup | null;
  bestPosition: Position | null;
}

export function MatchupsSection({ bestMatchup, bestPosition }: MatchupsSectionProps) {
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
          {/* Best Matchup */}
          {bestMatchup && (
            <div className="bg-card border-2 border-border p-8 transition-all duration-300 hover:border-primary">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-6">
                Dominant Matchup
              </h3>

              <div className="flex items-center justify-center gap-8 mb-6">
                {/* Player Champion */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-primary/50 rounded-lg blur group-hover:blur-md transition"></div>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${bestMatchup.playerChampion}.png`}
                      alt={bestMatchup.playerChampion}
                      width={96}
                      height={96}
                      className="relative rounded-lg border-2 border-primary"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                      }}
                    />
                  </div>
                  <p className="mt-3 text-lg font-bold text-foreground">
                    {bestMatchup.playerChampion}
                  </p>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
                    <span className="text-primary font-bold text-lg">VS</span>
                  </div>
                </div>

                {/* Opponent Champion */}
                <div className="flex flex-col items-center">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${bestMatchup.opponentChampion}.png`}
                    alt={bestMatchup.opponentChampion}
                    width={96}
                    height={96}
                    className="rounded-lg border-2 border-border opacity-75"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                    }}
                  />
                  <p className="mt-3 text-lg font-bold text-muted-foreground">
                    {bestMatchup.opponentChampion}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Position</span>
                  <span className="text-foreground font-semibold">{bestMatchup.position}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="text-muted-foreground">Winrate</span>
                  <span className="text-2xl font-bold text-primary">
                    {(bestMatchup.winrate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Best Position */}
          {bestPosition && (
            <div className="bg-card border-2 border-border p-8 transition-all duration-300 hover:border-primary">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-6">
                Strongest Position
              </h3>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary mb-6">
                  <span className="text-4xl font-bold text-primary uppercase">
                    {bestPosition.position.substring(0, 3)}
                  </span>
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
        </div>
      </div>
    </section>
  );
}
