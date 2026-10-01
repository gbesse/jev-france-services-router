// Objectif : vérifier que les types publics sont importables.
import { serviceRequest, routeFranceServices } from "../src/index.mjs";
const dossier = serviceRequest({
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
});
void routeFranceServices(dossier, { decide: async () => ({}) });
