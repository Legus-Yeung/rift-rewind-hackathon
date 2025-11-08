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
  const gameName = searchParams.get("gameName") ?? "unknown";
  const tagLine = searchParams.get("tagLine") ?? "unknown";
  const save = searchParams.get("save") ?? true;

  const accountData: AccountDto = await apiRequest<AccountDto>(
    `${baseUrl}/api/riot?action=account&gameName=${gameName}&tagLine=${tagLine}`,
  );

  const matchHistory: string[] = await apiRequest<string[]>(
    `${baseUrl}/api/riot?action=match-history&puuid=${accountData.puuid}&searchParams=${new URLSearchParams()}`,
  );

  console.log(`Analyzing ${matchHistory.length} matches...`);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(" \n"));
      }, 5000);

      try {
        const summoner: SummonerEntry = await getChampionGames(
          accountData.puuid,
          matchHistory ?? [],
        );

        // Optionally save to file
        if (save) {
          const dir = path.join(process.cwd(), "data");
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const filePath = path.join(
            dir,
            `stats_${gameName}-${tagLine}-${timestamp}.json`,
          );
          fs.writeFileSync(filePath, JSON.stringify(summoner, null, 2));
        }
        controller.enqueue(
          encoder.encode(JSON.stringify({ success: true, data: summoner })),
        );
      } catch (err) {
        controller.enqueue(encoder.encode(JSON.stringify({ error: err })));
      } finally {
        clearInterval(heartbeat);
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "application/json" },
  });
}
