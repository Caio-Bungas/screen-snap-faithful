import { createFileRoute, Link } from "@tanstack/react-router";
import workspace from "@/assets/selectrh-workspace.jpg";
import { EyeOff, Gauge, Sparkles, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      "Candidatos aparecem como um código anônimo. O chat só abre quando ambos demonstram interesse; dados pessoais não são coletados no protótipo.",
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

      <section className="relative isolate overflow-hidden border-b border-border">
        <img src={workspace} width={1600} height={912} alt="Ambiente de entrevista com cadeiras iguais, pastas sem identificação e luz natural" className="absolute inset-0 -z-10 h-full w-full object-cover object-[65%_center]" fetchPriority="high" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="max-w-md space-y-5 text-cover-foreground">
            <Badge variant="secondary">Projeto de TCC · Escola Papa João Paulo</Badge>
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">SelectRH</h1>
            <p className="text-2xl font-semibold leading-snug">Competências primeiro.<br />Rótulos nunca.</p>
            <p className="max-w-sm text-base leading-relaxed text-cover-muted">Recrutamento ético às cegas. Sem nome, foto ou localização na triagem: cada oportunidade começa pelas habilidades.</p>
            <div className="flex flex-wrap gap-3 pt-2"><Button size="lg" asChild><Link to="/login">Entrar na plataforma<ArrowRight /></Link></Button><Button size="lg" variant="outline" asChild><Link to="/sobre">Quem somos</Link></Button></div>
          </div>
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
            ["Às cegas", "triagem por competências, sem marcadores pessoais"],
            ["2 interesses", "candidato e empresa confirmam antes de abrir a conversa"],
            ["100%", "das vagas publicadas passam pelo Etitômetro antes de ir ao ar"],
          ].map(([num, texto]) => (
            <div key={num}>
              <p className="text-3xl font-bold text-primary">{num}</p>
              <p className="mt-2 text-sm text-muted-foreground">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12"><div className="flex flex-wrap items-center justify-between gap-5"><div><h2 className="text-xl font-semibold">Oportunidades mais justas</h2><p className="mt-2 text-sm text-muted-foreground">Candidatos e empresas, conectados por competências.</p></div><Button asChild><Link to="/login"><BarChart3 />Acessar SelectRH</Link></Button></div></section>

      <SiteFooter />
    </div>
  );
}
