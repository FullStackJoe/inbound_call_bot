import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { Load } from "@/types/load";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function LoadsTable({
  loads,
  loading,
  onDelete,
}: {
  loads: Load[];
  loading: boolean;
  onDelete: (loadId: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (loads.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        No loads found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Load ID</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Pickup</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Miles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loads.map((load) => (
            <TableRow key={load.load_id}>
              <TableCell className="font-mono text-sm font-medium">
                {load.load_id}
              </TableCell>
              <TableCell>{load.origin}</TableCell>
              <TableCell>{load.destination}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(load.pickup_datetime)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(load.delivery_datetime)}
              </TableCell>
              <TableCell>{load.equipment_type}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(load.loadboard_rate)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {load.miles ?? "—"}
              </TableCell>
              <TableCell>
                <StatusBadge status={load.status} />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(load.load_id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
