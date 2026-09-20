import { createFileRoute, Link } from "@tanstack/react-router";
import { EyeOff, Gauge, Sparkles, ArrowRight, BarChart3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SelectRH — Recrutamento ético às cegas" },
      {
        name: "description",
        content:
          "Plataforma de recrutamento às cegas que oculta nome, foto, idade, gênero e localização para combater vieses inconscientes na contratação.",
      },
      { property: "og:title", content: "SelectRH — Recrutamento ético às cegas" },
      {
        property: "og:description",
        content:
          "Matching duplo-cego, Etitômetro de vagas e perfis por habilidades: contratações mais justas.",
      },
    ],
  }),
  component: Home,
});

const pilares = [
  {
    icone: EyeOff,
    titulo: "Matching duplo-cego",
    texto:
      "Candidatos aparecem como um código anônimo. Nome, foto, idade, gênero e CEP só existem depois do match mútuo.",
  },
  {
    icone: Gauge,
    titulo: "Etitômetro",
    texto:
      "Toda vaga passa por um questionário ético. Sem atingir a zona verde, a publicação fica bloqueada.",
  },
  {
    icone: Sparkles,
    titulo: "Perfil por habilidades",
    texto:
      "Competências técnicas, tempo de experiência, idiomas e certificações — nada além disso decide a triagem.",
  },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="surface-grid border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Projeto de TCC · Escola Papa João Paulo
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Currículos sem rosto, <span className="text-gradient-brand">decisões sem viés</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              O SelectRH esconde tudo o que gera preconceito inconsciente — nome, foto, aparência,
              raça, idade, gênero e bairro — e mostra à empresa apenas o que importa: habilidade.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full" asChild>
                <Link to="/login">
                  Entrar na plataforma <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link to="/sobre">Como funciona</Link>
              </Button>
            </div>
          </div>

          <Card className="rounded-3xl border-border/70 shadow-[var(--shadow-glow)]">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visão da empresa</span>
                <Badge className="rounded-full">Anônimo</Badge>
              </div>
              <div className="rounded-2xl bg-muted/60 p-5">
                <p className="text-2xl font-semibold">Candidato #4821</p>
                <p className="text-sm text-muted-foreground">2 anos e 4 meses de experiência</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["React", "TypeScript", "Acessibilidade", "Inglês avançado"].map((h) => (
                    <Badge key={h} variant="secondary" className="rounded-full">
                      {h}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground">
                {["Nome", "Foto", "Idade e gênero", "Bairro / CEP"].map((campo) => (
                  <div
                    key={campo}
                    className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2"
                  >
                    <Lock className="size-3.5" /> {campo} oculto até o match
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Como funciona</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pilares.map((p) => (
            <Card key={p.titulo} className="rounded-2xl border-border/70">
              <CardContent className="p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <p.icone className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
          {[
            ["50%", "mais chamadas para entrevista quando o nome é omitido (estudo Chicago/MIT)"],
            ["1 em 3", "pessoas relatam ter sido descartadas por fatores alheios à competência"],
            ["100%", "das vagas publicadas passam pelo Etitômetro antes de ir ao ar"],
          ].map(([num, texto]) => (
            <div key={num}>
              <p className="text-3xl font-bold text-primary">{num}</p>
              <p className="mt-2 text-sm text-muted-foreground">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <Card className="overflow-hidden rounded-3xl border-border/70">
          <CardContent className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Pronto para a demonstração?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use as contas de teste para entrar como candidato ou empresa em um clique.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="rounded-full" asChild>
                <Link to="/login">
                  <BarChart3 className="size-4" /> Acessar contas de teste
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <SiteFooter />
    </div>
  );
}
