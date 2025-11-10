"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type BarChartData = Record<string, string | number>;

interface YKeyConfig {
  key: string; // the actual property name in the data
  label?: string; // optional alias to show on chart
}

interface BarChartProps {
  title: string;
  xKey: string; // property name for x-axis
  yKeys: YKeyConfig[]; // array of key + optional alias
  data: BarChartData[];
}

/**
 * A general-purpose bar chart
 * 
 * Example usage:
 * 
 *        const championStats = [
            { name: "Riven", wins: 260, losses: 399 },
            { name: "Ahri", wins: 300, losses: 500 },
          ];
 * 
 *        <GeneralBarChart
            title="Champion Win Rates"
            xKey="name"
            yKeys={[
              { key: "wins", label: "Wins" },
              { key: "losses", label: "Losses" },
            ]}
            data={championStats}
          />
 * 
 * @param param0 - a {@link BarChartProps} with data for the chart
 * @returns a bar chart
 */
export default function GeneralBarChart({
  title,
  xKey,
  yKeys,
  data,
}: BarChartProps) {
  return (
    <div className="h-96 w-full rounded-2xl bg-gray-900 p-4 shadow-lg">
      <h2 className="mb-4 text-center text-xl font-bold text-white">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey={xKey} stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip labelStyle={{ color: "#000000ff" }} />
          <Legend />
          {yKeys.map((yKeyConfig, index) => (
            <Bar
              key={yKeyConfig.key}
              dataKey={yKeyConfig.key}
              name={yKeyConfig.label ?? yKeyConfig.key} // show alias if provided
              fill={`hsl(${index * 60}, 70%, 50%)`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
