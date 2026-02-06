"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatLabel, CHART_PALETTE } from "@/lib/dissection-utils";

interface HorizontalBarChartProps {
  data: [string, number][];
  total: number;
  height?: number;
  onBarClick?: (key: string) => void;
}

export function HorizontalBarChart({
  data,
  total,
  height = 400,
  onBarClick,
}: HorizontalBarChartProps) {
  const chartData = data.map(([key, value]) => ({
    name: formatLabel(key),
    rawKey: key,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
      >
        <XAxis type="number" tick={{ fontSize: 11, fill: "#4A5568" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={160}
          tick={{ fontSize: 12, fill: "#1A202C" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [
            `${value} preguntas (${((Number(value) / total) * 100).toFixed(1)}%)`,
            "",
          ]}
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            fontSize: 13,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          cursor={{ fill: "rgba(49,89,167,0.06)" }}
        />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          cursor={onBarClick ? "pointer" : undefined}
          onClick={(_data, index) => {
            if (onBarClick && index >= 0) onBarClick(chartData[index].rawKey);
          }}
        >
          {chartData.map((_, i) => (
            <Cell
              key={i}
              fill={CHART_PALETTE[i % CHART_PALETTE.length]}
              opacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
