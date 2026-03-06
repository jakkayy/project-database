"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesData {
  date: string;
  total: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs">
      <p className="text-neutral-400 mb-1">{label}</p>
      <p className="font-bold text-[#C9A84C]">฿{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function SalesChart({ data }: { data: SalesData[] }) {
  if (data.length === 0) {
    return (
      <p className="text-xs text-neutral-500 pt-4">ยังไม่มีข้อมูลยอดขาย</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#737373", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#737373", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `฿${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="green"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "green", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
