import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, ShieldCheck, Archive } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EthicalQuestionnaire } from "@/components/ethical-questionnaire";
import { ethicalScore, publicationError, type EthicalAnswer } from "@/lib/recruitment";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/empresa/vagas")({
  head: () => ({
    meta: [
      { title: "Minhas vagas — SelectRH" },
      {
        name: "description",
        content:
          "Publique vagas com linguagem neutra e acompanhe as oportunidades abertas da sua empresa no SelectRH.",
      },
      { property: "og:title", content: "Minhas vagas — SelectRH" },
      {
        property: "og:description",
        content: "Publicação de vagas com critérios objetivos e faixa salarial transparente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VagasEmpresa,
});

function VagasEmpresa() {
  const { jobs, publicarVaga, company, plano, trialStart, encerrarVaga } = useStore();
  const [form, setForm] = useState({ titulo: "", modelo: "Remoto", faixa: "", senioridade: "Pleno", habilidades: "", descricao: "" });
  const [answers, setAnswers] = useState<EthicalAnswer[]>([]);
  const own = jobs.filter((j) => j.companyId === company.id);
  const block = publicationError(plano, own.filter((j) => j.ativa !== false).length, trialStart, answers);
  const field = (key: keyof typeof form) => ({ id: key, value: form[key], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value }) });
  return <div className="space-y-8"><header><h1 className="flex items-center gap-2 text-2xl font-semibold"><Briefcase className="size-5 text-primary" />Minhas vagas</h1><p className="mt-1 text-sm text-muted-foreground">{company.razaoSocial} · {company.setor} · {own.filter((j) => j.ativa !== false).length} vagas ativas</p></header>
    <form className="space-y-7" onSubmit={(e) => { e.preventDefault(); const error = publicarVaga({ ...form, empresa: company.razaoSocial, setor: company.setor, id: crypto.randomUUID(), habilidades: form.habilidades.split(",").map((h) => h.trim()).filter(Boolean), selo: ethicalScore(answers), respostas: answers }); if (error) { toast.error(error); return; } toast.success("Vaga publicada na zona verde"); setForm({ titulo: "", modelo: "Remoto", faixa: "", senioridade: "Pleno", habilidades: "", descricao: "" }); setAnswers([]); }}>
      <h2 className="text-lg font-semibold">Nova vaga</h2><div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="titulo">Título da vaga</Label><Input {...field("titulo")} required placeholder="Pessoa Desenvolvedora Back-end" /></div>
        <div className="space-y-2"><Label htmlFor="faixa">Faixa salarial</Label><Input {...field("faixa")} required placeholder="R$ 5.000 – R$ 7.000" /></div>
        {([{ key: "modelo", label: "Modelo de trabalho", values: ["Remoto", "Híbrido", "Presencial"] }, { key: "senioridade", label: "Senioridade", values: ["Júnior", "Pleno", "Sênior"] }] as const).map(({ key, label, values }) => <div className="space-y-2" key={key}><Label htmlFor={key}>{label}</Label><Select value={form[key]} onValueChange={(v) => setForm({ ...form, [key]: v })}><SelectTrigger id={key}><SelectValue /></SelectTrigger><SelectContent>{values.map((v) => <SelectItem value={v} key={v}>{v}</SelectItem>)}</SelectContent></Select></div>)}
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="habilidades">Habilidades, separadas por vírgula</Label><Input {...field("habilidades")} required placeholder="Node.js, SQL, Testes" /></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="descricao">Descrição e condições de trabalho</Label><Textarea {...field("descricao")} required rows={4} /></div>
      </div><div className="border-t pt-6"><EthicalQuestionnaire answers={answers} onChange={setAnswers} prefix="job" /></div>
      {block && <p className="text-sm text-destructive" role="status">{block}</p>}<Button type="submit" disabled={!!block}><ShieldCheck />Publicar vaga</Button>
    </form>
    <section className="space-y-4 border-t pt-6"><h2 className="text-lg font-semibold">Vagas da empresa</h2><div className="grid gap-4 sm:grid-cols-2">{own.map((j) => <Card key={j.id} className="rounded-xl"><CardHeader><CardTitle className="text-base">{j.titulo}</CardTitle><p className="text-sm text-muted-foreground">{j.modelo} · {j.faixa}</p></CardHeader><CardContent className="space-y-3"><p className="text-sm text-muted-foreground">Etitômetro: {j.selo}/100 · {j.ativa === false ? "Encerrada" : "Ativa"}</p>{j.ativa !== false && <Button variant="outline" size="sm" onClick={() => { encerrarVaga(j.id); toast.success("Vaga encerrada"); }}><Archive />Encerrar vaga</Button>}</CardContent></Card>)}</div></section>
  </div>;
}
