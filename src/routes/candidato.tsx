import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/candidato")({
  component: CandidatoLayout,
});

const abas = [
  { to: "/candidato", label: "Perfil ético" },
  { to: "/candidato/vagas", label: "Vagas & Match" },
  { to: "/candidato/transparencia", label: "Transparência" },
  { to: "/candidato/chat", label: "Mensagens" },
] as const;

function CandidatoLayout() {
  const { session, ready } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!ready || session?.role !== "candidato") return <div className="flex min-h-screen flex-col"><SiteHeader /><main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center"><h1 className="text-2xl font-semibold">{!ready ? "Carregando…" : "Entre como candidato para continuar"}</h1>{ready && <Button asChild><Link to="/login">Ir para acesso</Link></Button>}</main><SiteFooter /></div>;
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="border-b border-border/60 bg-muted/30">
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-3 text-sm">
          {abas.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              aria-current={pathname === a.to ? "page" : undefined}
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
