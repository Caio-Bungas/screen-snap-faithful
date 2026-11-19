export const TRIAL_DAYS = 30;
export const PLANS = [
  { nome: "Período de Teste", preco: 0, limite: Infinity, itens: ["30 dias gratuitos", "Perfis anônimos e match mútuo", "Etitômetro por vaga"] },
  { nome: "Básico", preco: 39.9, limite: 5, itens: ["Até 5 vagas ativas por mês", "Perfis anônimos e chat", "Etitômetro por vaga"] },
  { nome: "Premium", preco: 119.9, limite: Infinity, itens: ["Vagas ilimitadas", "Métricas avançadas de diversidade", "Perfis anônimos e chat"] },
] as const;
export type PlanName = (typeof PLANS)[number]["nome"];
export const CRITERIA = [
  { id: "cegas", peso: 15, texto: "Triagem às cegas, sem nome, foto, idade, gênero ou localização.", referencia: "ODS 10", correcao: "Remova critérios pessoais e use apenas competências na triagem." },
  { id: "salario", peso: 10, texto: "Faixa salarial transparente e condições de trabalho dignas.", referencia: "ODS 8", correcao: "Informe a faixa salarial e as condições de contratação." },
  { id: "feedback", peso: 10, texto: "Critérios objetivos e retorno às pessoas candidatas.", referencia: "Processo justo", correcao: "Defina os critérios de avaliação e um prazo de retorno." },
  { id: "acessibilidade", peso: 10, texto: "Etapas acessíveis e adaptações para pessoas com deficiência.", referencia: "ODS 10", correcao: "Garanta etapas acessíveis e adaptações razoáveis." },
  { id: "saude", peso: 15, texto: "Gestão de riscos e acompanhamento da saúde ocupacional.", referencia: "NR-1 e NR-7", correcao: "Confirme as medidas de prevenção de riscos e saúde ocupacional." },
  { id: "ergonomia", peso: 10, texto: "Condições ergonômicas adequadas ao posto de trabalho.", referencia: "NR-17", correcao: "Revise as condições ergonômicas do trabalho." },
  { id: "diversidade", peso: 10, texto: "Igualdade de oportunidades e linguagem não discriminatória.", referencia: "ODS 8 e 10", correcao: "Retire linguagem discriminatória e restrições sem relação com a função." },
  { id: "lgpd", peso: 20, texto: "Coleta mínima de dados, finalidade clara e consentimento.", referencia: "LGPD", correcao: "Defina finalidade, consentimento e proteção dos dados pessoais." },
] as const;
export type EthicalAnswer = (typeof CRITERIA)[number]["id"];
export const GREEN_SCORE = 85;
export function ethicalScore(answers: readonly string[]) {
  return CRITERIA.filter((c) => answers.includes(c.id)).reduce((sum, c) => sum + c.peso, 0);
}
export function isGreen(answers: readonly string[]) {
  return ethicalScore(answers) >= GREEN_SCORE && answers.includes("lgpd") && answers.includes("cegas");
}
export function ethicalZone(answers: readonly string[]) {
  return isGreen(answers) ? "green" : ethicalScore(answers) >= 50 ? "yellow" : "red";
}
export function trialRemaining(start: string | null, now = new Date()) {
  if (!start) return TRIAL_DAYS;
  return Math.max(0, TRIAL_DAYS - Math.floor((now.getTime() - new Date(start).getTime()) / 86400000));
}
export function publicationError(plan: PlanName, active: number, start: string | null, answers: readonly string[], now = new Date()) {
  if (!isGreen(answers)) return "Publicação bloqueada: alcance a zona verde e confirme triagem às cegas e LGPD.";
  if (plan === "Período de Teste" && trialRemaining(start, now) === 0) return "Os 30 dias de teste terminaram. Escolha um plano para publicar.";
  if (plan === "Básico" && active >= 5) return "O plano Básico permite até 5 vagas ativas. Encerre uma vaga ou escolha Premium.";
  return null;
}
export function hasMutualInterest(job: string, candidate: readonly string[], company: readonly string[]) {
  return candidate.includes(job) && company.includes(job);
}
export function anonymousCompany(index: number) { return `Empresa #${String(index + 1001)}`; }