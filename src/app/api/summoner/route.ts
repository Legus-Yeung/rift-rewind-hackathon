import { NextResponse, type NextRequest } from "next/server";
import { apiRequest } from "~/lib/api/request-utils";
import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import {
  getChampionGames,
  type SummonerEntry,
} from "~/lib/summoner/summoner-utils";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  // Fetch base account info
  const accountData: AccountDto = await apiRequest<AccountDto>(
    `${baseUrl}/api/riot?action=account&gameName=${gameName ?? ""}&tagLine=${tagLine ?? ""}`,
  );

  // Get match history and details
  const matchHistory: string[] = await apiRequest<string[]>(
    `${baseUrl}/api/riot?action=match-history&puuid=${accountData.puuid}&searchParams=${new URLSearchParams()}`,
  );

  const encoder = new TextEncoder();

  // Create a readable stream for the response
  const stream = new ReadableStream({
    async start(controller) {
      // Send heartbeat every 5 seconds
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(" \n")); // space + newline keeps connection alive
      }, 5000);

      try {
        // Fetch stats concurrently
        const summoner: SummonerEntry = await getChampionGames(
          accountData.puuid,
          matchHistory ?? [],
        );

        const dir = path.join(process.cwd(), "data");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filePath = path.join(
          dir,
          `stats_${gameName}-${tagLine}-${timestamp}.json`,
        );

        fs.writeFileSync(filePath, JSON.stringify(summoner, null, 2));

        return NextResponse.json({ success: true, path: filePath });

        // Send the final JSON result
        controller.enqueue(encoder.encode(JSON.stringify(summoner)));
      } catch (err) {
        controller.enqueue(encoder.encode(JSON.stringify({ error: err })));
      } finally {
        clearInterval(heartbeat);
        controller.close();
      }
    },
  });
}
