"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import data from "../../../data/mockData.json";

export default function WinRateOverTimeChart() {
  const timeline = data.timeline;

  return (
    <div className="w-full h-96 bg-gray-900 p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center text-white mb-4">Win Rate Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timeline}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="match" stroke="#ccc" label={{ value: "Match", position: "insideBottom", offset: -5, fill: "#ccc" }} />
          <YAxis stroke="#ccc" label={{ value: "Win Rate %", angle: -90, position: "insideLeft", fill: "#ccc" }} />
          <Tooltip labelStyle={{color:"#000000ff"}}/>
          <Line type="monotone" dataKey="winRate" stroke="#82ca9d" strokeWidth={3} dot={{ r: 5, fill: "#fff" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
