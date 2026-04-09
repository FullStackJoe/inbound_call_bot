import { KpiCards } from "@/components/analytics/KpiCards";
import { CallsChart } from "@/components/analytics/CallsChart";
import { CallsTable } from "@/components/analytics/CallsTable";
import { mockCalls, getKpiMetrics, getDailyStats } from "@/data/mockCalls";

const metrics = getKpiMetrics(mockCalls);
const dailyStats = getDailyStats(mockCalls);

export function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="space-y-6">
        <KpiCards metrics={metrics} />
        <CallsChart data={dailyStats} />
        <CallsTable calls={mockCalls} />
      </div>
    </main>
  );
}
