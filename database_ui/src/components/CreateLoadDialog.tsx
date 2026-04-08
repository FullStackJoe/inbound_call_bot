import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EQUIPMENT_TYPES } from "@/types/load";
import type { LoadCreate } from "@/types/load";

const INITIAL: LoadCreate = {
  load_id: "",
  origin: "",
  destination: "",
  pickup_datetime: "",
  delivery_datetime: "",
  equipment_type: "Dry Van",
  loadboard_rate: 0,
};

export function CreateLoadDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LoadCreate) => Promise<void>;
}) {
  const [form, setForm] = useState<LoadCreate>({ ...INITIAL });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof LoadCreate, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.load_id || !form.origin || !form.destination || !form.pickup_datetime || !form.delivery_datetime) {
      setError("Please fill in all required fields");
      return;
    }

    const payload: LoadCreate = {
      ...form,
      pickup_datetime: new Date(form.pickup_datetime).toISOString(),
      delivery_datetime: new Date(form.delivery_datetime).toISOString(),
      loadboard_rate: Number(form.loadboard_rate),
    };

    if (form.weight) payload.weight = Number(form.weight);
    if (form.miles) payload.miles = Number(form.miles);
    if (form.num_of_pieces) payload.num_of_pieces = Number(form.num_of_pieces);

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setForm({ ...INITIAL });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create load");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Load</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="load_id">Load ID *</Label>
              <Input
                id="load_id"
                placeholder="e.g. LD-2026-0100"
                value={form.load_id}
                onChange={(e) => set("load_id", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="equipment_type">Equipment Type *</Label>
              <Select
                value={form.equipment_type}
                onValueChange={(v) => set("equipment_type", v)}
              >
                <SelectTrigger id="equipment_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                placeholder="e.g. Chicago, IL"
                value={form.origin}
                onChange={(e) => set("origin", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                placeholder="e.g. Dallas, TX"
                value={form.destination}
                onChange={(e) => set("destination", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pickup">Pickup Date/Time *</Label>
              <Input
                id="pickup"
                type="datetime-local"
                value={form.pickup_datetime}
                onChange={(e) => set("pickup_datetime", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="delivery">Delivery Date/Time *</Label>
              <Input
                id="delivery"
                type="datetime-local"
                value={form.delivery_datetime}
                onChange={(e) => set("delivery_datetime", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rate">Rate ($) *</Label>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                value={form.loadboard_rate || ""}
                onChange={(e) => set("loadboard_rate", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="miles">Miles</Label>
              <Input
                id="miles"
                type="number"
                min="0"
                value={form.miles ?? ""}
                onChange={(e) => set("miles", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                value={form.weight ?? ""}
                onChange={(e) => set("weight", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="commodity">Commodity</Label>
              <Input
                id="commodity"
                placeholder="e.g. Electronics"
                value={form.commodity_type ?? ""}
                onChange={(e) => set("commodity_type", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pieces">Pieces</Label>
              <Input
                id="pieces"
                type="number"
                min="0"
                value={form.num_of_pieces ?? ""}
                onChange={(e) => set("num_of_pieces", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                placeholder='e.g. 48"x40"x48"'
                value={form.dimensions ?? ""}
                onChange={(e) => set("dimensions", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Special handling instructions..."
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Load"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
