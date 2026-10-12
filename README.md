# Rift Rewind 🎮

A year-end report for League of Legends players that analyzes your season and compares wins vs losses to identify what drives success.

## Deploy Link
https://rift-rewind-yh1o.onrender.com/

## What It Does

Rift Rewind generates personalized year-end reports featuring:
- **Season Overview**: KDA, games played, gold, damage
- **AI Insights**: Personalized analysis using AWS Bedrock
- **Champion Performance**: Top champions with stats
- **Matchup Analysis**: Best matchups and positions
- **Vision & Objective Control**: Wards and objective statistics
- **KDA Trends**: Performance across champions
- **Player Comparison**: Side-by-side with friends
- **Shareable Reports**: Export your year-end summary

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Recharts
- **Backend**: tRPC, NextAuth.js
- **AI**: AWS Bedrock (Qwen model)
- **API**: Riot Games API with custom rate limiting

## How It Works

Aggregates match data from the Riot API, compares metrics between wins and losses, and uses AI to generate insights that explain winning patterns.

## Running With Live Riot Data

Set `RIOT_API_KEY` in your local environment before starting the app. The key is
used only by server-side routes and must not be prefixed with `NEXT_PUBLIC_`.
Summoner pages look up the Riot ID entered on the home page, then analyze the 50
most recent ranked solo/duo matches. The current Riot API client uses the
Americas regional cluster.

For local development, add the key to `.env.local` (or your existing `.env`)
and restart the dev server after changing it. Do not commit the key.

## Built For

AWS + Riot Games Rift Rewind Hackathon

---

*Built with ❤️ for the League of Legends community*
