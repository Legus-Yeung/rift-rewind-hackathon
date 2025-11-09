import type { SummonerEntry } from "./summoner-interface-utils";

export async function analyzeAccount(
  gameName: string,
  tagLine: string,
  save = true,
): Promise<SummonerEntry> {
  const params = new URLSearchParams({ gameName, tagLine, save: String(save) });
  const response = await fetch(`/api/analyze?${params.toString()}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
      }
    }

    const lastBrace = fullText.lastIndexOf("}");
    const jsonString = fullText.slice(fullText.indexOf("{"), lastBrace + 1);
    const result = JSON.parse(jsonString);

    if (result.error) {
      console.error("Server error:", result.error);
      throw new Error(result.error?.message ?? "Unknown server error");
    }

    console.log("Success:", result.data);
    return result.data as SummonerEntry;
  } catch (err) {
    console.error("Failed to process stream:", err);
    throw err;
  }
}

type ChampionData = {
  id: string; // PascalCase ID, e.g., "MissFortune"
  key: string; // Numeric ID, e.g., "21"
  name: string; // Full in-game name, e.g., "Miss Fortune"
  title: string;
};

/**
 * Given a championName (PascalCase like "MissFortune"),
 * returns the official in-game name (e.g., "Miss Fortune").
 *
 * @param championName the unique PascalCase identifier for the champion
 * @returns the official in-game name, or the gameName if there is no in-game
 * @throws an {@link Error} when champion data cannot be fetched
 */
export async function getChampionInGameName(
  championName: string,
): Promise<string | null> {
  try {
    // Fetch Data Dragon champion list
    const res = await fetch(
      "https://ddragon.leagueoflegends.com/cdn/14.20.1/data/en_US/champion.json",
    );
    if (!res.ok) throw new Error("Failed to fetch champion data");

    const data: { data: Record<string, ChampionData> } = (await res.json()) as {
      data: Record<string, ChampionData>;
    };

    const champion: ChampionData | undefined = data.data[championName];
    if (!champion) return null;

    return champion.name;
  } catch (err) {
    console.error("Error fetching champion in-game name:", err);
    return null;
  }
}
