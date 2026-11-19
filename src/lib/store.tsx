import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { z } from "zod";
import { CRITERIA, ethicalScore, publicationError, hasMutualInterest, type EthicalAnswer, type PlanName } from "./recruitment";

export type Role = "candidato" | "empresa";
export type Job = { id: string; titulo: string; empresa: string; setor: string; modelo: string; faixa: string; senioridade: string; habilidades: string[]; descricao: string; selo: number; companyId?: string | undefined; ativa?: boolean | undefined; respostas?: EthicalAnswer[] | undefined };
export type Candidate = { codigo: string; senioridade: string; experiencia: string; habilidades: string[]; idiomas: string[]; certificacoes: string[]; compatibilidade: number };
export type Company = { id: string; razaoSocial: string; cnpj: string; setor: string };
export type ChatMessage = { id: string; de: "candidato" | "empresa"; texto: string; hora: string };
export type Session = { role: Role; nome: string } | null;

const JOBS_INICIAIS: Job[] = [
  {
    id: "v1",
    titulo: "Pessoa Desenvolvedora Front-end",
    empresa: "Nimbus Tecnologia",
    setor: "Tecnologia",
    modelo: "Remoto",
    faixa: "R$ 6.000 – R$ 8.500",
    senioridade: "Pleno",
    habilidades: ["React", "TypeScript", "Acessibilidade", "Testes"],
    descricao:
      "Squad de produto responsável pelo portal do cliente. Processo 100% às cegas até a etapa final.",
    selo: 96,
  },
  {
    id: "v2",
    titulo: "Analista de Dados",
    empresa: "Vetor Analytics",
    setor: "Dados",
    modelo: "Híbrido",
    faixa: "R$ 5.200 – R$ 7.000",
    senioridade: "Pleno",
    habilidades: ["SQL", "Python", "Power BI", "Estatística"],
    descricao: "Construção de indicadores de diversidade e performance para clientes ESG.",
    selo: 91,
  },
  {
    id: "v3",
    titulo: "Pessoa Designer de Produto",
    empresa: "Atlas Saúde",
    setor: "Saúde",
    modelo: "Presencial",
    faixa: "R$ 4.800 – R$ 6.400",
    senioridade: "Júnior",
    habilidades: ["Figma", "Design System", "Pesquisa com usuários"],
    descricao: "Redesenho do app de agendamento com foco em acessibilidade WCAG AA.",
    selo: 88,
  },
  {
    id: "v4",
    titulo: "Pessoa Engenheira de Suporte",
    empresa: "Nimbus Tecnologia",
    setor: "Tecnologia",
    modelo: "Remoto",
    faixa: "R$ 3.900 – R$ 5.100",
    senioridade: "Júnior",
    habilidades: ["Linux", "Redes", "Atendimento técnico"],
    descricao: "Primeiro nível de suporte para clientes corporativos, escala 5x2.",
    selo: 93,
  },
];

const CANDIDATOS: Candidate[] = [
  {
    codigo: "#4821",
    senioridade: "Pleno",
    experiencia: "2 anos e 4 meses",
    habilidades: ["React", "TypeScript", "Acessibilidade", "Testes", "Git"],
    idiomas: ["Português (nativo)", "Inglês (avançado)"],
    certificacoes: ["Scrum Foundation", "AWS Cloud Practitioner"],
    compatibilidade: 94,
  },
  {
    codigo: "#7130",
    senioridade: "Sênior",
    experiencia: "6 anos e 1 mês",
    habilidades: ["SQL", "Python", "Power BI", "Modelagem de dados"],
    idiomas: ["Português (nativo)", "Espanhol (intermediário)"],
    certificacoes: ["Databricks Data Engineer"],
    compatibilidade: 89,
  },
  {
    codigo: "#2394",
    senioridade: "Júnior",
    experiencia: "11 meses",
    habilidades: ["Figma", "Design System", "Pesquisa com usuários"],
    idiomas: ["Português (nativo)", "Inglês (intermediário)"],
    certificacoes: ["Google UX Design"],
    compatibilidade: 82,
  },
  {
    codigo: "#5567",
    senioridade: "Pleno",
    experiencia: "3 anos e 8 meses",
    habilidades: ["Linux", "Redes", "Atendimento técnico", "ITIL"],
    idiomas: ["Português (nativo)"],
    certificacoes: ["ITIL v4 Foundation"],
    compatibilidade: 77,
  },
];

