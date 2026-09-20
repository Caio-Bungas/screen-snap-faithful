import { createFileRoute } from "@tanstack/react-router";
import { Heart, X, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/candidato/vagas")({
  head: () => ({
    meta: [
      { title: "Vagas & Match — SelectRH" },
      {
        name: "description",
        content:
          "Navegue pelas vagas aprovadas no Etitômetro e demonstre interesse sem expor seus dados pessoais.",
      },
      { property: "og:title", content: "Vagas & Match — SelectRH" },
      {
        property: "og:description",
        content: "Dê match ou passe: o chat só abre com interesse mútuo.",
      },
    ],
  }),
  component: Vagas,
});

function Vagas() {
  const { jobs, curtidas, passadas, curtirVaga, passarVaga } = useStore();
  const disponiveis = jobs.filter((j) => !curtidas.includes(j.id) && !passadas.includes(j.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vagas disponíveis</h1>
          <p className="text-sm text-muted-foreground">
            Todas aprovadas na zona verde do Etitômetro.
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {disponiveis.length} vagas para avaliar
        </Badge>
      </div>

      {disponiveis.length === 0 && (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">
            Você avaliou todas as vagas por enquanto. Volte mais tarde!
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {disponiveis.map((vaga) => (
          <Card key={vaga.id} className="rounded-2xl border-border/70">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{vaga.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {vaga.empresa} · {vaga.setor} · {vaga.modelo}
                  </p>
                </div>
                <Badge className="rounded-full bg-success text-success-foreground">
                  <ShieldCheck className="size-3" /> {vaga.selo}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{vaga.descricao}</p>
              <div className="flex flex-wrap gap-2">
                {vaga.habilidades.map((h) => (
                  <Badge key={h} variant="secondary" className="rounded-full">
                    {h}
                  </Badge>
                ))}
              </div>
              <p className="text-sm font-medium">{vaga.faixa}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => {
                    passarVaga(vaga.id);
                    toast("Vaga ignorada");
                  }}
                >
                  <X className="size-4" /> Passar
                </Button>
                <Button
                  className="flex-1 rounded-full"
                  onClick={() => {
                    const match = curtirVaga(vaga.id);
                    toast[match ? "success" : "info"](
                      match
                        ? "Match confirmado! O chat foi liberado."
                        : "Interesse registrado. Aguardando a empresa.",
                    );
                  }}
                >
                  <Heart className="size-4" /> Dar match
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
