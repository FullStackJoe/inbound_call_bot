import { Badge } from "@/components/ui/badge";
import type { CallOutcome } from "@/data/mockCalls";

const OUTCOME_STYLES: Record<CallOutcome, string> = {
  "Successfully Transferred to Sales":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Bad MC Number":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "No Load Match":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

const OUTCOME_LABELS: Record<CallOutcome, string> = {
  "Successfully Transferred to Sales": "Transferred",
  "Bad MC Number": "Bad MC",
  "No Load Match": "No Match",
};

export function OutcomeBadge({ outcome }: { outcome: CallOutcome }) {
  return (
    <Badge
      variant="outline"
      className={`${OUTCOME_STYLES[outcome]} border-none font-medium`}
    >
      {OUTCOME_LABELS[outcome]}
    </Badge>
  );
}
