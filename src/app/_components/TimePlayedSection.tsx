"use client";

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
    <section id="time" className="bg-card/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-foreground text-3xl font-bold tracking-wide uppercase">
            Time Played
          </h2>
          <div className="bg-primary mt-2 h-1 w-20"></div>
        </div>

        {/* Total Time Card */}
        <div className="from-card via-primary/5 to-card border-primary/30 mb-8 border-2 bg-gradient-to-r p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="text-muted-foreground mb-2 text-sm tracking-wider uppercase">
                Total Time in Battle
              </p>
              <p className="text-primary text-5xl font-bold">
                {hoursPlayed.toFixed(1)}
              </p>
              <p className="text-muted-foreground mt-1">Hours</p>
            </div>
            <div className="bg-border hidden h-16 w-px md:block"></div>
            <div className="text-center md:text-left">
              <p className="text-muted-foreground mb-2 text-sm tracking-wider uppercase">
                Average Game Length
              </p>
              <p className="text-foreground text-3xl font-bold">
                {avgGameMinutes.toFixed(1)}
              </p>
              <p className="text-muted-foreground mt-1">Minutes</p>
            </div>
          </div>
        </div>

        {/* Top Time Champions */}
        <h3 className="text-foreground mb-6 text-xl font-semibold tracking-wide uppercase">
          Most Time Dedicated To
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {topTimeChamps.map((champ, index) => {
            const iconUrl = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${champ.name}.png`;
            return (
              <div
                key={champ.name}
                className="bg-card border-border hover:border-primary border-2 p-6 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={iconUrl}
                      alt={champ.name}
                      width={80}
                      height={80}
                      className="border-primary/50 rounded border-2"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/Teemo.png";
                      }}
                    />
                    <div className="bg-primary text-primary-foreground absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-foreground mb-1 text-lg font-bold">
                      {champ.name}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Games:</span>
                        <span className="text-foreground font-semibold">
                          {champ.games}
                        </span>
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
