import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, ThemeToggle } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowUpRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — SelectRH" },
      {
        name: "description",
        content: "Ajuste o tema e revise as preferências da sua conta no SelectRH.",
      },
      { property: "og:title", content: "Configurações — SelectRH" },
      { property: "og:description", content: "Preferências de aparência e conta do SelectRH." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const { reiniciar } = useStore();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <section className="space-y-3 border-t py-5">
          <h2 className="font-semibold">Aparência</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Modo claro / escuro</p>
            <ThemeToggle />
          </div>
        </section>
        <section className="space-y-3 border-t py-5">
          <h2 className="font-semibold">Privacidade</h2>
          <p className="text-sm text-muted-foreground">
            Seus dados ficam salvos apenas neste navegador. Nenhuma informação pessoal é enviada
            para empresas; os perfis e vagas são fictícios.
          </p>
          <AlertDialog><AlertDialogTrigger asChild><Button variant="outline"><RotateCcw />Reiniciar demonstração</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Reiniciar a demonstração?</AlertDialogTitle><AlertDialogDescription>Vagas criadas, interesses, conversas, contratações e alterações de perfil serão apagados deste navegador. As contas de teste e vagas iniciais serão restauradas.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => { reiniciar(); navigate({ to: "/login" }); }}>Reiniciar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </section>
        <section className="space-y-3 border-t py-5"><h2 className="font-semibold">Saiba mais</h2><div className="flex flex-wrap gap-2">{([{ to: "/sobre", text: "Quem somos" }, { to: "/termos", text: "Termos de uso" }, { to: "/privacidade", text: "Política de privacidade" }] as const).map((item) => <Button key={item.to} variant="outline" asChild><Link to={item.to}>{item.text}<ArrowUpRight /></Link></Button>)}</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
