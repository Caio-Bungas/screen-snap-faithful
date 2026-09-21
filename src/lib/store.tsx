import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "candidato" | "empresa";

export type Job = {
  id: string;
  titulo: string;
  empresa: string;
  setor: string;
  modelo: string;
  faixa: string;
  senioridade: string;
  habilidades: string[];
  descricao: string;
  selo: number; // pontuação do Etitômetro
};

export type Candidate = {
  codigo: string;
  senioridade: string;
  experiencia: string;
  habilidades: string[];
  idiomas: string[];
  certificacoes: string[];
  compatibilidade: number;
};

export type ChatMessage = { id: string; de: "eu" | "outro"; texto: string; hora: string };

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

type State = {
  session: Session;
  perfil: Candidate;
  jobs: Job[];
  curtidas: string[];
  passadas: string[];
  matches: string[];
  visualizacoes: number;
  plano: string;
  mensagens: Record<string, ChatMessage[]>;
  etitometro: number | null;
};

const ESTADO_INICIAL: State = {
  session: null,
  perfil: CANDIDATOS[0]!,
  jobs: JOBS_INICIAIS,
  curtidas: [],
  passadas: [],
  matches: [],
  visualizacoes: 14,
  plano: "Período de teste",
  mensagens: {},
};

type Store = State & {
  candidatos: Candidate[];
  entrar: (role: Role, nome: string) => void;
  sair: () => void;
  curtirVaga: (id: string) => boolean;
  passarVaga: (id: string) => void;
  publicarVaga: (job: Job) => void;
  escolherPlano: (plano: string) => void;
  atualizarPerfil: (p: Partial<Candidate>) => void;
  enviarMensagem: (jobId: string, texto: string) => void;
};

const StoreContext = createContext<Store | null>(null);

const CHAVE = "selectrh-estado";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(ESTADO_INICIAL);

  useEffect(() => {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) {
      try {
        setState((s) => ({ ...s, ...JSON.parse(bruto) }));
      } catch {
        /* estado inválido ignorado */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(state));
  }, [state]);

  const hora = () =>
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const curtirVaga = useCallback((id: string) => {
    // simulação: vagas com selo alto retribuem o interesse imediatamente
    let deuMatch = false;
    setState((s) => {
      const vaga = s.jobs.find((j) => j.id === id);
      deuMatch = !!vaga && vaga.selo >= 90 && !s.matches.includes(id);
      return {
        ...s,
        curtidas: s.curtidas.includes(id) ? s.curtidas : [...s.curtidas, id],
        matches: deuMatch ? [...s.matches, id] : s.matches,
        mensagens: deuMatch
          ? {
              ...s.mensagens,
              [id]: [
                {
                  id: crypto.randomUUID(),
                  de: "outro",
                  texto: `Olá, Candidato ${s.perfil.codigo}! Match confirmado para a vaga. Podemos conversar sobre a próxima etapa?`,
                  hora: hora(),
                },
              ],
            }
          : s.mensagens,
      };
    });
    return deuMatch;
  }, []);

  const valor = useMemo<Store>(
    () => ({
      ...state,
      candidatos: CANDIDATOS,
      entrar: (role, nome) =>
        setState((s) => ({
          ...s,
          session: { role, nome },
          visualizacoes: role === "candidato" ? s.visualizacoes + 3 : s.visualizacoes,
        })),
      sair: () => setState((s) => ({ ...s, session: null })),
      curtirVaga,
      passarVaga: (id) =>
        setState((s) => ({
          ...s,
          passadas: s.passadas.includes(id) ? s.passadas : [...s.passadas, id],
        })),
      publicarVaga: (job) => setState((s) => ({ ...s, jobs: [job, ...s.jobs] })),
      escolherPlano: (plano) => setState((s) => ({ ...s, plano })),
      atualizarPerfil: (p) => setState((s) => ({ ...s, perfil: { ...s.perfil, ...p } })),
      enviarMensagem: (jobId, texto) =>
        setState((s) => ({
          ...s,
          mensagens: {
            ...s.mensagens,
            [jobId]: [
              ...(s.mensagens[jobId] ?? []),
              { id: crypto.randomUUID(), de: "eu", texto, hora: hora() },
            ],
          },
        })),
    }),
    [state, curtirVaga],
  );

  return <StoreContext.Provider value={valor}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}