const DEFAULT_PROFILE: Candidate = { codigo: "#4821", senioridade: "Pleno", experiencia: "2 anos e 4 meses", habilidades: ["React", "TypeScript", "Acessibilidade", "Testes", "Git"], idiomas: ["Português (nativo)", "Inglês (avançado)"], certificacoes: ["Scrum Foundation", "AWS Cloud Practitioner"], compatibilidade: 94 };
type State = {
  session: Session; perfil: Candidate; company: Company; jobs: Job[];
  curtidas: string[]; passadas: string[]; interessesEmpresa: Record<string, string[]>;
  visualizacoes: number; empresasVisualizaram: string[]; plano: PlanName; trialStart: string | null;
  mensagens: Record<string, ChatMessage[]>; etitometro: number | null;
  contratados: { codigo: string; jobId: string; data: string }[];
};
const INITIAL: State = {
  session: null, perfil: DEFAULT_PROFILE,
  company: { id: "nimbus", razaoSocial: "Nimbus Tecnologia", cnpj: "12.345.678/0001-90", setor: "Tecnologia" },
  jobs: JOBS_INICIAIS.map((j) => ({ ...j, companyId: j.empresa === "Nimbus Tecnologia" ? "nimbus" : j.id, ativa: true, respostas: CRITERIA.map((c) => c.id), selo: 100 })),
  curtidas: [], passadas: [], interessesEmpresa: {}, visualizacoes: 14, empresasVisualizaram: [],
  plano: "Período de Teste", trialStart: null, mensagens: {}, etitometro: null, contratados: [],
};
const candidateSchema = z.object({ codigo: z.string(), senioridade: z.string(), experiencia: z.string(), habilidades: z.array(z.string()), idiomas: z.array(z.string()), certificacoes: z.array(z.string()), compatibilidade: z.number() });
const storageSchema = z.object({
  session: z.object({ role: z.enum(["candidato", "empresa"]), nome: z.string() }).nullable(), perfil: candidateSchema,
  company: z.object({ id: z.string(), razaoSocial: z.string(), cnpj: z.string(), setor: z.string() }),
  jobs: z.array(z.object({ id: z.string(), titulo: z.string(), empresa: z.string(), setor: z.string(), modelo: z.string(), faixa: z.string(), senioridade: z.string(), habilidades: z.array(z.string()), descricao: z.string(), selo: z.number(), companyId: z.string().optional(), ativa: z.boolean().optional(), respostas: z.array(z.enum(["cegas", "salario", "feedback", "acessibilidade", "saude", "ergonomia", "diversidade", "lgpd"])).optional() })),
  curtidas: z.array(z.string()), passadas: z.array(z.string()), interessesEmpresa: z.record(z.array(z.string())),
  visualizacoes: z.number(), empresasVisualizaram: z.array(z.string()), plano: z.enum(["Período de Teste", "Básico", "Premium"]), trialStart: z.string().datetime().nullable(),
  mensagens: z.record(z.array(z.object({ id: z.string(), de: z.enum(["candidato", "empresa"]), texto: z.string(), hora: z.string() }))),
  etitometro: z.number().nullable(), contratados: z.array(z.object({ codigo: z.string(), jobId: z.string(), data: z.string() })),
});
type Store = State & {
  ready: boolean; candidatos: Candidate[]; matches: string[];
  entrar: (role: Role, nome: string) => void; sair: () => void;
  curtirVaga: (id: string) => boolean; passarVaga: (id: string) => void;
  demonstrarInteresse: (jobId: string, codigo: string) => boolean;
  publicarVaga: (job: Job) => string | null; encerrarVaga: (id: string) => void;
  escolherPlano: (plano: PlanName) => string | null; salvarEtitometro: (nota: number) => void;
  atualizarPerfil: (p: Partial<Candidate>) => void; atualizarEmpresa: (p: Omit<Company, "id">) => void;
  enviarMensagem: (jobId: string, texto: string) => void;
  registrarVisualizacao: () => void; contratar: (jobId: string) => void;
  reiniciar: () => void;
};
const StoreContext = createContext<Store | null>(null);
const KEY = "selectrh-demo-v2";
function companyInterests(s: State) { return Object.keys(s.interessesEmpresa).filter((id) => s.interessesEmpresa[id]?.includes(s.perfil.codigo)); }
function matchesFor(s: State) { return s.jobs.filter((j) => hasMutualInterest(j.id, s.curtidas, companyInterests(s))).map((j) => j.id); }

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const stateRef = useRef<State>(INITIAL);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let restored = INITIAL;
    try { const raw = localStorage.getItem(KEY); if (raw) { const parsed = storageSchema.safeParse(JSON.parse(raw)); if (parsed.success) restored = parsed.data; } } catch { /* Invalid demo state is discarded. */ }
    stateRef.current = restored; setState(restored); setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* The demo remains usable when storage is unavailable. */ } } }, [state, ready]);
  const value = useMemo<Store>(() => {
    const update = (change: (s: State) => State) => { const next = change(stateRef.current); stateRef.current = next; setState(next); };
    return {
      ...state, ready, candidatos: CANDIDATOS.map((c) => c.codigo === state.perfil.codigo ? state.perfil : c), matches: matchesFor(state),
      entrar: (role, nome) => update((s) => ({ ...s, session: { role, nome }, trialStart: role === "empresa" ? s.trialStart ?? new Date().toISOString() : s.trialStart })),
      sair: () => update((s) => ({ ...s, session: null })),
      curtirVaga: (id) => {
        const s = stateRef.current;
        if (s.session?.role !== "candidato" || !s.jobs.some((j) => j.id === id && j.ativa !== false)) return false;
        const match = companyInterests(s).includes(id);
        update((s) => ({ ...s, curtidas: Array.from(new Set([...s.curtidas, id])), passadas: s.passadas.filter((x) => x !== id) }));
        return match;
      },
      passarVaga: (id) => update((s) => s.session?.role !== "candidato" ? s : ({ ...s, passadas: Array.from(new Set([...s.passadas, id])) })),
      demonstrarInteresse: (id, codigo) => {
        const s = stateRef.current;
        if (s.session?.role !== "empresa" || !s.jobs.some((j) => j.id === id && j.companyId === s.company.id && j.ativa !== false)) return false;
        update((s) => ({ ...s, interessesEmpresa: { ...s.interessesEmpresa, [id]: Array.from(new Set([...(s.interessesEmpresa[id] ?? []), codigo])) } }));
        return codigo === s.perfil.codigo && s.curtidas.includes(id);
      },
      publicarVaga: (job) => {
        const s = stateRef.current;
        if (s.session?.role !== "empresa") return "Entre como empresa para publicar uma vaga.";
        const error = publicationError(s.plano, s.jobs.filter((j) => j.companyId === s.company.id && j.ativa !== false).length, s.trialStart, job.respostas ?? []);
        if (error) return error;
        if (!job.titulo.trim() || !job.faixa.trim() || !job.descricao.trim() || job.habilidades.length === 0) return "Informe título, faixa salarial, descrição e habilidades.";
        update((s) => ({ ...s, jobs: [{ ...job, empresa: s.company.razaoSocial, setor: s.company.setor, companyId: s.company.id, ativa: true, selo: ethicalScore(job.respostas ?? []) }, ...s.jobs] })); return null;
      },
      encerrarVaga: (id) => update((s) => s.session?.role !== "empresa" ? s : ({ ...s, jobs: s.jobs.map((j) => j.id === id && j.companyId === s.company.id ? { ...j, ativa: false } : j) })),
      escolherPlano: (plano) => {
        const s = stateRef.current;
        if (s.session?.role !== "empresa") return "Entre como empresa para escolher um plano.";
        if (plano === "Básico" && s.jobs.filter((j) => j.companyId === s.company.id && j.ativa !== false).length > 5) return "Encerre vagas até ter no máximo 5 ativas antes de escolher o Básico.";
        update((s) => ({ ...s, plano })); return null;
      },
      salvarEtitometro: (nota) => update((s) => ({ ...s, etitometro: nota })),
      atualizarPerfil: (p) => update((s) => ({ ...s, perfil: { ...s.perfil, ...p, codigo: s.perfil.codigo } })),
      atualizarEmpresa: (p) => update((s) => ({ ...s, company: { ...s.company, ...p }, session: s.session?.role === "empresa" ? { role: "empresa", nome: p.razaoSocial } : s.session, jobs: s.jobs.map((j) => j.companyId === s.company.id ? { ...j, empresa: p.razaoSocial, setor: p.setor } : j) })),
      enviarMensagem: (jobId, texto) => {
        const s = stateRef.current; const role = s.session?.role;
        if (!role || !texto.trim() || !matchesFor(s).includes(jobId)) return;
        if (role === "empresa" && !s.jobs.some((j) => j.id === jobId && j.companyId === s.company.id)) return;
        update((s) => ({ ...s, mensagens: { ...s.mensagens, [jobId]: [...(s.mensagens[jobId] ?? []), { id: crypto.randomUUID(), de: role, texto: texto.trim(), hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }] } }));
      },
      registrarVisualizacao: () => update((s) => s.session?.role !== "empresa" || s.empresasVisualizaram.includes(s.company.id) ? s : ({ ...s, empresasVisualizaram: [...s.empresasVisualizaram, s.company.id], visualizacoes: s.visualizacoes + 1 })),
      contratar: (id) => update((s) => s.session?.role !== "empresa" || !matchesFor(s).includes(id) || !s.jobs.some((j) => j.id === id && j.companyId === s.company.id) || s.contratados.some((h) => h.jobId === id) ? s : ({ ...s, contratados: [...s.contratados, { codigo: s.perfil.codigo, jobId: id, data: new Date().toISOString() }], jobs: s.jobs.map((j) => j.id === id ? { ...j, ativa: false } : j) })),
      reiniciar: () => { try { localStorage.removeItem("selectrh-estado"); } catch { /* optional legacy cleanup */ } update(() => INITIAL); },
    };
  }, [state, ready]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error("useStore precisa estar dentro de StoreProvider"); return value; }
