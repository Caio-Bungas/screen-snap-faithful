import { createFileRoute } from "@tanstack/react-router";
import { Building2, Eye, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/empresa")({
  head: () => ({
    meta: [
      { title: "Painel da empresa — SelectRH" },
      {
        name: "description",
        content:
          "Veja talentos anônimos, compatibilidade por habilidades e vagas publicadas no SelectRH.",
      },
      { property: "og:title", content: "Painel da empresa — SelectRH" },
      {
        property: "og:description",
        content: "Recrutamento às cegas: avalie por competências, não por rótulos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Empresa,
});

function Empresa() {
  const { jobs, candidatos, plano } = useStore();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Painel da empresa</h1>
          <p className="text-sm text-muted-foreground">
            Plano atual: {plano}. Todos os perfis permanecem anônimos até o match mútuo.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-medium">
            <Users className="size-4" /> Talentos às cegas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {candidatos.map((c) => (
              <Card key={c.codigo} className="rounded-2xl border-border/70">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">Candidato {c.codigo}</CardTitle>
                  <Badge className="rounded-full">{c.compatibilidade}% compatível</Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    {c.senioridade} · {c.experiencia}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {c.habilidades.map((h) => (
                      <Badge key={h} variant="secondary" className="rounded-full">
                        {h}
                      </Badge>
                    ))}
                  </div>
                  <p>{c.idiomas.join(" · ")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-medium">
            <Building2 className="size-4" /> Vagas publicadas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((j) => (
              <Card key={j.id} className="rounded-2xl border-border/70">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base">{j.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {j.empresa} · {j.modelo} · {j.faixa}
                  </p>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="size-4 text-primary" /> Etitômetro: {j.selo}/100
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
