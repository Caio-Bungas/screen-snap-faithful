import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empresa")({
  component: EmpresaLayout,
});

const abas = [
  { to: "/empresa", label: "Talentos às cegas" },
  { to: "/empresa/vagas", label: "Minhas vagas" },
  { to: "/empresa/etitometro", label: "Etitômetro" },
  { to: "/empresa/planos", label: "Planos" },
] as const;

function EmpresaLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="border-b border-border/60 bg-muted/30">
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-3 text-sm">
          {abas.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 transition-colors",
                pathname === a.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {a.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
