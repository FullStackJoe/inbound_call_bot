import { useCallback, useEffect, useState } from "react";
import type { LoadFilters } from "@/api/loads";
import { fetchLoads, createLoad, deleteLoad } from "@/api/loads";
import type { Load, LoadCreate } from "@/types/load";
import { AuthError } from "@/api/client";

const PAGE_SIZE = 20;

export function useLoads(onAuthError: () => void) {
  const [loads, setLoads] = useState<Load[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<LoadFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLoads(filters, PAGE_SIZE, page * PAGE_SIZE);
      setLoads(res.loads);
      setTotal(res.total);
    } catch (err) {
      if (err instanceof AuthError) {
        onAuthError();
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to fetch loads");
    } finally {
      setLoading(false);
    }
  }, [filters, page, onAuthError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (data: LoadCreate) => {
    await createLoad(data);
    await loadData();
  };

  const handleDelete = async (loadId: string) => {
    await deleteLoad(loadId);
    await loadData();
  };

  const updateFilters = (newFilters: LoadFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  return {
    loads,
    total,
    page,
    pageSize: PAGE_SIZE,
    filters,
    loading,
    error,
    setPage,
    setFilters: updateFilters,
    handleCreate,
    handleDelete,
    refresh: loadData,
  };
}
