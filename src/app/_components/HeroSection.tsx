import React from "react";

interface HeroSectionProps {
  summonerName: string;
  tagLine: string;
  profileIcon: string;
  topChampion: string;
  hoursPlayed: number;
  avgGameMinutes: number;
  totalGames: number;
}

export function HeroSection({
  summonerName,
  tagLine,
  profileIcon,
  topChampion,
  hoursPlayed,
  avgGameMinutes,
  totalGames,
}: HeroSectionProps) {
  return (
    <section
      className="relative h-[500px] overflow-hidden"
      style={{
        backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChampion}_0.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "",
      }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-noxus-red/20 via-transparent to-noxus-red/20"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
        <div className="flex items-end gap-8 w-full">
          {/* Profile Icon */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-noxus-red-light to-primary rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <img
              src={profileIcon}
              alt="Summoner Icon"
              width={120}
              height={120}
              className="relative rounded-lg border-4 border-background"
            />
          </div>

          {/* Summoner Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-baseline gap-3">
              <h1 className="text-5xl font-bold text-foreground tracking-tight">{summonerName}</h1>
              <span className="text-xl text-muted-foreground">{tagLine}</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary"></div>
                <span className="text-muted-foreground">Total Games:</span>
                <span className="text-foreground font-semibold">{totalGames}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary"></div>
                <span className="text-muted-foreground">Hours Played:</span>
                <span className="text-foreground font-semibold">{hoursPlayed.toFixed(1)}h</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary"></div>
                <span className="text-muted-foreground">Avg Game:</span>
                <span className="text-foreground font-semibold">{avgGameMinutes.toFixed(1)} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
