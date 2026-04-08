import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Page = "analytics" | "loads";

export function Navbar({
  page,
  onPageChange,
  authenticated,
  onDisconnect,
}: {
  page: Page;
  onPageChange: (page: Page) => void;
  authenticated: boolean;
  onDisconnect: () => void;
}) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <span className="text-lg font-bold tracking-tight">Acme Logistics</span>
        <nav className="flex gap-1">
          {(["analytics", "loads"] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                page === p
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {p === "analytics" ? "Analytics" : "Loads"}
            </button>
          ))}
        </nav>
        <div className="ml-auto">
          {authenticated && (
            <Button variant="ghost" size="sm" onClick={onDisconnect}>
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
