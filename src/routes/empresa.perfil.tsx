import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/perfil")({
  head: () => ({ meta: [
    { title: "Perfil corporativo — SelectRH" }, { name: "description", content: "Gerencie razão social, CNPJ demonstrativo e setor da empresa no SelectRH." },
    { property: "og:title", content: "Perfil corporativo — SelectRH" }, { property: "og:description", content: "Cadastro e informações corporativas da empresa." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: CompanyProfile,
});
function CompanyProfile() {
  const { company, atualizarEmpresa } = useStore();
  const [form, setForm] = useState({ razaoSocial: company.razaoSocial, cnpj: company.cnpj, setor: company.setor });
  return <div className="max-w-2xl space-y-6"><header><h1 className="flex items-center gap-2 text-2xl font-semibold"><Building2 className="text-primary" />Perfil corporativo</h1><p className="mt-1 text-sm text-muted-foreground">Cadastro demonstrativo · sem consulta ou validação fiscal do CNPJ.</p></header>
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); if (form.cnpj.replace(/\D/g, "").length !== 14) { toast.error("Informe um CNPJ de teste com 14 dígitos."); return; } atualizarEmpresa({ razaoSocial: form.razaoSocial.trim(), cnpj: form.cnpj, setor: form.setor.trim() }); toast.success("Perfil corporativo atualizado"); }}>
      {([{ key: "razaoSocial", label: "Razão social" }, { key: "cnpj", label: "CNPJ de teste" }, { key: "setor", label: "Setor de atuação" }] as const).map(({ key, label }) => <div className="space-y-2" key={key}><Label htmlFor={key}>{label}</Label><Input id={key} required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></div>)}
      <Button type="submit"><Save />Salvar perfil</Button>
    </form>
  </div>;
}