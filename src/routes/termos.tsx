import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de uso — SelectRH" },
      {
        name: "description",
        content: "Condições de uso do SelectRH, protótipo acadêmico de recrutamento às cegas.",
      },
      { property: "og:title", content: "Termos de uso — SelectRH" },
      { property: "og:description", content: "Regras de uso da plataforma SelectRH." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Termos,
});

function Termos() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-10 text-sm leading-relaxed text-muted-foreground">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Termos de uso</h1>
        <p>
          O SelectRH é um protótipo acadêmico (TCC) sem fins comerciais. O uso é livre para fins de
          estudo e demonstração.
        </p>
        <p>
          As vagas, empresas e perfis exibidos são fictícios e servem apenas para ilustrar o
          funcionamento do recrutamento às cegas.
        </p>
        <p>
          Ao usar a plataforma, você concorda em não inserir dados sensíveis reais e em respeitar os
          princípios de não discriminação adotados pelo projeto.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
