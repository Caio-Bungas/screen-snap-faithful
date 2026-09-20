import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EyeOff, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/candidato/")({
  head: () => ({
    meta: [
      { title: "Perfil ético — SelectRH" },
      {
        name: "description",
        content:
          "Gerencie competências, tempo de experiência, idiomas e certificações em um perfil totalmente anônimo.",
      },
      { property: "og:title", content: "Perfil ético — SelectRH" },
      {
        property: "og:description",
        content: "Perfil anônimo identificado apenas por código, sem nome, foto ou localização.",
      },
    ],
  }),
  component: Perfil,
});

const OCULTOS = ["Nome real", "Foto de perfil", "CEP e cidade", "Idade", "Gênero", "Raça/cor"];

function Perfil() {
  const { perfil, atualizarPerfil } = useStore();
  const [nova, setNova] = useState("");
  const [experiencia, setExperiencia] = useState(perfil.experiencia);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <Card className="rounded-2xl border-border/70">
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Candidato {perfil.codigo}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Código anônimo gerado pelo sistema · {perfil.senioridade}
              </p>
            </div>
            <Badge className="rounded-full">Perfil às cegas</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="exp">Tempo de experiência</Label>
              <div className="flex gap-2">
                <Input
                  id="exp"
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                />
                <Button
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => {
                    atualizarPerfil({ experiencia });
                    toast.success("Experiência atualizada");
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Competências técnicas</Label>
              <div className="flex flex-wrap gap-2">
                {perfil.habilidades.map((h) => (
                  <Badge key={h} variant="secondary" className="rounded-full pr-1">
                    {h}
                    <button
                      aria-label={`Remover ${h}`}
                      className="ml-1 rounded-full p-0.5 hover:bg-background/60"
                      onClick={() =>
                        atualizarPerfil({
                          habilidades: perfil.habilidades.filter((x) => x !== h),
                        })
                      }
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <Input
                  value={nova}
                  placeholder="Ex.: Node.js"
                  onChange={(e) => setNova(e.target.value)}
                />
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    if (!nova.trim()) return;
                    atualizarPerfil({ habilidades: [...perfil.habilidades, nova.trim()] });
                    setNova("");
                  }}
                >
                  <Plus className="size-4" /> Adicionar
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Idiomas</Label>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {perfil.idiomas.map((i) => (
                    <li key={i}>• {i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label>Certificações</Label>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {perfil.certificacoes.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit rounded-2xl border-border/70 bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <EyeOff className="size-4" /> Dados ocultos das empresas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {OCULTOS.map((o) => (
            <div key={o} className="rounded-xl border border-dashed border-border px-3 py-2">
              {o}
            </div>
          ))}
          <p className="pt-2 text-xs">
            Esses dados só são revelados após o match mútuo e com o seu consentimento, conforme a
            LGPD.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
