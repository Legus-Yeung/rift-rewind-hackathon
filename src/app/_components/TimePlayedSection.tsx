import React from "react";

interface TimeChampion {
  name: string;
  games: number;
  timePlayedHours: number;
}

interface TimePlayedSectionProps {
  topTimeChamps: TimeChampion[];
  hoursPlayed: number;
  avgGameMinutes: number;
}

export function TimePlayedSection({
  topTimeChamps,
  hoursPlayed,
  avgGameMinutes,
}: TimePlayedSectionProps) {
  return (
    <section id="time" className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground uppercase tracking-wide">
            Time Played
          </h2>
          <div className="w-20 h-1 bg-primary mt-2"></div>
        </div>

        {/* Total Time Card */}
        <div className="bg-gradient-to-r from-card via-primary/5 to-card border-2 border-primary/30 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-muted-foreground uppercase tracking-wider text-sm mb-2">
                Total Time in Battle
              </p>
              <p className="text-5xl font-bold text-primary">{hoursPlayed.toFixed(1)}</p>
              <p className="text-muted-foreground mt-1">Hours</p>
            </div>
            <div className="h-16 w-px bg-border hidden md:block"></div>
            <div className="text-center md:text-left">
              <p className="text-muted-foreground uppercase tracking-wider text-sm mb-2">
                Average Game Length
              </p>
              <p className="text-3xl font-bold text-foreground">{avgGameMinutes.toFixed(1)}</p>
              <p className="text-muted-foreground mt-1">Minutes</p>
            </div>
          </div>
        </div>

        {/* Top Time Champions */}
        <h3 className="text-xl font-semibold text-foreground mb-6 uppercase tracking-wide">
          Most Time Dedicated To
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topTimeChamps.map((champ, index) => {
            const iconUrl = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${champ.name}.png`;
            return (
              <div
                key={champ.name}
                className="bg-card border-2 border-border p-6 transition-all duration-300 hover:border-primary"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={iconUrl}
                      alt={champ.name}
                      width={80}
                      height={80}
                      className="rounded border-2 border-primary/50"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                      }}
                    />
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-foreground mb-1">{champ.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Games:</span>
                        <span className="text-foreground font-semibold">{champ.games}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="text-primary font-semibold">
                          {champ.timePlayedHours.toFixed(1)}h
                        </span>
                      </div>
                    </div>
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
