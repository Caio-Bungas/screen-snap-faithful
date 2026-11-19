import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Quem somos — SelectRH" },
      {
        name: "description",
        content:
          "O SelectRH nasceu como projeto escolar da Escola Papa João Paulo, orientado pela Prof. Tatiane, para combater vieses inconscientes na contratação.",
      },
      { property: "og:title", content: "Quem somos — SelectRH" },
      {
        property: "og:description",
        content: "A história e os fundamentos do recrutamento às cegas do SelectRH.",
      },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Quem somos</h1>
        <p className="mt-4 text-muted-foreground">
          O SelectRH é um projeto escolar desenvolvido na Escola Papa João Paulo, sob orientação da
          Prof. Tatiane. A proposta é simples e incômoda: se a competência é o que importa, por que
          o currículo começa pelo nome e pela foto?
        </p>

        <h2 className="mt-10 text-xl font-semibold">A base do estudo</h2>
        <p className="mt-3 text-muted-foreground">
          O estudo de Marianne Bertrand (Universidade de Chicago) e Sendhil Mullainathan (MIT),
          publicado em 2004, enviou currículos fictícios equivalentes com nomes percebidos como de
          pessoas brancas ou negras. Os primeiros receberam cerca de 50% mais retornos. Isso não
          significa que ocultar nomes elimina todo viés, mas evidencia o impacto de sinais pessoais
          na seleção. O SelectRH propõe uma triagem centrada em competências.
        </p>

        <p className="mt-3 text-sm"><a className="text-primary underline underline-offset-4" href="https://www.nber.org/papers/w9873" target="_blank" rel="noopener noreferrer">Fonte: Are Emily and Greg More Employable than Lakisha and Jamal? (NBER)</a></p>
        <h2 className="mt-10 text-xl font-semibold">Como funciona</h2>
        <div className="mt-4 grid gap-4">
          {[
            [
              "Matching duplo-cego",
              "Empresas veem códigos anônimos; candidatos veem empresas identificadas por código até o match. O chat só abre após o match mútuo.",
            ],
            [
              "Etitômetro",
              "Questionário ético obrigatório na criação da vaga, validando ODS 8 e 10 da ONU, NR-1, NR-7, NR-17 e LGPD.",
            ],
            [
              "Perfil por habilidades",
              "Competências, tempo de experiência, idiomas e certificações — a única informação exibida antes do match.",
            ],
          ].map(([titulo, texto]) => (
            <Card key={titulo} className="rounded-2xl border-border/70">
              <CardContent className="p-5">
                <p className="font-semibold">{titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
