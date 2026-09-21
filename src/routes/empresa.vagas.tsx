import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const { jobs, publicarVaga, etitometro } = useStore();
  const [form, setForm] = useState({
    titulo: "",
    empresa: "Minha empresa",
    setor: "Tecnologia",
    modelo: "Remoto",
    faixa: "",
    senioridade: "Pleno",
    habilidades: "",
    descricao: "",
  });

  const campo = (k: keyof typeof form) => ({
    id: k,
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Briefcase className="size-5 text-primary" /> Minhas vagas
        </h1>
        <p className="text-sm text-muted-foreground">
          A faixa salarial é obrigatória: transparência é um compromisso do SelectRH.
        </p>
      </header>

      <Card className="rounded-2xl border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Publicar nova vaga</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.titulo.trim() || !form.faixa.trim()) {
                toast.error("Preencha o título e a faixa salarial.");
                return;
              }
              publicarVaga({
                id: crypto.randomUUID(),
                titulo: form.titulo,
                empresa: form.empresa,
                setor: form.setor,
                modelo: form.modelo,
                faixa: form.faixa,
                senioridade: form.senioridade,
                habilidades: form.habilidades
                  .split(",")
                  .map((h) => h.trim())
                  .filter(Boolean),
                descricao: form.descricao,
                selo: etitometro ?? 80,
              });
              toast.success("Vaga publicada", {
                description: "Ela já aparece para os candidatos de forma anônima.",
              });
              setForm((f) => ({ ...f, titulo: "", faixa: "", habilidades: "", descricao: "" }));
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da vaga</Label>
              <Input {...campo("titulo")} placeholder="Pessoa Desenvolvedora Back-end" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input {...campo("empresa")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Input {...campo("setor")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo de trabalho</Label>
              <Input {...campo("modelo")} placeholder="Remoto, Híbrido ou Presencial" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faixa">Faixa salarial</Label>
              <Input {...campo("faixa")} placeholder="R$ 5.000 – R$ 7.000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senioridade">Senioridade</Label>
              <Input {...campo("senioridade")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="habilidades">Habilidades (separadas por vírgula)</Label>
              <Input {...campo("habilidades")} placeholder="Node.js, SQL, Testes" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea {...campo("descricao")} rows={3} />
            </div>
            <Button type="submit" className="rounded-full sm:col-span-2 sm:w-fit">
              Publicar vaga
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Vagas abertas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((j) => (
            <Card key={j.id} className="rounded-2xl border-border/70">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{j.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {j.empresa} · {j.modelo} · {j.faixa}
                </p>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="size-4 text-primary" /> Etitômetro: {j.selo}/100
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
