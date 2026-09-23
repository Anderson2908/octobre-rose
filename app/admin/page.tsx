import { jeu } from '@/lib/config';

export const metadata = { title: 'Administration — Octobre Rose' };

export default async function Admin({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;

  return (
    <div className="page page-admin">
      {/* Hors de la carte blanche : le logo a un fond rose pâle identique à celui de la page. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo" src={jeu.logo} alt={jeu.entreprise} width={472} height={157} />
      <main className="carte carte-admin">
        <h1>Export des pronostics</h1>
        <p className="mention">Téléchargez toutes les réponses reçues au format Excel.</p>
        <form method="post" action="/api/export" className="formulaire">
          <label className="champ">
            Mot de passe administrateur
            <input type="password" name="motDePasse" autoComplete="current-password" required />
          </label>
          {erreur && <p className="erreur" role="alert">Mot de passe incorrect.</p>}
          <button type="submit" className="cta">Télécharger en Excel</button>
        </form>
      </main>
    </div>
  );
}
