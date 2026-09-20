import { createFileRoute } from "@tanstack/react-router";
import { Eye, Heart, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/candidato/transparencia")({
  head: () => ({
    meta: [
      { title: "Transparência — SelectRH" },
      {
        name: "description",
        content:
          "Acompanhe quantas empresas visualizaram seu perfil anônimo e em que etapa está cada candidatura.",
      },
      { property: "og:title", content: "Transparência — SelectRH" },
      {
        property: "og:description",
        content: "Fim do buraco negro das candidaturas: veja o status real de cada processo.",
      },
    ],
  }),
  component: Transparencia,
});

function Transparencia() {
  const { visualizacoes, curtidas, matches, jobs } = useStore();

  const cards = [
    { icone: Eye, titulo: "Visualizações anônimas", valor: visualizacoes },
    { icone: Heart, titulo: "Interesses enviados", valor: curtidas.length },
    { icone: MessageSquare, titulo: "Matches confirmados", valor: matches.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Painel de transparência</h1>
        <p className="text-sm text-muted-foreground">
          As empresas que visualizaram seu perfil permanecem anônimas até o match mútuo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.titulo} className="rounded-2xl border-border/70">
            <CardContent className="p-6">
              <c.icone className="size-5 text-primary" />
              <p className="mt-3 text-3xl font-bold">{c.valor}</p>
              <p className="text-sm text-muted-foreground">{c.titulo}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4" /> Status das suas candidaturas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {curtidas.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Você ainda não demonstrou interesse em nenhuma vaga.
            </p>
          )}
          {curtidas.map((id) => {
            const vaga = jobs.find((j) => j.id === id);
            if (!vaga) return null;
            const temMatch = matches.includes(id);
            return (
              <div key={id} className="space-y-2 rounded-xl border border-border/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{vaga.titulo}</p>
                  <Badge
                    className={
                      temMatch
                        ? "rounded-full bg-success text-success-foreground"
                        : "rounded-full bg-warning text-warning-foreground"
                    }
                  >
                    {temMatch ? "Match confirmado" : "Em análise"}
                  </Badge>
                </div>
                <Progress value={temMatch ? 100 : 55} />
                <p className="text-xs text-muted-foreground">
                  {temMatch
                    ? "Chat liberado na aba Mensagens."
                    : "Seu perfil anônimo foi enviado ao time de recrutamento."}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
