'use client';

import { useState } from 'react';

type Etat = 'saisie' | 'envoi' | 'envoye';

const formatEuros = new Intl.NumberFormat('fr-FR');

type Props = { cloture: boolean; annonce: string };

export function FormulairePronostic({ cloture, annonce }: Props) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [bu, setBu] = useState('');
  const [chiffres, setChiffres] = useState(''); // montant, chiffres uniquement
  const [etat, setEtat] = useState<Etat>('saisie');
  const [erreur, setErreur] = useState<string | null>(null);

  function recommencer() {
    setNom('');
    setPrenom('');
    setBu('');
    setChiffres('');
    setErreur(null);
    setEtat('saisie');
  }

  if (cloture) {
    return (
      <div className="confirmation">
        <h2>Le jeu est clôturé</h2>
        <p>Merci à toutes et à tous&nbsp;! Rendez-vous le {annonce} pour découvrir le montant récolté et le gagnant.</p>
      </div>
    );
  }

  if (etat === 'envoye') {
    return (
      <div className="confirmation" role="status">
        <div className="pastille" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h2>Merci, c’est envoyé&nbsp;!</h2>
        <p>
          Votre pronostic est bien enregistré.<br />
          Rendez-vous le {annonce} pour découvrir<br />
          le montant récolté et le gagnant.
        </p>
        <button type="button" className="bouton-secondaire" onClick={recommencer}>
          Revenir au formulaire
        </button>
      </div>
    );
  }

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const montant = Number(chiffres);
    if (!chiffres || montant < 1) {
      setErreur('Merci d’indiquer un montant en euros.');
      return;
    }
    setEtat('envoi');
    try {
      const reponse = await fetch('/api/pronostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, bu, montant }),
      });
      if (reponse.ok) {
        setEtat('envoye');
        return;
      }
      const corps = await reponse.json().catch(() => null);
      setErreur(corps?.erreur ?? 'Une erreur est survenue, merci de réessayer.');
    } catch {
      setErreur('Connexion impossible, merci de réessayer.');
    }
    setEtat('saisie');
  }

  return (
    <form className="formulaire" onSubmit={envoyer}>
      <div>
        <h2>Mon pronostic</h2>
        <p className="mention">Tous les champs sont obligatoires.</p>
      </div>

      <div className="ligne-2">
        <label className="champ">
          Nom
          <input type="text" name="nom" autoComplete="family-name" placeholder="Chapalin" required
            maxLength={60} value={nom} onChange={(e) => setNom(e.target.value)} />
        </label>
        <label className="champ">
          Prénom
          <input type="text" name="prenom" autoComplete="given-name" placeholder="Martin" required
            maxLength={60} value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        </label>
      </div>

      <label className="champ">
        BU (Business Unit)
        <input type="text" name="bu" autoComplete="organization-title" placeholder="Votre BU" required
          maxLength={60} value={bu} onChange={(e) => setBu(e.target.value)} />
      </label>

      <label className="champ">
        Montant récolté selon vous
        <span className="montant">
          <input type="text" name="montant" inputMode="numeric" placeholder="12 500" required
            aria-describedby="aide-montant"
            value={chiffres ? formatEuros.format(Number(chiffres)) : ''}
            onChange={(e) => setChiffres(e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 9))} />
          <span className="euro" aria-hidden="true">€</span>
        </span>
        <span id="aide-montant" className="aide">Montant total en euros, sans centimes.</span>
      </label>

      {erreur && <p className="erreur" role="alert">{erreur}</p>}

      <button type="submit" className="cta" disabled={etat === 'envoi'}>
        {etat === 'envoi' ? 'Envoi en cours…' : 'Envoyer mon pronostic'}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
