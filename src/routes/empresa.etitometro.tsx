import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Gauge, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EthicalQuestionnaire } from "@/components/ethical-questionnaire";
import { type EthicalAnswer } from "@/lib/recruitment";

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

function Etitometro() {
  const [answers, setAnswers] = useState<EthicalAnswer[]>([]);
  return <div className="space-y-8"><header><h1 className="flex items-center gap-2 text-2xl font-semibold"><Gauge className="size-5 text-primary" />Etitômetro</h1><p className="mt-2 text-sm text-muted-foreground">Simulação de autoavaliação. Cada nova vaga exige suas próprias respostas antes da publicação.</p></header><EthicalQuestionnaire answers={answers} onChange={setAnswers} prefix="practice" /><Button asChild><Link to="/empresa/vagas">Criar vaga<ArrowRight /></Link></Button></div>;
}
