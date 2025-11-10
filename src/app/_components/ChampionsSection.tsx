import React from "react";

interface Champion {
  name: string;
  games: number;
  kda: number;
}

interface ChampionsSectionProps {
  champions: Champion[];
  insightParagraphs?: string;
}

export function ChampionsSection({
  champions,
  insightParagraphs,
}: ChampionsSectionProps) {
  return (
    <section id="champions" className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground uppercase tracking-wide">
            Top Champions
          </h2>
          <div className="w-20 h-1 bg-primary mt-2"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {champions.map((champ, index) => {
            const iconUrl = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${champ.name}.png`;
            return (
              <div
                key={champ.name}
                className="group relative bg-card border-2 border-border overflow-hidden transition-all duration-300 hover:border-primary"
              >
                <div className="absolute top-0 left-0 z-10 bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold">
                  {index + 1}
                </div>

                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.name.replace(/\s+/g, "")}_0.jpg')`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={iconUrl}
                      alt={champ.name}
                      width={64}
                      height={64}
                      className="rounded border-2 border-primary/50"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground">{champ.name}</h3>
                      <p className="text-sm text-muted-foreground">{champ.games} Games Played</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground uppercase tracking-wide">KDA</span>
                    <span className="text-2xl font-bold text-primary">{champ.kda.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {insightParagraphs && (
          <div className="mt-8 bg-card/50 border border-border p-6 rounded-lg">
            <div className="text-foreground text-base leading-relaxed whitespace-pre-line">
              {insightParagraphs}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
