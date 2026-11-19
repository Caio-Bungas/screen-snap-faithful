import { createFileRoute } from "@tanstack/react-router";
import { MatchChat } from "@/components/match-chat";
export const Route = createFileRoute("/empresa/chat")({
  head: () => ({ meta: [
    { title: "Conversas com talentos — SelectRH" },
    { name: "description", content: "Converse com talentos anônimos após o interesse mútuo e acompanhe contratações demonstrativas." },
    { property: "og:title", content: "Conversas com talentos — SelectRH" },
    { property: "og:description", content: "Mensagens e contratações com match mútuo no SelectRH." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MatchChat,
});