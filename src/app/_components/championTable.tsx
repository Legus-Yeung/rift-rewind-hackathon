"use client";

import data from "../../../data/mockData.json";

export default function ChampionsTable() {
  const champions = data.championStats;

return (
    <table className="table-auto border-collapse border border-gray-700">
      <thead>
        <tr className="bg-gray-800">
          <th className="border border-gray-700 px-4 py-2">Champion</th>
          <th className="border border-gray-700 px-4 py-2">Games Played</th>
          <th className="border border-gray-700 px-4 py-2">Wins</th>
          <th className="border border-gray-700 px-4 py-2">Win Rate</th>
        </tr>
      </thead>
      <tbody>
        {champions.map((champion) => (
          <tr key={champion.name} className="hover:bg-gray-800 transition">
            <td className="border border-gray-700 px-4 py-2">{champion.name}</td>
            <td className="border border-gray-700 px-4 py-2">{champion.played}</td>
            <td className="border border-gray-700 px-4 py-2">{champion.wins}</td>
            <td className="border border-gray-700 px-4 py-2">
              {champion.winRate.toFixed(1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
);
}
