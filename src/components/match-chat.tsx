import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, Send, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MatchChat() {
  const { matches, jobs, company, perfil, session, mensagens, enviarMensagem, contratar, contratados } = useStore();
  const employer = session?.role === "empresa";
  const visible = matches.filter((id) => !employer || jobs.some((j) => j.id === id && j.companyId === company.id));
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const current = selected && visible.includes(selected) ? selected : visible[0];
  const job = jobs.find((j) => j.id === current);
  const hired = contratados.some((h) => h.jobId === current);
  if (!current) return <section className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
    <Lock className="size-7 text-muted-foreground" /><h1 className="text-xl font-semibold">Chat bloqueado</h1>
    <p className="max-w-md text-sm text-muted-foreground">Nenhum match mútuo confirmado.</p>
    <Button asChild variant="outline"><Link to={employer ? "/empresa" : "/candidato/vagas"}>{employer ? "Ver talentos" : "Ver vagas"}</Link></Button>
  </section>;
  return <div className="grid min-w-0 gap-5 md:grid-cols-[250px_minmax(0,1fr)]">
    <aside className="space-y-2"><h1 className="mb-4 text-xl font-semibold">Mensagens</h1>
      {visible.map((id) => { const j = jobs.find((j) => j.id === id); return <Button key={id} variant={id === current ? "secondary" : "ghost"} onClick={() => { setSelected(id); setText(""); }} className="h-auto w-full justify-start whitespace-normal p-3 text-left">
        <span className="min-w-0"><span className="block">{employer ? `Candidato ${perfil.codigo}` : j?.empresa}</span><span className="block text-xs text-muted-foreground">{j?.titulo}</span></span>
      </Button>; })}
    </aside>
    <section className="flex min-w-0 flex-col rounded-xl border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div><h2 className="font-semibold">{employer ? `Candidato ${perfil.codigo}` : job?.empresa}</h2><p className="text-sm text-muted-foreground">{job?.titulo}</p><p className="mt-1 text-xs text-success">Match mútuo confirmado · dados pessoais permanecem protegidos</p></div>
        {employer && <Button variant="outline" disabled={hired} onClick={() => { contratar(current); toast.success("Contratação demonstrativa registrada"); }}><CheckCheck />{hired ? "Contratação registrada" : "Registrar contratação"}</Button>}
      </header>
      <div className="flex h-96 flex-col gap-3 overflow-y-auto p-4" role="log" aria-label="Histórico da conversa" aria-live="polite">
        {(mensagens[current] ?? []).length === 0 && <p className="m-auto text-center text-sm text-muted-foreground">Nenhuma mensagem nesta conversa.</p>}
        {(mensagens[current] ?? []).map((m) => <div key={m.id} className={cn("max-w-[85%] break-words rounded-xl px-4 py-2 text-sm", m.de === session?.role ? "self-end bg-primary text-primary-foreground" : "self-start bg-muted")}>
          <p className="mb-1 text-xs opacity-80">{m.de === "candidato" ? `Candidato ${perfil.codigo}` : job?.empresa}</p>{m.texto}<span className="mt-1 block text-right text-xs opacity-70">{m.hora}</span>
        </div>)}
      </div>
      <form className="flex gap-2 border-t p-4" onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; enviarMensagem(current, text); setText(""); }}>
        <Input aria-label="Mensagem" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva uma mensagem…" maxLength={3000} /><Button type="submit" size="icon" disabled={!text.trim()} aria-label="Enviar mensagem" title="Enviar mensagem"><Send /></Button>
      </form>
    </section>
  </div>;
}