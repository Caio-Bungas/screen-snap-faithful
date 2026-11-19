import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Heart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const { candidatos, jobs, company, interessesEmpresa, demonstrarInteresse, registrarVisualizacao, curtidas, perfil } = useStore();
  const [selected, setSelected] = useState("");
  const own = jobs.filter((j) => j.companyId === company.id && j.ativa !== false);
  const active = own.some((j) => j.id === selected) ? selected : own[0]?.id;
  useEffect(() => { registrarVisualizacao(); }, [registrarVisualizacao]);
  return <div className="space-y-6"><header><h1 className="flex items-center gap-2 text-2xl font-semibold"><Users className="size-5 text-primary" />Talentos às cegas</h1><p className="mt-1 text-sm text-muted-foreground">Competências primeiro. Dados pessoais permanecem ocultos.</p></header>
    <div className="max-w-md space-y-2"><Label htmlFor="talent-job">Vaga para demonstrar interesse</Label><Select value={active ?? ""} onValueChange={setSelected} disabled={!own.length}><SelectTrigger id="talent-job"><SelectValue placeholder="Publique uma vaga" /></SelectTrigger><SelectContent>{own.map((j) => <SelectItem value={j.id} key={j.id}>{j.titulo}</SelectItem>)}</SelectContent></Select></div>
    <div className="grid gap-4 sm:grid-cols-2">{candidatos.map((c) => { const interested = !!active && !!interessesEmpresa[active]?.includes(c.codigo); const matched = interested && c.codigo === perfil.codigo && !!active && curtidas.includes(active); return <Card key={c.codigo} className="rounded-xl"><CardHeader className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><CardTitle className="text-base">Candidato {c.codigo}</CardTitle><Badge variant="secondary">{c.compatibilidade}% compatível</Badge></div><Progress value={c.compatibilidade} aria-label={`Compatibilidade de ${c.codigo}`} /></CardHeader><CardContent className="space-y-3 text-sm"><p className="text-muted-foreground">{c.senioridade} · {c.experiencia}</p><div className="flex flex-wrap gap-1">{c.habilidades.map((h) => <Badge key={h} variant="secondary">{h}</Badge>)}</div><p className="text-muted-foreground">{c.idiomas.join(" · ")}</p><p className="text-muted-foreground">Certificações: {c.certificacoes.join(", ") || "Não informadas"}</p><Button size="sm" disabled={!active || interested} onClick={() => { if (!active) return; const match = demonstrarInteresse(active, c.codigo); toast[match ? "success" : "info"](match ? "Match mútuo confirmado! Conversa liberada." : "Interesse registrado. Aguardando o candidato."); }}><Heart />{matched ? "Match confirmado" : interested ? "Interesse registrado" : "Demonstrar interesse"}</Button></CardContent></Card>; })}</div>
  </div>;
}
