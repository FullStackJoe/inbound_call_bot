import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { DailyStats } from "@/data/mockCalls";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block size-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CallsChart({ data }: { data: DailyStats[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Call Volume</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -12, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.5 }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
            />
            <Bar
              dataKey="totalCalls"
              name="Total Calls"
              fill="var(--color-chart-2)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="transferred"
              name="Transferred"
              fill="#34d399"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
