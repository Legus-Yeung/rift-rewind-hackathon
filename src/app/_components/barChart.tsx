"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from "recharts";
import data from "../../../data/mockData.json";

export default function ChampionWinRateChart() {
  const champions = data.championStats;

  return (
    <div className="w-full h-96 bg-gray-900 p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center text-white mb-4">Champion Win Rates</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={champions}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip labelStyle={{color:"#000000ff"}}/>
          <Legend />
          <Bar dataKey="winRate" fill="#8884d8" name="Win Rate (%)" />
          <Bar dataKey="played" fill="#82ca9d" name="Games Played" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
