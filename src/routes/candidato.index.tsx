import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EyeOff, Plus, X, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/candidato/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const [experience, setExperience] = useState(perfil.experiencia);
  const [level, setLevel] = useState(perfil.senioridade);
  const [newValues, setNewValues] = useState({ habilidades: "", idiomas: "", certificacoes: "" });
  const groups = [{ key: "habilidades", label: "Competências técnicas", example: "Ex.: Node.js" }, { key: "idiomas", label: "Idiomas", example: "Ex.: Inglês (avançado)" }, { key: "certificacoes", label: "Certificações", example: "Ex.: AWS Cloud Practitioner" }] as const;
  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"><section className="space-y-6"><header><h1 className="text-2xl font-semibold">Candidato {perfil.codigo}</h1><p className="mt-1 text-sm text-muted-foreground">Perfil anônimo · {perfil.senioridade}</p></header>
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); atualizarPerfil({ experiencia: experience.trim(), senioridade: level }); toast.success("Experiência e senioridade atualizadas"); }}><div className="space-y-2"><Label htmlFor="exp">Tempo de experiência</Label><Input id="exp" required value={experience} onChange={(e) => setExperience(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="level">Senioridade</Label><Select value={level} onValueChange={setLevel}><SelectTrigger id="level"><SelectValue /></SelectTrigger><SelectContent>{["Júnior", "Pleno", "Sênior"].map((l) => <SelectItem value={l} key={l}>{l}</SelectItem>)}</SelectContent></Select></div><Button type="submit" variant="secondary" className="sm:col-span-2 sm:w-fit"><Save />Salvar experiência</Button></form>
    {groups.map(({ key, label, example }) => <section key={key} className="space-y-3 border-t pt-5"><h2 className="font-semibold">{label}</h2><div className="flex flex-wrap gap-2">{perfil[key].map((item) => <Badge key={item} variant="secondary" className="max-w-full gap-1 whitespace-normal break-words py-1">{item}<Button variant="ghost" size="icon" className="size-6 shrink-0" aria-label={`Remover ${item}`} title={`Remover ${item}`} onClick={() => atualizarPerfil({ [key]: perfil[key].filter((v) => v !== item) })}><X className="size-3" /></Button></Badge>)}{perfil[key].length === 0 && <p className="text-sm text-muted-foreground">Nenhum item informado.</p>}</div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const value = newValues[key].trim(); if (!value) return; if (perfil[key].some((v) => v.toLocaleLowerCase() === value.toLocaleLowerCase())) { toast.info("Esse item já foi informado."); return; } atualizarPerfil({ [key]: [...perfil[key], value] }); setNewValues({ ...newValues, [key]: "" }); }}><Input aria-label={`Adicionar ${label.toLowerCase()}`} placeholder={example} value={newValues[key]} onChange={(e) => setNewValues({ ...newValues, [key]: e.target.value })} maxLength={120} /><Button type="submit" size="icon" aria-label={`Adicionar ${label.toLowerCase()}`} title={`Adicionar ${label.toLowerCase()}`} disabled={!newValues[key].trim()}><Plus /></Button></form>
    </section>)}
  </section><Card className="h-fit rounded-xl bg-muted/30"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><EyeOff className="size-4" />Dados ocultos das empresas</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground">{OCULTOS.map((o) => <div key={o} className="border-b py-2">{o}</div>)}<p className="pt-2 text-xs">Esses dados não são coletados neste protótipo. O match libera apenas a conversa, sem revelar informações pessoais.</p></CardContent></Card></div>;
}
