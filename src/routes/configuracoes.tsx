import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, ThemeToggle } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — SelectRH" },
      {
        name: "description",
        content: "Ajuste o tema e revise as preferências da sua conta no SelectRH.",
      },
      { property: "og:title", content: "Configurações — SelectRH" },
      { property: "og:description", content: "Preferências de aparência e conta do SelectRH." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <Card className="rounded-2xl border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Aparência</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Alternar entre modo claro e escuro.</p>
            <ThemeToggle />
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Seus dados ficam salvos apenas neste navegador. Nenhuma informação pessoal é enviada
            para as empresas antes do match mútuo.
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
