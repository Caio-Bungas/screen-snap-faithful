import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/candidato/chat")({
  head: () => ({
    meta: [
      { title: "Mensagens — SelectRH" },
      {
        name: "description",
        content: "O chat do SelectRH é desbloqueado apenas depois da confirmação do match mútuo.",
      },
      { property: "og:title", content: "Mensagens — SelectRH" },
      {
        property: "og:description",
        content: "Converse com empresas que confirmaram match com seu perfil anônimo.",
      },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { matches, jobs, mensagens, enviarMensagem } = useStore();
  const [ativo, setAtivo] = useState<string | null>(matches[0] ?? null);
  const [texto, setTexto] = useState("");
  const atual = ativo ?? matches[0] ?? null;

  if (matches.length === 0) {
    return (
      <Card className="rounded-2xl border-dashed">
        <CardContent className="flex flex-col items-center gap-3 p-14 text-center">
          <Lock className="size-6 text-muted-foreground" />
          <p className="font-medium">Chat bloqueado</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            As conversas são liberadas somente após o match mútuo. Dê match em uma vaga na aba
            “Vagas &amp; Match”.
          </p>
        </CardContent>
      </Card>
    );
  }

  const vaga = jobs.find((j) => j.id === atual);
  const thread = atual ? (mensagens[atual] ?? []) : [];

  return (
    <div className="grid gap-5 md:grid-cols-[260px_1fr]">
      <Card className="h-fit rounded-2xl border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Conversas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-3">
          {matches.map((id) => {
            const j = jobs.find((x) => x.id === id);
            return (
              <button
                key={id}
                onClick={() => setAtivo(id)}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  id === atual ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                )}
              >
                <span className="block font-medium">{j?.empresa}</span>
                <span className="block truncate text-xs opacity-80">{j?.titulo}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="flex min-h-[460px] flex-col rounded-2xl border-border/70">
        <CardHeader className="border-b border-border/70">
          <CardTitle className="text-base">{vaga?.empresa}</CardTitle>
          <p className="text-sm text-muted-foreground">{vaga?.titulo}</p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
          {thread.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                m.de === "eu"
                  ? "self-end bg-primary text-primary-foreground"
                  : "self-start bg-muted",
              )}
            >
              {m.texto}
              <span className="mt-1 block text-[10px] opacity-70">{m.hora}</span>
            </div>
          ))}
        </CardContent>
        <div className="flex gap-2 border-t border-border/70 p-4">
          <Input
            value={texto}
            placeholder="Escreva uma mensagem…"
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && texto.trim() && atual) {
                enviarMensagem(atual, texto.trim());
                setTexto("");
              }
            }}
          />
          <Button
            className="rounded-full"
            onClick={() => {
              if (!texto.trim() || !atual) return;
              enviarMensagem(atual, texto.trim());
              setTexto("");
            }}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
