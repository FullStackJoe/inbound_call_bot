import { useCallback, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar, type Page } from "@/components/Navbar";
import { LoginScreen } from "@/components/LoginScreen";
import { FilterBar } from "@/components/FilterBar";
import { LoadsTable } from "@/components/LoadsTable";
import { Pagination } from "@/components/Pagination";
import { CreateLoadDialog } from "@/components/CreateLoadDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { AnalyticsPage } from "@/components/analytics/AnalyticsPage";
import { useLoads } from "@/hooks/useLoads";
import { clearApiKey, getApiKey } from "@/api/client";
import type { LoadCreate } from "@/types/load";

function LoadsPage({ onAuthError }: { onAuthError: () => void }) {
  const [authenticated, setAuthenticated] = useState(!!getApiKey());
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAuthError = useCallback(() => {
    setAuthenticated(false);
    onAuthError();
  }, [onAuthError]);

  const {
    loads,
    total,
    page,
    pageSize,
    filters,
    loading,
    error,
    setPage,
    setFilters,
    handleCreate,
    handleDelete,
  } = useLoads(handleAuthError);

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await handleDelete(deleteTarget);
      toast.success(`Load ${deleteTarget} deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
    setDeleteTarget(null);
  };

  const onCreateSubmit = async (data: LoadCreate) => {
    await handleCreate(data);
    toast.success(`Load ${data.load_id} created`);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <FilterBar filters={filters} onChange={setFilters} />
            <Button onClick={() => setCreateOpen(true)}>New Load</Button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <LoadsTable loads={loads} loading={loading} onDelete={setDeleteTarget} />

          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </CardContent>
      </Card>

      <CreateLoadDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={onCreateSubmit} />
      <DeleteConfirmDialog loadId={deleteTarget} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
    </main>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("analytics");
  const [authenticated, setAuthenticated] = useState(!!getApiKey());

  const handleDisconnect = () => {
    clearApiKey();
    setAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar
        page={currentPage}
        onPageChange={setCurrentPage}
        authenticated={authenticated}
        onDisconnect={handleDisconnect}
      />

      {currentPage === "analytics" && <AnalyticsPage />}
      {currentPage === "loads" && (
        <LoadsPage onAuthError={() => setAuthenticated(false)} />
      )}

      <Toaster richColors position="top-right" />
    </div>
  );
}
