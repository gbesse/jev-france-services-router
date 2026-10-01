// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { routeFranceServices } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
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
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "taxes", probabilities: {
  "interior": 0.03,
  "justice": 0.03,
  "taxes": 0.82,
  "social": 0.03,
  "employment": 0.03,
  "multi_partner": 0.03,
  "no_handoff": 0.03
}, confidence: 0.82 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await routeFranceServices(dossier, provider);
assert.equal(résultat.decision, "taxes");
assert.equal(résultat.review, false);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
