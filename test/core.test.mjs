// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { serviceRequest, routeFranceServices } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-27"
  },
  "resolved": true
};
const casPrincipal = {
  "id": "exemple-1",
  "text": "Je souhaite corriger mon adresse sur ma déclaration de revenus et comprendre un avis reçu cette semaine.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-09-25"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
};
const casÀRevoir = {
  "id": "revue-1",
  "text": "Après un décès, la famille doit signaler la situation, vérifier la retraite et mettre à jour plusieurs dossiers.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-26"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
test("exige une source", () => assert.throws(() => serviceRequest({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await routeFranceServices(casLimite, provider)).decision, "no_handoff");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "taxes", probabilities: {
  "interior": 0.03,
  "justice": 0.03,
  "taxes": 0.82,
  "social": 0.03,
  "employment": 0.03,
  "multi_partner": 0.03,
  "no_handoff": 0.03
}, confidence: 0.82 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await routeFranceServices(casPrincipal, provider);
  assert.equal(résultat.decision, "taxes");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "multi_partner", probabilities: {
  "interior": 0.08,
  "justice": 0.08,
  "taxes": 0.08,
  "social": 0.08,
  "employment": 0.08,
  "multi_partner": 0.52,
  "no_handoff": 0.08
}, confidence: 0.62 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await routeFranceServices(casÀRevoir, provider);
  assert.equal(résultat.decision, "multi_partner");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
