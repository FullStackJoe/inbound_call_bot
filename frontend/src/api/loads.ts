import type { LoadCreate, LoadsResponse } from "@/types/load";
import { apiRequest } from "./client";

export interface LoadFilters {
  origin?: string;
  destination?: string;
  equipment_type?: string;
  status?: string;
}

export async function fetchLoads(
  filters: LoadFilters = {},
  limit = 50,
  offset = 0,
): Promise<LoadsResponse> {
  const params = new URLSearchParams();
  if (filters.origin) params.set("origin", filters.origin);
  if (filters.destination) params.set("destination", filters.destination);
  if (filters.equipment_type) params.set("equipment_type", filters.equipment_type);
  if (filters.status) params.set("status", filters.status);
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  return apiRequest<LoadsResponse>(`/api/v1/loads/all?${params}`);
}

export async function createLoad(data: LoadCreate): Promise<void> {
  await apiRequest("/api/v1/loads", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteLoad(loadId: string): Promise<void> {
  await apiRequest(`/api/v1/loads/${encodeURIComponent(loadId)}`, {
    method: "DELETE",
  });
}

export async function validateApiKey(): Promise<boolean> {
  try {
    await apiRequest<LoadsResponse>("/api/v1/loads/all?limit=1");
    return true;
  } catch {
    return false;
  }
}
