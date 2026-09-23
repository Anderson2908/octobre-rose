import { dateClotureCourte, estCloture, jeu } from '@/lib/config';
import { FormulairePronostic } from './FormulairePronostic';
import { RubanFond } from './Ruban';

// Recalcule la page chaque minute pour que la clôture s'applique d'elle-même.
export const revalidate = 60;

export default function Accueil() {
  return (
    <div className="page">
      <div className="deco deco-plein" aria-hidden="true" />
      <div className="deco deco-contour" aria-hidden="true" />
      <RubanFond className="deco deco-ruban" />

      <header className="entete">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logo" src={jeu.logo} alt={jeu.entreprise} width={472} height={157} />
        <span className="badge">Jeu interne · Octobre 2026</span>
      </header>

      <main className="contenu">
        <section className="intro">
          <p className="surtitre">Octobre Rose · Le grand pronostic</p>
          <h1>Combien allons-nous récolter <em>ensemble</em>&nbsp;?</h1>
          <p className="texte">
            Tout le mois, nous nous mobilisons contre le cancer du sein. 1&nbsp;€ reversé pour chaque
            commande à 1&nbsp;€ près. Devinez le montant total qui sera reversé à {jeu.association}&nbsp;:
            le pronostic le plus proche remporte {jeu.lot}&nbsp;!
          </p>
          <dl className="reperes">
            <div><dt>1</dt><dd>pronostic<br />par personne</dd></div>
            <div><dt>{dateClotureCourte()}</dt><dd>clôture<br />des réponses</dd></div>
            <div><dt>{jeu.annonceCourte}</dt><dd>annonce<br />du résultat</dd></div>
          </dl>
        </section>

        <section className="carte">
          <FormulairePronostic cloture={estCloture()} annonce={jeu.annonceLongue} />
        </section>
      </main>
    </div>
  );
}
