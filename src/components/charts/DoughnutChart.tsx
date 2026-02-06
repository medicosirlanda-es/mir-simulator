"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatLabel, CHART_PALETTE } from "@/lib/dissection-utils";

interface DoughnutChartProps {
  data: [string, number][];
  total: number;
  height?: number;
}

export function DoughnutChart({ data, total, height = 260 }: DoughnutChartProps) {
  const chartData = data.map(([key, value]) => ({
    name: formatLabel(key),
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((_, i) => (
            <Cell
              key={i}
              fill={CHART_PALETTE[i % CHART_PALETTE.length]}
              opacity={0.85}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [
            `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
            name,
          ]}
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            fontSize: 13,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
