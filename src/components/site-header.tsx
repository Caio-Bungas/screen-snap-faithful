import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Settings, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className="rounded-full"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function SiteHeader() {
  const { session, sair } = useStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-4" />
          </span>
          Select<span className="-ml-2 text-gradient-brand">RH</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 text-sm text-muted-foreground md:flex">
          <Link to="/" className="rounded-lg px-3 py-2 transition-colors hover:text-foreground">
            Início
          </Link>
          <Link
            to="/sobre"
            className="rounded-lg px-3 py-2 transition-colors hover:text-foreground"
          >
            Quem somos
          </Link>
          {session?.role === "candidato" && (
            <Link
              to="/candidato"
              className="rounded-lg px-3 py-2 transition-colors hover:text-foreground"
            >
              Meu painel
            </Link>
          )}
          {session?.role === "empresa" && (
            <Link
              to="/empresa"
              className="rounded-lg px-3 py-2 transition-colors hover:text-foreground"
            >
              Painel da empresa
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link to="/configuracoes" aria-label="Configurações">
              <Settings className="size-4" />
            </Link>
          </Button>
          {session ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                sair();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="size-4" /> Sair
            </Button>
          ) : (
            <Button size="sm" className="rounded-full" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm md:grid-cols-3">
        <div>
          <p className="font-semibold">SelectRH</p>
          <p className="mt-2 text-muted-foreground">
            Recrutamento ético às cegas. Projeto escolar (TCC) da Escola Papa João Paulo, sob
            orientação da Prof. Tatiane.
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Institucional</p>
          <div className="flex flex-col gap-1 text-muted-foreground">
            <Link to="/sobre" className="hover:text-foreground">
              Quem somos
            </Link>
            <Link to="/termos" className="hover:text-foreground">
              Termos de uso
            </Link>
            <Link to="/privacidade" className="hover:text-foreground">
              Política de privacidade
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Compromissos</p>
          <p className="text-muted-foreground">
            ODS 8 e 10 da ONU · NR-1, NR-7 e NR-17 · LGPD (Lei 13.709/2018)
          </p>
        </div>
      </div>
      <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SelectRH · Protótipo acadêmico sem fins comerciais
      </div>
    </footer>
  );
}
