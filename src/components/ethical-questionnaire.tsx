import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CRITERIA, ethicalScore, ethicalZone, isGreen, type EthicalAnswer } from "@/lib/recruitment";
import { cn } from "@/lib/utils";

export function EthicalQuestionnaire({ answers, onChange, prefix = "ethics" }: { answers: EthicalAnswer[]; onChange: (value: EthicalAnswer[]) => void; prefix?: string }) {
  const zone = ethicalZone(answers);
  const ready = isGreen(answers);
  return <section className="space-y-4" aria-label="Questionário ético obrigatório">
    <div className="flex flex-wrap justify-between gap-2">
      <h2 className="font-semibold">Etitômetro da vaga</h2>
      <span className={cn("text-sm font-semibold", zone === "green" ? "text-success" : zone === "yellow" ? "text-warning-foreground" : "text-destructive")} role="status">
        {ethicalScore(answers)}/100 · {ready ? "Verde — aprovada" : zone === "yellow" ? "Amarelo — parcial" : "Vermelho — pendente"}
      </span>
    </div>
    <Progress value={ethicalScore(answers)} aria-label="Pontuação ética" className={cn(zone === "green" ? "[&>div]:bg-success" : zone === "yellow" ? "[&>div]:bg-warning" : "[&>div]:bg-destructive")} />
    <div className="grid gap-4 sm:grid-cols-2">
      {CRITERIA.map((c) => <div className="flex items-start gap-3" key={c.id}>
        <Checkbox id={`${prefix}-${c.id}`} checked={answers.includes(c.id)} onCheckedChange={(checked) => onChange(checked === true ? [...answers, c.id] : answers.filter((a) => a !== c.id))} />
        <Label htmlFor={`${prefix}-${c.id}`} className="block text-sm font-normal leading-relaxed">{c.texto}<span className="block text-xs text-muted-foreground">{c.referencia} · {c.peso} pontos</span></Label>
      </div>)}
    </div>
    {!ready && <div className="border-l-2 border-warning bg-muted/40 p-4 text-sm" aria-live="polite">
      <p className="font-medium">Publicação bloqueada</p>
      <p className="mt-1 text-muted-foreground">Mínimo de 85 pontos; triagem às cegas e LGPD obrigatórias. Autoavaliação demonstrativa, não certificação legal.</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{CRITERIA.filter((c) => !answers.includes(c.id)).map((c) => <li key={c.id}>{c.correcao}</li>)}</ul>
    </div>}
  </section>;
}