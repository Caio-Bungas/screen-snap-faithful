import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { PLANS, trialRemaining } from "@/lib/recruitment";

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

function Planos() {
  const { plano, escolherPlano, trialStart } = useStore();
  return <div className="space-y-6"><header><h1 className="flex items-center gap-2 text-2xl font-semibold"><Sparkles className="size-5 text-primary" />Planos para empresas</h1><p className="mt-1 text-sm text-muted-foreground">Plano atual: {plano}. Demonstração acadêmica, sem cobranças reais.</p></header>
    <div className="grid items-stretch gap-4 lg:grid-cols-3">{PLANS.map((p) => <Card key={p.nome} className={p.nome === "Premium" ? "rounded-xl border-primary" : "rounded-xl"}>
      <CardHeader className="space-y-3"><div className="flex flex-wrap justify-between gap-2"><CardTitle className="text-lg">{p.nome}</CardTitle>{p.nome === "Premium" && <Badge>Completo</Badge>}</div><p className="text-3xl font-semibold">{p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}<span className="ml-1 text-sm font-normal text-muted-foreground">{p.preco ? "/mês" : "/30 dias"}</span></p></CardHeader>
      <CardContent className="flex flex-col gap-5"><ul className="min-h-28 space-y-3 text-sm text-muted-foreground">{p.itens.map((i) => <li key={i} className="flex gap-2"><Check className="size-4 shrink-0 text-primary" />{i}</li>)}</ul>
        <Button className="w-full" variant={plano === p.nome ? "outline" : "default"} disabled={plano === p.nome || (p.nome === "Período de Teste" && trialRemaining(trialStart) === 0)} onClick={() => { const error = escolherPlano(p.nome); if (error) { toast.error(error); return; } toast.success(`Plano ${p.nome} selecionado`, { description: "Simulação sem cobrança real." }); }}>{plano === p.nome ? "Plano atual" : p.nome === "Período de Teste" && trialRemaining(trialStart) === 0 ? "Teste encerrado" : "Escolher plano"}</Button>
      </CardContent></Card>)}</div>
    {plano === "Período de Teste" && <p className="text-sm text-muted-foreground">{trialRemaining(trialStart)} de 30 dias de teste restantes.</p>}
  </div>;
}
