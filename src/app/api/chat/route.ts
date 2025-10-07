import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { env } from "~/env.js";

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
}

const client = new BedrockRuntimeClient({ 
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json() as ChatRequest;
    const { question } = requestBody;

    const modelId = "qwen.qwen3-coder-30b-a3b-v1:0";

    const system_prompt = "You are a helpful assistant that specializes in League of Legends data analysis and game insights. Provide clear, concise answers about match data, champion statistics, and gameplay analysis.";

    const bedrockBody: BedrockRequestBody = {
      messages: [
        { 
          role: "system", 
          content: system_prompt, 
        },
        { role: "user", content: question }
      ],
      max_tokens: 512,
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
