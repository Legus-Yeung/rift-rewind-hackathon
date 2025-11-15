"use client";

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
      icon: (
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/1036.png`}
          alt="Double Kill"
          width={48}
          height={48}
          className="rounded-md"
        />
      ),
      rarity: "common",
      description: "Two enemies eliminated in quick succession",
    },
    {
      label: "Triple Kills",
      value: tripleKills,
      icon: (
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/3134.png`}
          alt="Triple Kill"
          width={48}
          height={48}
          className="rounded-md"
        />
      ),
      rarity: "uncommon",
      description: "Three enemies eliminated in quick succession",
    },
    {
      label: "Quadra Kills",
      value: quadraKills,
      icon: (
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/3031.png`}
          alt="Quadra Kill"
          width={48}
          height={48}
          className="rounded-md"
        />
      ),
      rarity: "rare",
      description: "Four enemies eliminated in quick succession",
    },
    {
      label: "Penta Kills",
      value: pentaKills,
      icon: (
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/3072.png`}
          alt="Penta Kill"
          width={48}
          height={48}
          className="rounded-md"
        />
      ),
      rarity: "legendary",
      description: "All five enemies eliminated in quick succession",
    },
  ];

  const getRarityStyles = (rarity: string, value: number) => {
    const baseStyles =
      "relative bg-card border-2 p-6 transition-all duration-300 group";

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
              <Image
                src={
                  "https://static.wikia.nocookie.net/leagueoflegends/images/3/38/Noxus_Crest_icon.png/revision/latest?cb=20161117055828"
                }
                alt={"Noxus Axe"}
                width={40}
                height={40}
              />
              <h2 className="text-foreground text-3xl font-bold tracking-wide uppercase">
                Multikill Achievements
              </h2>
            </div>
            <div className="bg-primary mt-2 h-1 w-20"></div>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm tracking-wider uppercase">
              Total Multikills
            </p>
            <p className="text-primary text-4xl font-bold">{totalMultikills}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {multikills.map((multikill, index) => (
            <div
              key={multikill.label}
              className={getRarityStyles(multikill.rarity, multikill.value)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {multikill.value > 0 && multikill.rarity === "legendary" && (
                <div className="bg-noxus-gold text-noxus-black absolute -top-3 -right-3 animate-pulse rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-lg">
                  Legendary!
                </div>
              )}
              {multikill.value > 0 &&
                multikill.rarity === "rare" &&
                multikill.value >= 3 && (
                  <div className="bg-noxus-red absolute -top-3 -right-3 rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-lg">
                    Rare!
                  </div>
                )}

              <div
                className={`mb-4 ${getRarityTextColor(multikill.rarity, multikill.value)} transition-transform duration-300 group-hover:scale-110`}
              >
                {multikill.icon}
              </div>

              <h3 className="text-foreground mb-1 text-xl font-bold">
                {multikill.label}
              </h3>

              <p className="text-muted-foreground mb-4 min-h-[2.5rem] text-xs">
                {multikill.description}
              </p>

              <div className="border-border mt-auto border-t pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground text-sm tracking-wide uppercase">
                    Count
                  </span>
                  <span
                    className={`text-4xl font-bold ${getRarityTextColor(multikill.rarity, multikill.value)}`}
                  >
                    {multikill.value}
                  </span>
                </div>
              </div>

              {multikill.value === 0 && (
                <div className="bg-background/50 absolute inset-0 flex items-center justify-center rounded backdrop-blur-[1px]">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm font-semibold">
                      Not Yet Achieved
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-card/30 border-border mt-8 rounded border p-6">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <p className="text-muted-foreground mb-1 text-sm tracking-wider uppercase">
                Most Common
              </p>
              <p className="text-primary text-2xl font-bold">
                {doubleKills > 0 ? "Double Kill" : "None"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm tracking-wider uppercase">
                Rarest Achievement
              </p>
              <p className="text-noxus-gold text-2xl font-bold">
                {pentaKills > 0
                  ? "Penta Kill"
                  : quadraKills > 0
                    ? "Quadra Kill"
                    : tripleKills > 0
                      ? "Triple Kill"
                      : "Double Kill"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm tracking-wider uppercase">
                Total Eliminations
              </p>
              <p className="text-primary text-2xl font-bold">
                {doubleKills * 2 +
                  tripleKills * 3 +
                  quadraKills * 4 +
                  pentaKills * 5}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm tracking-wider uppercase">
                Achievement Rate
              </p>
              <p className="text-primary text-2xl font-bold">
                {totalMultikills > 0
                  ? `${(((tripleKills + quadraKills + pentaKills) / totalMultikills) * 100).toFixed(0)}%`
                  : "0%"}
              </p>
              <p className="text-muted-foreground text-xs">Triple+ Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
