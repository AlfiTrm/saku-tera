"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
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

  if (value < 1_000) {
    return `Rp ${value.toLocaleString("id-ID")}`;
  }

  return `Rp ${(value / 1_000).toFixed(0)} rb`;
}

function formatAxisCurrency(value: number) {
  if (value >= 1_000_000) {
    return `${Number((value / 1_000_000).toFixed(1))} jt`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} rb`;
  }

  return String(value);
}

export function DashboardLineChart({ data }: DashboardLineChartProps) {
  const totalIncome = data.reduce((total, point) => total + point.amount, 0);
  const peakIncome = data.reduce(
    (highest, point) => Math.max(highest, point.amount),
    0,
  );
  const activeDays = data.filter((point) => point.amount > 0).length;

  return (
    <div className="w-full">
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-primary/[0.055] px-3 py-2.5">
          <p className="text-[9px] font-semibold tracking-[0.08em] text-secondary/36">
            Total 30 hari
          </p>
          <p className="mt-1 text-sm font-bold tracking-[-0.02em] text-secondary">
            {formatCompactCurrency(totalIncome)}
          </p>
        </div>
        <div className="rounded-xl bg-tertiary/9 px-3 py-2.5">
          <p className="text-[9px] font-semibold tracking-[0.08em] text-secondary/36">
            Tertinggi
          </p>
          <p className="mt-1 text-sm font-bold tracking-[-0.02em] text-secondary">
            {formatCompactCurrency(peakIncome)}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between px-0.5">
        <p className="text-[10px] font-medium text-secondary/42">
          {activeDays} hari dengan penghasilan
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-secondary/38">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Penghasilan harian
        </span>
      </div>

      <div className="h-[132px] w-full [&_.recharts-surface:focus]:outline-none [&_.recharts-wrapper:focus]:outline-none">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data}
            margin={{ bottom: 2, left: 0, right: 2, top: 10 }}
          >
            <defs>
              <linearGradient id="dashboardIncomeFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3066BE" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3066BE" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="rgba(23,23,56,0.06)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="day"
              minTickGap={12}
              tick={{ fill: "rgba(23,23,56,0.32)", fontSize: 10, fontWeight: 500 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, "auto"]}
              tick={{ fill: "rgba(23,23,56,0.34)", fontSize: 9, fontWeight: 600 }}
              tickFormatter={formatAxisCurrency}
              tickLine={false}
              width={42}
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
            <Area
              activeDot={{ r: 4, fill: "#3066BE", stroke: "#fffffa", strokeWidth: 2 }}
              dataKey="amount"
              dot={false}
              fill="url(#dashboardIncomeFill)"
              stroke="#3066BE"
              strokeLinecap="round"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
