import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  booked: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  in_transit: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  delivered: "bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.available;
  return (
    <Badge variant="outline" className={`${style} border-none font-medium capitalize`}>
      {status.replace("_", " ")}
    </Badge>
  );
}
