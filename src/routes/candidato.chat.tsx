import { createFileRoute } from "@tanstack/react-router";
import { MatchChat } from "@/components/match-chat";

export const Route = createFileRoute("/candidato/chat")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  component: MatchChat,
});

