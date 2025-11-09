import React from "react";
import { Sword, Flame, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";

const patch = "15.20.1";

interface MultikillSectionProps {
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
}

type MultikillType = {
  label: string;
  value: number;
  icon: React.ReactNode;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  description: string;
};

export function MultikillSection({
  doubleKills,
  tripleKills,
  quadraKills,
  pentaKills,
}: MultikillSectionProps) {
  const multikills: MultikillType[] = [
    {
      label: "Double Kills",
      value: doubleKills,
      icon: <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/1036.png`}
        alt="Double Kill"
        width={48}
        height={48}
        className="rounded-md"
      />,
      rarity: "common",
      description: "Two enemies eliminated in quick succession",
    },
    {
      label: "Triple Kills",
      value: tripleKills,
      icon: <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/3134.png`}
        alt="Triple Kill"
        width={48}
        height={48}
        className="rounded-md"
      />,
      rarity: "uncommon",
      description: "Three enemies eliminated in quick succession",
    },
    {
      label: "Quadra Kills",
      value: quadraKills,
      icon: <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/3031.png`}
        alt="Quadra Kill"
        width={48}
        height={48}
        className="rounded-md"
      />,
      rarity: "rare",
      description: "Four enemies eliminated in quick succession",
    },
    {
      label: "Penta Kills",
      value: pentaKills,
      icon: <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/3072.png`}
        alt="Penta Kill"
        width={48}
        height={48}
        className="rounded-md"
      />,
      rarity: "legendary",
      description: "All five enemies eliminated in quick succession",
    },
  ];

  const getRarityStyles = (rarity: string, value: number) => {
    const baseStyles = "relative bg-card border-2 p-6 transition-all duration-300 group";
    
    if (value === 0) {
      return `${baseStyles} border-border/30 opacity-60`;
    }

    switch (rarity) {
      case "common":
        return `${baseStyles} border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10`;
      case "uncommon":
        return `${baseStyles} border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20`;
      case "rare":
        return `${baseStyles} border-noxus-red/50 hover:border-noxus-red hover:shadow-xl hover:shadow-noxus-red/30`;
      case "legendary":
        return `${baseStyles} border-noxus-gold/50 hover:border-noxus-gold hover:shadow-2xl hover:shadow-noxus-gold/40 animate-pulse`;
      default:
        return baseStyles;
    }
  };

  const getRarityTextColor = (rarity: string, value: number) => {
    if (value === 0) return "text-muted-foreground";
    
    switch (rarity) {
      case "common":
        return "text-foreground";
      case "uncommon":
        return "text-primary";
      case "rare":
        return "text-noxus-red";
      case "legendary":
        return "text-noxus-gold";
      default:
        return "text-foreground";
    }
  };

  const totalMultikills = doubleKills + tripleKills + quadraKills + pentaKills;

  return (
    <section id="multikills" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image src={"https://static.wikia.nocookie.net/leagueoflegends/images/3/38/Noxus_Crest_icon.png/revision/latest?cb=20161117055828"}
                alt={"Noxus Axe"}
                width={40}
                height={40}/>
              <h2 className="text-3xl font-bold text-foreground uppercase tracking-wide">
                Multikill Achievements
              </h2>
            </div>
            <div className="w-20 h-1 bg-primary mt-2"></div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Multikills</p>
            <p className="text-4xl font-bold text-primary">{totalMultikills}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {multikills.map((multikill, index) => (
            <div
              key={multikill.label}
              className={getRarityStyles(multikill.rarity, multikill.value)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Achievement Badge */}
              {multikill.value > 0 && multikill.rarity === "legendary" && (
                <div className="absolute -top-3 -right-3 bg-noxus-gold text-noxus-black px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
                  Legendary!
                </div>
              )}
              {multikill.value > 0 && multikill.rarity === "rare" && multikill.value >= 3 && (
                <div className="absolute -top-3 -right-3 bg-noxus-red text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                  Rare!
                </div>
              )}

              {/* Icon */}
              <div className={`mb-4 ${getRarityTextColor(multikill.rarity, multikill.value)} group-hover:scale-110 transition-transform duration-300`}>
                {multikill.icon}
              </div>

              {/* Label */}
              <h3 className="text-xl font-bold text-foreground mb-1">
                {multikill.label}
              </h3>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground mb-4 min-h-[2.5rem]">
                {multikill.description}
              </p>

              {/* Value */}
              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground uppercase tracking-wide">
                    Count
                  </span>
                  <span className={`text-4xl font-bold ${getRarityTextColor(multikill.rarity, multikill.value)}`}>
                    {multikill.value}
                  </span>
                </div>
              </div>

              {/* Locked overlay for zero achievements */}
              {multikill.value === 0 && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground font-semibold">Not Yet Achieved</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Achievement Summary */}
        <div className="mt-8 bg-card/30 border border-border p-6 rounded">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Most Common
              </p>
              <p className="text-2xl font-bold text-primary">
                {doubleKills > 0 ? "Double Kill" : "None"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Rarest Achievement
              </p>
              <p className="text-2xl font-bold text-noxus-gold">
                {pentaKills > 0 ? "Penta Kill" : quadraKills > 0 ? "Quadra Kill" : tripleKills > 0 ? "Triple Kill" : "Double Kill"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Total Eliminations
              </p>
              <p className="text-2xl font-bold text-primary">
                {doubleKills * 2 + tripleKills * 3 + quadraKills * 4 + pentaKills * 5}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Achievement Rate
              </p>
              <p className="text-2xl font-bold text-primary">
                {totalMultikills > 0 ? `${((tripleKills + quadraKills + pentaKills) / totalMultikills * 100).toFixed(0)}%` : "0%"}
              </p>
              <p className="text-xs text-muted-foreground">Triple+ Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
