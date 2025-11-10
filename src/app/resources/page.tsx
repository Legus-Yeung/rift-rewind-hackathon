"use client";

import React from "react";
import Navbar from "../_components/navBar";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <title>Resources | Rift Rewind</title>
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Resources</h1>
          <div className="bg-primary h-1 w-20"></div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Methodology</h2>
          <div className="bg-card border border-border p-8 rounded-lg space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                How the Coaching Agent Works
              </h3>
              <p className="text-foreground leading-relaxed">
                Our AI coaching agent transforms raw League of Legends match data into personalized,
                actionable insights. The system uses a structured approach to analyze player
                performance by comparing statistics between winning and losing games, identifying
                patterns that correlate with success, and generating recommendations tailored to
                each player&apos;s unique playstyle.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Match Data Analysis Approach
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                The core of our analysis methodology centers on <strong>win/loss comparison</strong>.
                Rather than simply aggregating statistics, we compare performance metrics across
                different game outcomes to identify what truly drives success:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>
                  <strong>Performance Metrics:</strong> KDA ratios, damage output, gold efficiency,
                  and death counts are compared between wins and losses to identify key
                  performance indicators.
                </li>
                <li>
                  <strong>Objective Control:</strong> Baron Nashor, Dragon, Rift Herald, and
                  Scuttle Crab participation rates are analyzed to understand objective-focused
                  gameplay patterns.
                </li>
                <li>
                  <strong>Vision Control:</strong> Ward placement, vision score, and map awareness
                  metrics reveal how map control correlates with victory.
                </li>
                <li>
                  <strong>Role & Champion Performance:</strong> Position-specific statistics and
                  champion mastery data help identify where players excel and where they can
                  improve.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">Data Sources</h3>
              <p className="text-foreground leading-relaxed mb-4">
                Our system leverages the <strong>Riot Games Developer API</strong> to fetch
                comprehensive match data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>
                  <strong>Match History API:</strong> Retrieves match IDs for a player&apos;s account
                  across the season
                </li>
                <li>
                  <strong>Match Details API:</strong> Provides complete game statistics including
                  K/D/A, gold, damage, objectives, and vision control
                </li>
                <li>
                  <strong>Match Timeline API:</strong> Offers granular event-level data for
                  advanced analysis (future enhancement)
                </li>
                <li>
                  <strong>Account API:</strong> Fetches player account information and summoner
                  details
                </li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                All data is processed and aggregated to create a comprehensive player profile that
                includes aggregate statistics, averages, and position-specific breakdowns.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Logic Behind Key Insights
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                The AI agent uses a carefully crafted system prompt that guides analysis through
                three distinct phases:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-foreground ml-4">
                <li>
                  <strong>Celebratory Recognition:</strong> Acknowledges player dedication,
                  achievements, and overall performance to create an engaging, positive experience.
                </li>
                <li>
                  <strong>Win/Loss Comparison:</strong> Analyzes specific metrics (KDA, objective
                  control) that differ significantly between wins and losses, providing concrete
                  evidence of what works.
                </li>
                <li>
                  <strong>Winning Formula Identification:</strong> Synthesizes patterns to explain
                  what behaviors and playstyles lead to victory, offering actionable insights
                  rather than generic advice.
                </li>
              </ol>
              <p className="text-foreground leading-relaxed mt-4">
                The system emphasizes brevity and specificity—each insight is backed by concrete
                numbers and focuses on 2-3 key factors that most strongly correlate with success.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Discoveries & Development Insights
              </h3>
              <div className="space-y-4 text-foreground">
                <div>
                  <h4 className="font-semibold mb-2">Key Discoveries:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Win/Loss Comparison is More Valuable Than Aggregates:</strong> Simply
                      showing average KDA doesn&apos;t reveal what makes a player win. Comparing
                      performance between wins and losses provides actionable insights.
                    </li>
                    <li>
                      <strong>Objective Control is a Strong Predictor:</strong> Players with high
                      Baron/Dragon participation rates in wins show significantly better objective
                      focus, which correlates strongly with victory.
                    </li>
                    <li>
                      <strong>Position Matters:</strong> Players often perform better in specific
                      roles (e.g., jungle vs. top lane), and identifying these strengths helps
                      players understand their optimal playstyle.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Challenges Encountered:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Response Length Control:</strong> Initial AI responses were too
                      verbose. We refined the system prompt with strict paragraph limits and
                      structure requirements to ensure concise, focused insights.
                    </li>
                    <li>
                      <strong>Data Parsing:</strong> Extracting meaningful patterns from raw match
                      data required careful aggregation logic to handle edge cases and ensure
                      accurate statistics.
                    </li>
                    <li>
                      <strong>Personalization at Scale:</strong> Creating insights that feel
                      personal while maintaining consistency required balancing specific data
                      references with generalizable patterns.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Improvements Made:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Implemented a structured 3-paragraph format that ensures consistency and
                      readability
                    </li>
                    <li>
                      Developed a win/loss comparison framework that provides more actionable
                      insights than aggregate statistics alone
                    </li>
                    <li>
                      Created a modular data processing system that can handle various match data
                      structures and edge cases
                    </li>
                    <li>
                      Optimized prompt engineering to reduce token usage while maintaining insight
                      quality
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Tooling</h2>
          <div className="bg-card border border-border p-8 rounded-lg space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">AWS AI Services</h3>
              <p className="text-foreground leading-relaxed mb-4">
                Rift Rewind leverages <strong>Amazon Bedrock</strong>, AWS&apos;s fully managed service
                for building and scaling generative AI applications. Bedrock provides access to a
                variety of foundation models through a unified API.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">Amazon Bedrock</h3>
              <p className="text-foreground leading-relaxed mb-4">
                Amazon Bedrock serves as the core AI infrastructure for our coaching agent. We use
                the Bedrock Runtime API to invoke foundation models and generate personalized
                insights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>
                  <strong>BedrockRuntimeClient:</strong> The primary client for interacting with
                  Bedrock models, configured with AWS credentials and region settings
                </li>
                <li>
                  <strong>InvokeModelCommand:</strong> Used to send requests to specific
                  foundation models with structured prompts and parameters
                </li>
                <li>
                  <strong>Message-Based Interface:</strong> Our implementation uses a chat-style
                  message format with system prompts and user queries for context-aware responses
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">Qwen Model</h3>
              <p className="text-foreground leading-relaxed mb-4">
                We utilize the <strong>Qwen3 Coder 30B</strong> model (model ID:
                <code className="bg-background px-2 py-1 rounded text-sm">
                  qwen.qwen3-coder-30b-a3b-v1:0
                </code>
                ) available through Amazon Bedrock. This model was selected for its:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>
                  <strong>Token Efficiency:</strong> Balanced performance-to-cost ratio for
                  generating concise, focused insights
                </li>
                <li>
                  <strong>Analytical Capabilities:</strong> Strong performance in understanding
                  structured data and generating data-driven insights
                </li>
                <li>
                  <strong>Instruction Following:</strong> Excellent adherence to structured prompts
                  and format requirements
                </li>
                <li>
                  <strong>Context Understanding:</strong> Ability to process complex player
                  statistics and generate coherent, personalized narratives
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">Integration Architecture</h3>
              <p className="text-foreground leading-relaxed mb-4">
                Our integration follows a clean, modular architecture:
              </p>
              <div className="bg-background p-4 rounded border border-border">
                <ol className="list-decimal list-inside space-y-2 text-foreground ml-4">
                  <li>
                    <strong>Data Collection:</strong> Match data is fetched from Riot Games API
                    and processed into structured player profiles
                  </li>
                  <li>
                    <strong>Profile Formatting:</strong> Player statistics are formatted into a
                    comprehensive markdown profile that serves as context for the AI
                  </li>
                  <li>
                    <strong>Prompt Engineering:</strong> A detailed system prompt defines
                    the AI&apos;s role, analysis approach, and response structure
                  </li>
                  <li>
                    <strong>Model Invocation:</strong> Bedrock Runtime API is called with the
                    system prompt and user query to generate insights
                  </li>
                  <li>
                    <strong>Response Processing:</strong> Generated insights are parsed and
                    integrated into the UI, displayed in relevant sections of the player profile
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">Configuration</h3>
              <p className="text-foreground leading-relaxed mb-4">
                The system is configured using environment variables for secure credential
                management:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>
                  <code className="bg-background px-2 py-1 rounded text-sm">
                    AWS_ACCESS_KEY_ID
                  </code>{" "}
                  and{" "}
                  <code className="bg-background px-2 py-1 rounded text-sm">
                    AWS_SECRET_ACCESS_KEY
                  </code>
                  : AWS credentials for Bedrock access
                </li>
                <li>
                  <code className="bg-background px-2 py-1 rounded text-sm">AWS_REGION</code>:
                  AWS region where Bedrock is configured (defaults to us-east-1)
                </li>
                <li>
                  <code className="bg-background px-2 py-1 rounded text-sm">RIOT_API_KEY</code>:
                  Riot Games API key for match data access
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Limitations and Future Considerations
          </h2>
          <div className="bg-card border border-border p-8 rounded-lg space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Riot API Key Limitations
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                The current implementation uses a development API key from Riot Games, which comes
                with significant limitations:
              </p>
              <div className="bg-background p-4 rounded border border-border mb-4">
                <p className="text-foreground font-semibold mb-2">⚠️ Important Notice:</p>
                <p className="text-foreground mb-2">
                  This API key is to be used for development only. Please register any permanent
                  products.
                </p>
                <p className="text-foreground font-semibold text-red-500 mb-2">
                  Do NOT use this API key in a publicly available product!
                </p>
                <p className="text-foreground text-sm">
                  Expired: Sun, Nov 9th, 2025 @ 9:51pm (PT)
                </p>
                <p className="text-foreground text-sm">
                  Your key has expired. You must regenerate your API key.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Rate Limits:</h4>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                  <li>
                    <strong>20 requests every 1 second(s)</strong>
                  </li>
                  <li>
                    <strong>100 requests every 2 minutes(s)</strong>
                  </li>
                </ul>
                <p className="text-foreground leading-relaxed mt-3 text-sm">
                  Note that rate limits are enforced per routing value (e.g., na1, euw1, americas).
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Backend Service Architecture Recommendation
              </h3>
              <p className="text-foreground leading-relaxed mb-4">
                For production use and improved scalability, we recommend implementing a backend
                service architecture:
              </p>
              <ul className="list-disc list-inside space-y-3 text-foreground ml-4">
                <li>
                  <strong>Centralized Data Fetching:</strong> A dedicated backend service would
                  handle all Riot API calls, managing rate limits and API key rotation more
                  effectively.
                </li>
                <li>
                  <strong>Data Processing & Computation:</strong> The backend would process and
                  compute player statistics, aggregating match data into comprehensive player
                  profiles before serving to the frontend.
                </li>
                <li>
                  <strong>Database Storage:</strong> Player data and computed statistics would be
                  stored in a database, reducing redundant API calls and improving response times.
                </li>
                <li>
                  <strong>Incremental Updates:</strong> When a player has new games, the system
                  would pull previous data from the database, identify new matches, and append only
                  the new data to existing records. This approach:
                  <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                    <li>Reduces API calls by only fetching new matches</li>
                    <li>Maintains historical data continuity</li>
                    <li>Enables faster profile generation for returning players</li>
                    <li>Allows for efficient data caching and optimization</li>
                  </ul>
                </li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                This architecture would significantly improve performance, reduce API costs, and
                provide a more scalable foundation for handling multiple concurrent users.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-16 pt-8 border-t border-border text-center text-muted-foreground">
          <p>Built for the AWS + Riot Games Rift Rewind Hackathon</p>
        </div>
      </main>
    </div>
  );
}

