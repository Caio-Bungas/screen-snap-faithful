import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gauge } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/empresa/etitometro")({
  head: () => ({
    meta: [
      { title: "Etitômetro — SelectRH" },
      {
        name: "description",
        content:
          "Meça o compromisso ético da sua empresa: processos às cegas, saúde mental, acessibilidade e transparência salarial.",
      },
      { property: "og:title", content: "Etitômetro — SelectRH" },
      {
        property: "og:description",
        content: "Selo de ética calculado a partir de práticas reais de recrutamento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Etitometro,
});

const criterios = [
  { id: "cegas", peso: 20, texto: "Todo o processo seletivo é feito às cegas até a etapa final." },
  { id: "salario", peso: 15, texto: "A faixa salarial é divulgada em todas as vagas." },
  { id: "feedback", peso: 15, texto: "Todas as pessoas candidatas recebem feedback." },
  { id: "acessibilidade", peso: 15, texto: "As etapas são acessíveis (WCAG AA e adaptações)." },
  { id: "saude", peso: 15, texto: "Há programa de saúde mental conforme NR-1 e NR-7." },
  { id: "ergonomia", peso: 10, texto: "Postos de trabalho seguem a NR-17 (ergonomia)." },
  { id: "diversidade", peso: 10, texto: "Indicadores de diversidade são medidos e publicados." },
] as const;

function Etitometro() {
  const { etitometro, salvarEtitometro } = useStore();
  const [marcados, setMarcados] = useState<string[]>([]);

  const nota = criterios
    .filter((c) => marcados.includes(c.id))
    .reduce((soma, c) => soma + c.peso, 0);

  const faixa =
    nota >= 85 ? "Selo Ouro" : nota >= 65 ? "Selo Prata" : nota >= 40 ? "Selo Bronze" : "Em evolução";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Gauge className="size-5 text-primary" /> Etitômetro
        </h1>
        <p className="text-sm text-muted-foreground">
          Marque as práticas que sua empresa já adota. A nota aparece nas suas vagas.
        </p>
      </header>

      <Card className="rounded-2xl border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Autoavaliação ética</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {criterios.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <Checkbox
                id={c.id}
                checked={marcados.includes(c.id)}
                onCheckedChange={(v) =>
                  setMarcados((m) => (v ? [...m, c.id] : m.filter((x) => x !== c.id)))
                }
              />
              <Label htmlFor={c.id} className="text-sm font-normal leading-snug">
                {c.texto}{" "}
                <span className="text-muted-foreground">({c.peso} pontos)</span>
              </Label>
            </div>
          ))}

          <div className="space-y-2 rounded-xl bg-muted/50 p-4">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>
                Nota atual: {nota}/100 · {faixa}
              </span>
              {etitometro !== null && (
                <span className="text-muted-foreground">Salva: {etitometro}/100</span>
              )}
            </div>
            <Progress value={nota} aria-label="Nota do Etitômetro" />
          </div>

          <Button
            className="rounded-full"
            onClick={() => {
              salvarEtitometro(nota);
              toast.success(`Selo atualizado: ${faixa}`, {
                description: `Sua nota ${nota}/100 passa a aparecer nas vagas publicadas.`,
              });
            }}
          >
            Salvar selo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
