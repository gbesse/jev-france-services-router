// Objectif : montrer qu’une décision incertaine est explicitement envoyée en revue humaine.
import assert from "node:assert/strict";
import { routeFranceServices } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
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
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "multi_partner", probabilities: {
  "interior": 0.08,
  "justice": 0.08,
  "taxes": 0.08,
  "social": 0.08,
  "employment": 0.08,
  "multi_partner": 0.52,
  "no_handoff": 0.08
}, confidence: 0.62 } }, usage: { input_tokens: 140, output_tokens: 0 } }));
const résultat = await routeFranceServices(dossier, provider);
assert.equal(résultat.decision, "multi_partner");
assert.equal(résultat.review, true);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · revue humaine : ${résultat.review} · confiance : ${résultat.confidence}`);
