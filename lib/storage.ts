import { Redis } from '@upstash/redis';

export type Pronostic = {
  nom: string;
  prenom: string;
  bu: string;
  montant: number;
  envoyeLe: string; // ISO 8601
};

const CLE = 'octobre-rose:pronostics';

type Stockage = Pick<Redis, 'hsetnx' | 'hgetall'>;

let client: Stockage | null = null;

// En local (npm run dev) sans base configurée, les réponses restent en mémoire
// le temps que le serveur tourne. En production, la base est obligatoire.
function stockageMemoire(): Stockage {
  // Sur globalThis : chaque route peut charger sa propre copie de ce module en dev.
  const g = globalThis as { __pronostics?: Map<string, unknown> };
  const donnees = (g.__pronostics ??= new Map<string, unknown>());
  return {
    hsetnx: async (_cle: string, champ: string, valeur: unknown) => {
      if (donnees.has(champ)) return 0;
      donnees.set(champ, valeur);
      return 1;
    },
    hgetall: async () => Object.fromEntries(donnees),
  } as unknown as Stockage;
}

function redis(): Stockage {
  if (client) return client;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Mode test : aucune base configurée, les pronostics sont gardés en mémoire.');
      client = stockageMemoire();
      return client;
    }
    throw new Error('Base de données non configurée (variables KV_REST_API_URL / KV_REST_API_TOKEN manquantes).');
  }
  client = new Redis({ url, token });
  return client;
}

// "Élodie  Martin" et "elodie martin" désignent la même personne.
function identifiant(nom: string, prenom: string): string {
  const normaliser = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  return `${normaliser(nom)}|${normaliser(prenom)}`;
}

/** Enregistre le pronostic, sauf si cette personne en a déjà envoyé un. */
export async function ajouterPronostic(p: Pronostic): Promise<'ok' | 'doublon'> {
  const ajoute = await redis().hsetnx(CLE, identifiant(p.nom, p.prenom), p);
  return ajoute === 1 ? 'ok' : 'doublon';
}

export async function listerPronostics(): Promise<Pronostic[]> {
  const tous = await redis().hgetall<Record<string, Pronostic>>(CLE);
  return Object.values(tous ?? {}).sort((a, b) => a.envoyeLe.localeCompare(b.envoyeLe));
}
