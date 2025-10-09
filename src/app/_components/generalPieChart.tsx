"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type PieChartData = Record<string, string | number>;

interface PieChartProps {
  title: string;
  data: PieChartData[]; // array of objects
  dataKey: string; // property name for the numeric value
  nameKey: string; // property name for the label
  colors?: string[]; // optional color palette
  outerRadius?: number; // optional radius for pie slices
}

const DEFAULT_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00c49f",
  "#ff69b4",
];

/**
 * A general-purpose pie chart
 * 
 * Example usage:
 * 
 *        const championStats = [
            { name: "Riven", played: 260 },
            { name: "Ahri", played: 300 },
          ];
 * 
 *        <GeneralPieChart
            title="Champion Play Distribution"
            data={championStats}
            dataKey="played"
            nameKey="name"
            colors={["#82ca9d", "#ffc658", "#ff7f50"]}
            outerRadius={140}
          />
 * 
 * @param param0 - a {@link PieChartProps} with data for the chart
 * @returns a pie chart
 */
export default function GeneralPieChart({
  title,
  data,
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  outerRadius = 120,
}: PieChartProps) {
  return (
    <div className="h-96 w-full rounded-2xl bg-gray-900 p-4 shadow-lg">
      <h2 className="mb-4 text-center text-xl font-bold text-white">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            label={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip labelStyle={{ color: "#f9fafb" }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
