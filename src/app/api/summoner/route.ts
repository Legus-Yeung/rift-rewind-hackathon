import { NextResponse, type NextRequest } from "next/server";
import { fetchAccount, fetchAllMatchIds } from "~/lib/riot/riot-api-utils";
import { getMatchStats } from "~/lib/summoner/summoner-api-utils";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get("gameName")?.trim();
  const tagLine = searchParams.get("tagLine")?.trim();

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: "gameName and tagLine are required" },
      { status: 400 },
    );
  }

  try {
    const account = await fetchAccount(gameName, tagLine);
    const matchIds = await fetchAllMatchIds(
      account.puuid,
      new URLSearchParams(),
    );
    const analysis = await getMatchStats(account.puuid, matchIds);

    return NextResponse.json({
      account: {
        gameName: account.gameName ?? gameName,
        tagLine: account.tagLine ?? tagLine,
        profileIconId: analysis.profileIconId,
      },
      stats: analysis.stats,
    });
  } catch (error) {
    console.error("Failed to analyze summoner:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze summoner data",
      },
      { status: 502 },
    );
  }
}
