import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OutcomeBadge } from "@/components/analytics/OutcomeBadge";
import type { Call } from "@/data/mockCalls";
import { formatDuration } from "@/data/mockCalls";

export function CallsTable({ calls }: { calls: Call[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Log</CardTitle>
        <CardDescription>All calls from the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caller</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Carrier Name</TableHead>
              <TableHead>MC Number</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.id}>
                <TableCell className="font-medium">
                  {call.callerName}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {call.callerNumber}
                </TableCell>
                <TableCell>
                  {call.carrierName}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {call.mcNumber}
                </TableCell>
                <TableCell>
                  <OutcomeBadge outcome={call.outcome} />
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatDuration(call.durationSeconds)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
