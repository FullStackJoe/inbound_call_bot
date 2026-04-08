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
      <div className="relative mx-auto flex h-14 max-w-6xl items-center px-6">
        <span className="text-lg font-bold tracking-tight">Acme Logistics</span>
        <nav className="absolute inset-x-0 flex items-center justify-center gap-6">
          {(["analytics", "loads"] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "text-sm transition-colors",
                page === p
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p === "analytics" ? "Analytics" : "Loads"}
            </button>
          ))}
          <a
            href="https://happyrobot.johanhyldig.dk/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            API Docs
          </a>
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
