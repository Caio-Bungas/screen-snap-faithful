import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Users, Heart, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { trialRemaining } from "@/lib/recruitment";

export const Route = createFileRoute("/empresa/painel")({
  head: () => ({ meta: [
    { title: "Painel corporativo e ESG — SelectRH" }, { name: "description", content: "Acompanhe vagas, matches, contratações e indicadores agregados de recrutamento ético." },
    { property: "og:title", content: "Painel corporativo e ESG — SelectRH" }, { property: "og:description", content: "Visão geral da empresa e relatórios éticos demonstrativos." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Dashboard,
});
function Dashboard() {
  const { company, jobs, matches, contratados, candidatos, plano, trialStart } = useStore();
  const own = jobs.filter((j) => j.companyId === company.id);
  const hires = contratados.filter((h) => own.some((j) => j.id === h.jobId));
  const ownMatches = matches.filter((id) => own.some((j) => j.id === id));
  const metrics = [
    { label: "Triagem às cegas · ODS 10", value: own.length ? Math.round(own.filter((j) => j.respostas?.includes("cegas")).length / own.length * 100) : 0 },
    { label: "Salário transparente · ODS 8", value: own.length ? Math.round(own.filter((j) => j.faixa.trim()).length / own.length * 100) : 0 },
    { label: "Etapas acessíveis · ODS 10", value: own.length ? Math.round(own.filter((j) => j.respostas?.includes("acessibilidade")).length / own.length * 100) : 0 },
    { label: "Proteção de dados · LGPD", value: own.length ? Math.round(own.filter((j) => j.respostas?.includes("lgpd")).length / own.length * 100) : 0 },
  ];
  const exportReport = () => {
    const rows = [["Indicador demonstrativo", "Valor"], ...metrics.map((m) => [m.label, `${m.value}%`]), ["Contratações demonstrativas", String(hires.length)]];
    const blob = new Blob(["\uFEFF" + rows.map((r) => r.map((v) => `"${v.replaceAll('"', '""')}"`).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "selectrh-relatorio-demonstrativo.csv"; a.click(); URL.revokeObjectURL(url);
  };
  return <div className="space-y-8"><header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold">{company.razaoSocial}</h1><p className="mt-1 text-sm text-muted-foreground">{company.setor} · {plano}{plano === "Período de Teste" ? ` · ${trialRemaining(trialStart)} dias restantes` : ""}</p></div><Button asChild><Link to="/empresa/vagas"><Briefcase />Nova vaga</Link></Button></header>
    <div className="grid gap-4 sm:grid-cols-3">{[{ icon: Briefcase, label: "Vagas ativas", value: own.filter((j) => j.ativa !== false).length }, { icon: Heart, label: "Matches mútuos", value: ownMatches.length }, { icon: Users, label: "Contratações", value: hires.length }].map((m) => <Card key={m.label} className="rounded-xl"><CardContent className="p-5"><m.icon className="size-5 text-primary" /><p className="mt-3 text-3xl font-semibold">{m.value}</p><p className="text-sm text-muted-foreground">{m.label}</p></CardContent></Card>)}</div>
    <section className="space-y-4"><h2 className="text-lg font-semibold">Contratações demonstrativas</h2>{hires.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma contratação registrada.</p> : <div className="divide-y border-y">{hires.map((h) => <div key={h.jobId} className="flex flex-wrap justify-between gap-2 py-4"><div><p className="font-medium">Candidato {h.codigo}</p><p className="text-sm text-muted-foreground">{own.find((j) => j.id === h.jobId)?.titulo}</p></div><Badge variant="secondary">{new Date(h.data).toLocaleDateString("pt-BR")}</Badge></div>)}</div>}</section>
    <section className="space-y-5 border-t pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Relatório de práticas éticas · ESG</h2><Button variant="outline" onClick={exportReport}><Download />Exportar relatório</Button></div><p className="text-sm text-muted-foreground">Indicadores calculados sobre vagas fictícias e autoavaliações. Não são auditoria nem certificação legal.</p><div className="grid gap-5 sm:grid-cols-2">{metrics.map((m) => <div className="space-y-2" key={m.label}><div className="flex justify-between gap-2 text-sm"><span>{m.label}</span><strong>{m.value}%</strong></div><Progress value={m.value} aria-label={m.label} /></div>)}</div></section>
    <section className="space-y-4 border-t pt-6"><h2 className="text-lg font-semibold">Métricas avançadas de diversidade profissional</h2>{plano === "Premium" ? <><div className="grid gap-4 sm:grid-cols-3">{["Júnior", "Pleno", "Sênior"].map((level) => <div key={level} className="border-l-2 border-primary pl-4"><p className="text-2xl font-semibold">{candidatos.filter((c) => c.senioridade === level).length}</p><p className="text-sm text-muted-foreground">Perfis {level}</p></div>)}</div><p className="text-sm text-muted-foreground">Amostra fictícia de {candidatos.length} talentos. Não coletamos raça, gênero, idade ou localização; não há relatório demográfico.</p></> : <Button asChild variant="outline"><Link to="/empresa/planos">Ver plano Premium<ArrowUpRight /></Link></Button>}</section>
  </div>;
}