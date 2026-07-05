"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardLineChartPoint = {
  amount: number;
  day: string;
};

type DashboardLineChartProps = {
  data: DashboardLineChartPoint[];
};

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} jt`;
  }

  return `Rp ${(value / 1_000).toFixed(0)} rb`;
}

export function DashboardLineChart({ data }: DashboardLineChartProps) {
  return (
    <div className="h-[112px] w-full [&_.recharts-surface:focus]:outline-none [&_.recharts-wrapper:focus]:outline-none">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={data}
          margin={{ bottom: 4, left: -24, right: 4, top: 12 }}
        >
          <CartesianGrid stroke="rgba(23,23,56,0.06)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="day"
            tick={{ fill: "rgba(23,23,56,0.32)", fontSize: 10, fontWeight: 500 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "rgba(23,23,56,0.28)", fontSize: 10, fontWeight: 500 }}
            tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            tickLine={false}
            width={34}
          />
          <Tooltip
            contentStyle={{
              background: "#fffffa",
              border: "1px solid rgba(23,23,56,0.08)",
              borderRadius: "16px",
              boxShadow: "0 14px 30px rgba(23,23,56,0.08)",
              color: "#171738",
            }}
            cursor={{ stroke: "rgba(48,102,190,0.18)", strokeWidth: 1.5 }}
            formatter={(value) => [
              formatCompactCurrency(typeof value === "number" ? value : 0),
              "Penghasilan",
            ]}
            labelStyle={{ color: "rgba(23,23,56,0.42)", fontSize: 12, fontWeight: 600 }}
          />
          <Line
            activeDot={{ r: 4, stroke: "#3066BE", strokeWidth: 0 }}
            dataKey="amount"
            dot={false}
            stroke="#3066BE"
            strokeLinecap="round"
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
