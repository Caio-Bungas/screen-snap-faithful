import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, UserRound, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — SelectRH" },
      {
        name: "description",
        content:
          "Acesse o SelectRH como candidato ou como empresa. Contas de teste disponíveis para demonstração.",
      },
      { property: "og:title", content: "Entrar — SelectRH" },
      {
        property: "og:description",
        content: "Login simulado do protótipo SelectRH com contas de teste em um clique.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const { entrar } = useStore();
  const navigate = useNavigate();
  const [cand, setCand] = useState({ email: "", senha: "" });
  const [emp, setEmp] = useState({ email: "", senha: "", cnpj: "" });

  const acessar = (role: "candidato" | "empresa", nome: string) => {
    entrar(role, nome);
    toast.success(`Bem-vindo(a), ${nome}!`);
    navigate({ to: role === "candidato" ? "/candidato" : "/empresa" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="surface-grid flex flex-1 items-center justify-center px-4 py-14">
        <Card className="w-full max-w-lg rounded-3xl border-border/70 shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-2xl">Entrar na plataforma</CardTitle>
            <p className="text-sm text-muted-foreground">
              Modo demonstração de TCC: nenhum dado real é armazenado em servidor.
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="candidato">
              <TabsList className="grid w-full grid-cols-2 rounded-full">
                <TabsTrigger value="candidato" className="rounded-full">
                  <UserRound className="size-4" /> Candidato
                </TabsTrigger>
                <TabsTrigger value="empresa" className="rounded-full">
                  <Building2 className="size-4" /> Empresa
                </TabsTrigger>
              </TabsList>

              <TabsContent value="candidato" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="c-email">E-mail</Label>
                  <Input
                    id="c-email"
                    value={cand.email}
                    onChange={(e) => setCand({ ...cand, email: e.target.value })}
                    placeholder="voce@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-senha">Senha</Label>
                  <Input
                    id="c-senha"
                    type="password"
                    value={cand.senha}
                    onChange={(e) => setCand({ ...cand, senha: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  variant="secondary"
                  className="w-full rounded-full"
                  onClick={() => setCand({ email: "candidato.teste@selectrh.app", senha: "123456" })}
                >
                  <Wand2 className="size-4" /> Preencher conta de teste — Candidato
                </Button>
                <Button
                  className="w-full rounded-full"
                  onClick={() => acessar("candidato", "Candidato #4821")}
                >
                  Entrar como candidato
                </Button>
              </TabsContent>

              <TabsContent value="empresa" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="e-email">E-mail corporativo</Label>
                  <Input
                    id="e-email"
                    value={emp.email}
                    onChange={(e) => setEmp({ ...emp, email: e.target.value })}
                    placeholder="rh@empresa.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-cnpj">CNPJ</Label>
                  <Input
                    id="e-cnpj"
                    value={emp.cnpj}
                    onChange={(e) => setEmp({ ...emp, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-senha">Senha</Label>
                  <Input
                    id="e-senha"
                    type="password"
                    value={emp.senha}
                    onChange={(e) => setEmp({ ...emp, senha: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  variant="secondary"
                  className="w-full rounded-full"
                  onClick={() =>
                    setEmp({
                      email: "rh@nimbustec.com.br",
                      senha: "123456",
                      cnpj: "12.345.678/0001-90",
                    })
                  }
                >
                  <Wand2 className="size-4" /> Preencher conta de teste — Empresa
                </Button>
                <Button
                  className="w-full rounded-full"
                  onClick={() => acessar("empresa", "Nimbus Tecnologia")}
                >
                  Entrar como empresa
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
