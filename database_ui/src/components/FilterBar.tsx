import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LoadFilters } from "@/api/loads";

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

  const hasFilters = origin || destination;

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
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      )}
    </div>
  );
}
