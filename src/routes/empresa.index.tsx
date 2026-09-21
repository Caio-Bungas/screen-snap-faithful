import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/empresa/")({
  head: () => ({
    meta: [
      { title: "Talentos às cegas — SelectRH" },
      {
        name: "description",
        content:
          "Avalie candidatos anônimos por habilidades, idiomas e certificações antes de revelar qualquer dado pessoal.",
      },
      { property: "og:title", content: "Talentos às cegas — SelectRH" },
      {
        property: "og:description",
        content: "Recrutamento ético: competências primeiro, rótulos nunca.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Talentos,
});

function Talentos() {
  const { candidatos, plano } = useStore();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Users className="size-5 text-primary" /> Talentos às cegas
        </h1>
        <p className="text-sm text-muted-foreground">
          Plano atual: {plano}. Os perfis só são revelados após o interesse mútuo.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {candidatos.map((c) => (
          <Card key={c.codigo} className="rounded-2xl border-border/70">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Candidato {c.codigo}</CardTitle>
                <Badge className="rounded-full">{c.compatibilidade}% compatível</Badge>
              </div>
              <Progress value={c.compatibilidade} aria-label="Compatibilidade" />
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
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
              <p>Certificações: {c.certificacoes.join(", ")}</p>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() =>
                  toast.success("Interesse registrado", {
                    description: `O candidato ${c.codigo} será avisado. O chat abre se houver match mútuo.`,
                  })
                }
              >
                Demonstrar interesse
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
