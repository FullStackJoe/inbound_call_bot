import { Phone, PhoneForwarded, Clock, Timer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { KpiMetrics } from "@/data/mockCalls";
import { formatDuration } from "@/data/mockCalls";

export function KpiCards({ metrics }: { metrics: KpiMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Calls</CardDescription>
            <Phone className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums">
            {metrics.totalCalls}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Transferred to Sales</CardDescription>
            <PhoneForwarded className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums">
            {metrics.transferred}
          </CardTitle>
          <CardDescription>
            {metrics.transferredPct.toFixed(1)}% of calls
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Avg Call Duration</CardDescription>
            <Clock className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums">
            {formatDuration(metrics.avgDurationSeconds)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Call Minutes</CardDescription>
            <Timer className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums">
            {metrics.totalMinutes}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
