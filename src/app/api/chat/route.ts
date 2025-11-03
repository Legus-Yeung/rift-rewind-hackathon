import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { env } from "~/env.js";
import type { YearEndSummaryData } from "~/lib/player/year-end-summary.types";

interface BedrockMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface BedrockRequestBody {
  messages: BedrockMessage[];
  max_tokens: number;
}

interface BedrockChoice {
  message: {
    content: string;
  };
}

interface BedrockResponse {
  choices?: BedrockChoice[];
}

interface ChatRequest {
  question: string;
  playerData?: YearEndSummaryData;
}

const client = new BedrockRuntimeClient({ 
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

function generateSystemPrompt(playerData?: YearEndSummaryData): string {
  const basePrompt = `You are an enthusiastic and supportive League of Legends coaching agent specializing in year-end player summaries and retrospectives. Your role is to help players celebrate their achievements, reflect on their growth, and identify areas for improvement.

Your personality:
- Celebratory and positive: Congratulate players on their accomplishments, no matter how big or small
- Encouraging: Highlight progress and growth, especially rank improvements
- Insightful: Provide meaningful analysis that goes beyond basic statistics
- Constructive: When suggesting improvements, frame them as opportunities for growth
- Engaging: Make responses fun and shareable, like a friend reviewing your year in League

Your capabilities:
- Analyze comprehensive match history data to identify trends and patterns
- Celebrate achievements like rank climbs, win streaks, pentakills, and champion mastery
- Provide personalized insights based on player-specific statistics
- Compare performance across different champions, positions, and time periods
- Identify persistent strengths and areas for growth
- Generate shareable moments and insights that players can discuss with friends

Response style:
- Start with congratulations and celebration when appropriate
- Use specific statistics and examples from the player's data
- Be conversational and friendly, not overly formal
- Include emoji occasionally to add personality (but don't overuse)
- Make insights actionable and specific
- Highlight surprising or impressive statistics`;

  if (!playerData) {
    return `${basePrompt}

Note: No player data is currently provided. Ask the user for their player data or provide general League of Legends insights.`;
  }

  const { playerOverview, championStats, highlights, strengths, achievements, monthlyStats } = playerData;

  const dataSummary = `
=== PLAYER DATA SUMMARY ===

Player: ${playerOverview.summonerName}#${playerOverview.tagLine}
Current Rank: ${playerOverview.currentRank}${playerOverview.currentTier ? ` ${playerOverview.currentTier}` : ""}
Rank Progression: ${playerOverview.startingRank || "Unknown"} → ${playerOverview.currentRank}
Total Games: ${playerOverview.totalGames} (${playerOverview.wins}W / ${playerOverview.losses}L)
Win Rate: ${playerOverview.winRate.toFixed(1)}%
Average KDA: ${playerOverview.averageKDA.toFixed(2)}

Top Champions:
${championStats.slice(0, 5).map(champ => 
  `- ${champ.name}: ${champ.played} games, ${champ.winRate.toFixed(1)}% WR, ${champ.averageKDA.toFixed(2)} KDA`
).join("\n")}

Key Highlights:
- Most Played: ${highlights.mostPlayedChampion}
- Best Win Rate Champion: ${highlights.bestWinRateChampion}
- Longest Win Streak: ${highlights.longestWinStreak} games
- Total Pentakills: ${highlights.totalPentakills || 0}
- Highest Kills: ${highlights.highestKillsGame.kills} (${highlights.highestKillsGame.champion})

Major Strengths:
${strengths.map(s => `- ${s.category}: ${s.description} (Rating: ${s.rating}/10)`).join("\n")}

Achievements:
${achievements.map(a => `- ${a.title}: ${a.description} (${a.rarity})`).join("\n")}

Monthly Performance:
${monthlyStats.map(m => `${m.month}: ${m.winRate.toFixed(1)}% WR (${m.games} games)`).join(", ")}

=== END DATA SUMMARY ===

When responding to questions:
1. Reference specific data from the summary above
2. Celebrate achievements and rank progression
3. Use actual numbers and statistics from the data
4. Provide personalized insights based on their champion pool and performance
5. Be encouraging and highlight what they've done well
6. Frame improvements as opportunities, not failures`;

  return `${basePrompt}\n\n${dataSummary}`;
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json() as ChatRequest;
    const { question, playerData } = requestBody;

    const modelId = "openai.gpt-oss-120b-1:0";

    const systemPrompt = generateSystemPrompt(playerData);

    const bedrockBody: BedrockRequestBody = {
      messages: [
        { 
          role: "system", 
          content: systemPrompt, 
        },
        { role: "user", content: question }
      ],
      max_tokens: 1024,
    };

    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify(bedrockBody),
    });

    const response = await client.send(command);
    const responseStr = new TextDecoder().decode(response.body);
    const responseJson = JSON.parse(responseStr) as BedrockResponse;

    let assistantContent: string | undefined = undefined;

    if (responseJson.choices?.length && responseJson.choices.length > 0) {
      assistantContent = responseJson.choices[0]?.message?.content;
    }

    return NextResponse.json({
      question,
      answer: assistantContent ?? "No response found",
    });
  } catch (err: unknown) {
    console.error("Error invoking Bedrock:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
