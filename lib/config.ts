// Textes, dates et listes du jeu.
export const jeu = {
  entreprise: 'Juste à temps',
  // Fichier du logo à déposer dans le dossier public/
  logo: '/logo-juste-a-temps.png',
  association: 'l’association Ruban Rose',
  lot: 'un beau cadeau',
  // Date limite des réponses, heure de Paris. null = pas de clôture automatique.
  clotureLe: '2026-10-10T23:59:59+02:00' as string | null,
  annonceCourte: '02/11',
  annonceLongue: '2 novembre',
};

export function estCloture(maintenant = new Date()): boolean {
  return jeu.clotureLe !== null && maintenant > new Date(jeu.clotureLe);
}

export function dateClotureCourte(): string {
  if (jeu.clotureLe === null) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Paris',
  }).format(new Date(jeu.clotureLe));
}
