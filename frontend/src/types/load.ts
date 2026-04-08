export interface Load {
  load_id: string;
  origin: string;
  destination: string;
  pickup_datetime: string;
  delivery_datetime: string;
  equipment_type: string;
  loadboard_rate: number;
  notes: string | null;
  weight: number | null;
  commodity_type: string | null;
  num_of_pieces: number | null;
  miles: number | null;
  dimensions: string | null;
  status: string;
}

export interface LoadsResponse {
  loads: Load[];
  total: number;
  limit: number;
  offset: number;
}

export interface LoadCreate {
  load_id: string;
  origin: string;
  destination: string;
  pickup_datetime: string;
  delivery_datetime: string;
  equipment_type: string;
  loadboard_rate: number;
  notes?: string;
  weight?: number;
  commodity_type?: string;
  num_of_pieces?: number;
  miles?: number;
  dimensions?: string;
}

export const EQUIPMENT_TYPES = ["Dry Van", "Reefer", "Flatbed", "Step Deck"] as const;
