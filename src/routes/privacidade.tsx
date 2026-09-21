import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — SelectRH" },
      {
        name: "description",
        content: "Como o SelectRH trata dados pessoais e garante o anonimato dos candidatos.",
      },
      { property: "og:title", content: "Política de privacidade — SelectRH" },
      {
        property: "og:description",
        content: "Anonimato por padrão e conformidade com a LGPD no SelectRH.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-10 text-sm leading-relaxed text-muted-foreground">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Política de privacidade
        </h1>
        <p>
          Os dados inseridos ficam armazenados apenas no seu próprio navegador e podem ser apagados
          a qualquer momento limpando os dados do site.
        </p>
        <p>
          Nome, idade, foto e outros marcadores pessoais nunca são exibidos às empresas antes do
          match mútuo — os perfis aparecem identificados apenas por um código.
        </p>
        <p>
          O projeto segue os princípios da LGPD (Lei 13.709/2018): finalidade, necessidade e
          transparência no tratamento de dados.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
