import { describe, expect, test } from "bun:test";
import { CRITERIA, PLANS, ethicalScore, ethicalZone, isGreen, publicationError, trialRemaining, hasMutualInterest } from "./recruitment";

const all = CRITERIA.map((c) => c.id);
describe("planos definidos no documento", () => {
  test("teste dura 30 dias", () => {
    expect(trialRemaining("2026-11-01T00:00:00Z", new Date("2026-11-30T00:00:00Z"))).toBe(1);
    expect(publicationError("Período de Teste", 0, "2026-11-01T00:00:00Z", all, new Date("2026-12-01T00:00:00Z"))).not.toBeNull();
  });
  test("Básico custa 39,90 e permite 5 vagas ativas", () => {
    expect(PLANS[1].preco).toBe(39.9);
    expect(publicationError("Básico", 4, null, all)).toBeNull();
    expect(publicationError("Básico", 5, null, all)).not.toBeNull();
  });
  test("Premium custa 119,90 e não limita vagas", () => {
    expect(PLANS[2].preco).toBe(119.9);
    expect(publicationError("Premium", 10000, null, all)).toBeNull();
  });
});
describe("publicação ética", () => {
  test("zona não verde bloqueia publicação", () => {
    expect(ethicalZone([])).toBe("red");
    expect(ethicalZone(all.slice(0, 5))).toBe("yellow");
    expect(publicationError("Premium", 0, null, [])).not.toBeNull();
    expect(ethicalScore(all)).toBe(100);
    expect(publicationError("Premium", 0, null, all)).toBeNull();
  });
  test("triagem às cegas e LGPD são obrigatórias mesmo com pontuação alta", () => {
    expect(isGreen(all.filter((id) => id !== "cegas"))).toBe(false);
    expect(isGreen(all.filter((id) => id !== "lgpd"))).toBe(false);
  });
  test("chat depende do interesse dos dois lados, nunca da nota ética", () => {
    expect(hasMutualInterest("v1", ["v1"], [])).toBe(false);
    expect(hasMutualInterest("v1", [], ["v1"])).toBe(false);
    expect(hasMutualInterest("v1", ["v1"], ["v1"])).toBe(true);
    expect(hasMutualInterest("v2", ["v1"], ["v1"])).toBe(false);
  });
});