import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/empresa/planos")({
  head: () => ({
    meta: [
      { title: "Planos para empresas — SelectRH" },
      {
        name: "description",
        content:
          "Compare os planos do SelectRH e escolha o número de vagas, relatórios de diversidade e suporte que sua empresa precisa.",
      },
      { property: "og:title", content: "Planos para empresas — SelectRH" },
      {
        property: "og:description",
        content: "Planos simples e transparentes para recrutamento às cegas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Planos,
});

const planos = [
  {
    nome: "Essencial",
    preco: "R$ 0",
    periodo: "período de teste",
    itens: ["1 vaga ativa", "Perfis anônimos", "Etitômetro básico"],
  },
  {
    nome: "Profissional",
    preco: "R$ 349",
    periodo: "por mês",
    destaque: true,
    itens: [
      "10 vagas ativas",
      "Relatórios de diversidade",
      "Selo do Etitômetro nas vagas",
      "Chat com match mútuo",
    ],
  },
  {
    nome: "Corporativo",
    preco: "R$ 899",
    periodo: "por mês",
    itens: [
      "Vagas ilimitadas",
      "Consultoria de linguagem neutra",
      "Auditoria de vieses",
      "Suporte dedicado",
    ],
  },
];

function Planos() {
  const { plano, escolherPlano } = useStore();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Sparkles className="size-5 text-primary" /> Planos
        </h1>
        <p className="text-sm text-muted-foreground">
          Plano atual: {plano}. Valores simulados para o protótipo acadêmico.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {planos.map((p) => {
          const atual = plano === p.nome;
          return (
            <Card
              key={p.nome}
              className={
                p.destaque
                  ? "rounded-2xl border-primary/60 shadow-lg shadow-primary/10"
                  : "rounded-2xl border-border/70"
              }
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{p.nome}</CardTitle>
                  {p.destaque && <Badge className="rounded-full">Mais escolhido</Badge>}
                </div>
                <p className="text-2xl font-semibold">
                  {p.preco}{" "}
                  <span className="text-sm font-normal text-muted-foreground">{p.periodo}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <ul className="space-y-2 text-muted-foreground">
                  {p.itens.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 text-primary" /> {i}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full rounded-full"
                  variant={atual ? "outline" : "default"}
                  disabled={atual}
                  onClick={() => {
                    escolherPlano(p.nome);
                    toast.success(`Plano ${p.nome} ativado`, {
                      description: "Alteração simulada, sem cobrança real.",
                    });
                  }}
                >
                  {atual ? "Plano atual" : "Escolher plano"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
