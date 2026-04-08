import { useCallback, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoginScreen } from "@/components/LoginScreen";
import { FilterBar } from "@/components/FilterBar";
import { LoadsTable } from "@/components/LoadsTable";
import { Pagination } from "@/components/Pagination";
import { CreateLoadDialog } from "@/components/CreateLoadDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useLoads } from "@/hooks/useLoads";
import { clearApiKey, getApiKey } from "@/api/client";
import type { LoadCreate } from "@/types/load";

export default function App() {
  const [authenticated, setAuthenticated] = useState(!!getApiKey());
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAuthError = useCallback(() => {
    setAuthenticated(false);
  }, []);

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
    return (
      <>
        <LoginScreen onLogin={() => setAuthenticated(true)} />
        <Toaster richColors position="top-right" />
      </>
    );
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

  const handleDisconnect = () => {
    clearApiKey();
    setAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <h1 className="text-xl font-bold tracking-tight">HappyRobot</h1>
          <div className="flex items-center gap-3">
            <Button onClick={() => setCreateOpen(true)}>New Load</Button>
            <Button variant="ghost" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <FilterBar filters={filters} onChange={setFilters} />
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <LoadsTable
              loads={loads}
              loading={loading}
              onDelete={setDeleteTarget}
            />

            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </main>

      <CreateLoadDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={onCreateSubmit}
      />

      <DeleteConfirmDialog
        loadId={deleteTarget}
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}
