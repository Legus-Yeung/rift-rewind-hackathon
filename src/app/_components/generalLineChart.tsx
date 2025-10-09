"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type LineChartData = Record<string, string | number | Date>;

interface YKeyConfig {
  key: string; // the actual property name in the data
  label?: string; // optional alias to show on chart
}

interface XKeyConfig {
  key: string; // the actual property name in the data
  label?: string; // optional alias to show on chart
}

interface LineChartProps {
  title: string;
  xKey: XKeyConfig; // property name for x-axis
  yKeys: YKeyConfig[]; // array of key + optional alias
  data: LineChartData[];
  xType?: "category" | "number" | "time";
}

/**
 * A general-purpose line chart
 * 
 * Example usage:
 * 
 *        const gameStats = [
            { gameNum: 1, kills: 5, deaths: 6 },
            { gameNum: 2, kills: 10, deaths: 1 },
          ];
 * 
 *        <GeneralLineChart
            title={"Champs"}
            xKey={{ key: "gameNum", label: "Game Number" }}
            yKeys={[
              { key: "kills", label: "Kills" },
              { key: "deaths", label: "Deaths" },
            ]}
            data={gameStats}
            xType="number"
          ></GeneralLineChart>
 * 
 * @param param0 - a {@link LineChartProps} with data for the chart
 * @returns a bar chart
 */
export default function GeneralLineChart({
  title,
  xKey,
  yKeys,
  data,
  xType = "category",
}: LineChartProps) {
  // Format ticks on the X-axis
  const tickFormatter = (tick: unknown): string => {
    if (xType === "time" && typeof tick === "number") {
      return new Date(tick).toLocaleDateString();
    }
    return String(tick);
  };

  // Tooltip label (for the X value)
  const tooltipLabelFormatter = (label: unknown): string => {
    if (xType === "time" && typeof label === "number") {
      return `${xKey.label ?? xKey.key}: ${new Date(label).toLocaleString()}`;
    }
    return `${xKey.label ?? xKey.key}: ${String(label)}`;
  };

  return (
    <div className="h-96 w-full rounded-2xl bg-gray-900 p-4 shadow-lg">
      <h2 className="mb-4 text-center text-xl font-bold text-white">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey={xKey.key}
            name={xKey.label ?? xKey.key}
            stroke="#ccc"
            type={xType as "category" | "number"}
            domain={
              xType === "number" || xType === "time"
                ? ["dataMin", "dataMax"]
                : undefined
            }
            scale={xType === "time" ? "time" : "auto"}
            tickFormatter={tickFormatter}
            allowDecimals={false}
            padding={{ left: 40, right: 40 }}
          />
          <YAxis stroke="#ccc" />
          <Tooltip
            labelFormatter={tooltipLabelFormatter}
            labelStyle={{ color: "#000000ff" }}
          />
          <Legend />
          {yKeys.map((yKeyConfig, index) => (
            <Line
              key={yKeyConfig.key}
              dataKey={yKeyConfig.key}
              name={yKeyConfig.label ?? yKeyConfig.key}
              stroke={`hsl(${index * 60}, 70%, 50%)`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
