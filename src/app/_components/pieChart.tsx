"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import data from "../../../data/mockData.json";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff69b4"];

export default function ChampionPieChart() {
  const champions = data.championStats;

  return (
    <div className="w-full h-96 bg-gray-900 p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center text-white mb-4">Champion Play Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={champions}
            dataKey="played"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {champions.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            labelStyle={{ color: "#f9fafb" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
