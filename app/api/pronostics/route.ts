import { estCloture } from '@/lib/config';
import { ajouterPronostic } from '@/lib/storage';

export const runtime = 'nodejs';

const MONTANT_MAX = 100_000_000;

function erreur(message: string, status: number) {
  return Response.json({ erreur: message }, { status });
}

function texte(valeur: unknown): string {
  return typeof valeur === 'string' ? valeur.replace(/\s+/g, ' ').trim() : '';
}

export async function POST(req: Request) {
  if (estCloture()) return erreur('Le jeu est clôturé, les pronostics ne sont plus acceptés.', 403);

  let corps: unknown;
  try {
    corps = await req.json();
  } catch {
    return erreur('Requête invalide.', 400);
  }
  const champs = (corps ?? {}) as Record<string, unknown>;
  const nom = texte(champs.nom);
  const prenom = texte(champs.prenom);
  const bu = texte(champs.bu);
  const montant = champs.montant;

  if (!nom || nom.length > 60) return erreur('Merci de renseigner votre nom.', 400);
  if (!prenom || prenom.length > 60) return erreur('Merci de renseigner votre prénom.', 400);
  if (!bu || bu.length > 60) return erreur('Merci de renseigner votre BU.', 400);
  if (typeof montant !== 'number' || !Number.isInteger(montant) || montant < 1 || montant > MONTANT_MAX) {
    return erreur('Merci d’indiquer un montant en euros, sans centimes.', 400);
  }

  try {
    const resultat = await ajouterPronostic({ nom, prenom, bu, montant, envoyeLe: new Date().toISOString() });
    if (resultat === 'doublon') {
      return erreur('Un pronostic a déjà été enregistré à ce nom (1 pronostic par personne).', 409);
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return erreur('Une erreur est survenue, merci de réessayer dans un instant.', 500);
  }
}
