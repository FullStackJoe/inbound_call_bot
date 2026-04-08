import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { LoadFilters } from "@/api/loads";
import { EQUIPMENT_TYPES } from "@/types/load";

export function FilterBar({
  filters,
  onChange,
}: {
  filters: LoadFilters;
  onChange: (f: LoadFilters) => void;
}) {
  const [origin, setOrigin] = useState(filters.origin ?? "");
  const [destination, setDestination] = useState(filters.destination ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({
        ...filters,
        origin: origin || undefined,
        destination: destination || undefined,
      });
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [origin, destination]);

  const handleClear = () => {
    setOrigin("");
    setDestination("");
    onChange({});
  };

  const hasFilters = origin || destination || filters.equipment_type || filters.status;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Filter origin..."
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        className="w-44"
      />
      <Input
        placeholder="Filter destination..."
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-44"
      />
      <Select
        value={filters.equipment_type || "__all__"}
        onValueChange={(v) =>
          onChange({ ...filters, equipment_type: !v || v === "__all__" ? undefined : v })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Equipment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Equipment</SelectItem>
          {EQUIPMENT_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status || "__all__"}
        onValueChange={(v) =>
          onChange({ ...filters, status: !v || v === "__all__" ? undefined : v })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Statuses</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="booked">Booked</SelectItem>
          <SelectItem value="in_transit">In Transit</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      )}
    </div>
  );
}
