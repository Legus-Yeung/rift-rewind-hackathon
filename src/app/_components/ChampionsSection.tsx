"use client";

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
    <section id="champions" className="bg-card/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-foreground text-3xl font-bold tracking-wide uppercase">
            Top Champions
          </h2>
          <div className="bg-primary mt-2 h-1 w-20"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {champions.map((champ, index) => {
            const iconUrl = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${champ.name}.png`;
            return (
              <div
                key={champ.name}
                className="group bg-card border-border hover:border-primary relative overflow-hidden border-2 transition-all duration-300"
              >
                <div className="bg-primary text-primary-foreground absolute top-0 left-0 z-10 flex h-12 w-12 items-center justify-center text-xl font-bold">
                  {index + 1}
                </div>

                <div
                  className="relative h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.name.replace(/\s+/g, "")}_0.jpg')`,
                  }}
                >
                  <div className="from-card via-card/50 absolute inset-0 bg-gradient-to-t to-transparent"></div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={iconUrl}
                      alt={champ.name}
                      width={64}
                      height={64}
                      className="border-primary/50 rounded border-2"
                    />
                    <div className="flex-1">
                      <h3 className="text-foreground text-xl font-bold">
                        {champ.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {champ.games} Games Played
                      </p>
                    </div>
                  </div>

                  <div className="border-border flex items-center justify-between border-t pt-4">
                    <span className="text-muted-foreground text-sm tracking-wide uppercase">
                      KDA
                    </span>
                    <span className="text-primary text-2xl font-bold">
                      {champ.kda.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {insightParagraphs && (
          <div className="bg-card/50 border-border mt-8 rounded-lg border p-6">
            <div className="text-foreground text-base leading-relaxed whitespace-pre-line">
              {insightParagraphs}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
