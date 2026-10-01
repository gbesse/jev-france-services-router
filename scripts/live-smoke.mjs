// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { routeFranceServices } from "../src/index.mjs";
const client = createJevClient();
const résultat = await routeFranceServices({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
