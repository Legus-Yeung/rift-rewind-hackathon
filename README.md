# Rift Rewind 🎮

A year-end report for League of Legends players that analyzes your season and compares wins vs losses to identify what drives success.

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

## Built For

AWS + Riot Games Rift Rewind Hackathon

---

*Built with ❤️ for the League of Legends community*
