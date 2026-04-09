export type CallOutcome =
  | "Successfully Transferred to Sales"
  | "Bad MC Number"
  | "No Load Match";

export interface Call {
  id: string;
  callerName: string;
  callerNumber: string;
  carrierName: string;
  mcNumber: string;
  outcome: CallOutcome;
  durationSeconds: number;
  date: string;
}

export interface DailyStats {
  label: string;
  totalCalls: number;
  transferred: number;
}

export interface KpiMetrics {
  totalCalls: number;
  transferred: number;
  transferredPct: number;
  avgDurationSeconds: number;
  totalMinutes: number;
}

// ── helpers ────────────────────────────────────────────────────────

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getKpiMetrics(calls: Call[]): KpiMetrics {
  const totalCalls = calls.length;
  const transferred = calls.filter(
    (c) => c.outcome === "Successfully Transferred to Sales",
  ).length;
  const totalSeconds = calls.reduce((s, c) => s + c.durationSeconds, 0);

  return {
    totalCalls,
    transferred,
    transferredPct: totalCalls > 0 ? (transferred / totalCalls) * 100 : 0,
    avgDurationSeconds: totalCalls > 0 ? totalSeconds / totalCalls : 0,
    totalMinutes: Math.round(totalSeconds / 60),
  };
}

export function getDailyStats(calls: Call[]): DailyStats[] {
  const days = getLast7Days();
  const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });

  return days.map((day) => {
    const dayCalls = calls.filter((c) => c.date === day);
    return {
      label: fmt.format(new Date(day + "T12:00:00")),
      totalCalls: dayCalls.length,
      transferred: dayCalls.filter(
        (c) => c.outcome === "Successfully Transferred to Sales",
      ).length,
    };
  });
}

// ── mock data generation ───────────────────────────────────────────

function getLast7Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const CALLER_NAMES = [
  "James Wilson",
  "Maria Garcia",
  "Robert Chen",
  "Sarah Johnson",
  "Mike Thompson",
  "Lisa Patel",
  "David Brown",
  "Jennifer Lee",
  "Carlos Rodriguez",
  "Amanda White",
  "Kevin Davis",
  "Rachel Martinez",
  "Brian Taylor",
  "Nicole Anderson",
  "Steve Harris",
  "Emily Clark",
  "Tom Baker",
  "Diana Lewis",
  "Mark Robinson",
  "Laura King",
];

const AREA_CODES = [
  "214", "469", "972", "817", "682",
  "713", "832", "281", "346",
  "312", "773", "630", "847",
  "404", "770", "678",
  "305", "786", "954",
];

const CARRIERS = [
  "Swift Transport",
  "Werner Enterprises",
  "JB Hunt",
  "Schneider National",
  "XPO Logistics",
  "Heartland Express",
  "Knight-Swift",
  "Old Dominion",
  "Saia Inc",
  "TFI International",
  "Estes Express",
  "USF Holland",
  "ABF Freight",
  "Southeastern Freight",
  "Central Transport",
  "Roadrunner Freight",
  "Forward Air",
  "Marten Transport",
  "Covenant Logistics",
  "PAM Transport",
  "USA Truck",
  "Celadon Group",
  "Crete Carrier",
  "Ryder System",
  "FedEx Freight",
];

const OUTCOMES: CallOutcome[] = [
  "Successfully Transferred to Sales",
  "Successfully Transferred to Sales",
  "Successfully Transferred to Sales",
  "Successfully Transferred to Sales",
  "No Load Match",
  "No Load Match",
  "No Load Match",
  "Bad MC Number",
  "Bad MC Number",
  "Bad MC Number",
];

// Deterministic pseudo-random using a simple seed
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateMockCalls(): Call[] {
  const days = getLast7Days();
  const rand = seededRandom(42);
  const calls: Call[] = [];

  // Distribute ~10-14 calls per day
  for (const day of days) {
    const count = 8 + Math.floor(rand() * 7);
    for (let i = 0; i < count; i++) {
      const callerName = CALLER_NAMES[Math.floor(rand() * CALLER_NAMES.length)];
      const areaCode = AREA_CODES[Math.floor(rand() * AREA_CODES.length)];
      const phoneNum = `(${areaCode}) ${(100 + Math.floor(rand() * 900)).toString()}-${(1000 + Math.floor(rand() * 9000)).toString()}`;
      const carrier = CARRIERS[Math.floor(rand() * CARRIERS.length)];
      const mcNum = (100000 + Math.floor(rand() * 900000)).toString();
      const outcome = OUTCOMES[Math.floor(rand() * OUTCOMES.length)];
      // Duration: 30s to 720s (12 min), skewed shorter for bad MC
      let duration = 30 + Math.floor(rand() * 690);
      if (outcome === "Bad MC Number") {
        duration = 20 + Math.floor(rand() * 120);
      }

      calls.push({
        id: `call-${calls.length + 1}`,
        callerName,
        callerNumber: phoneNum,
        carrierName: carrier,
        mcNumber: `MC-${mcNum}`,
        outcome,
        durationSeconds: duration,
        date: day,
      });
    }
  }

  return calls;
}

export const mockCalls: Call[] = generateMockCalls();
