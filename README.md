# Octobre Rose — Le grand pronostic

Page du jeu interne Juste à temps : chaque salarié envoie son pronostic (nom, prénom, BU, montant en €).
Les réponses sont exportées en Excel depuis la page `/admin`.

- Next.js 15 (App Router), TypeScript
- Stockage : Upstash Redis (gratuit, via Vercel)
- Export Excel : `exceljs`
- 1 pronostic par personne (même nom + prénom, sans tenir compte des accents ni des majuscules)
- Clôture automatique à la date réglée dans `lib/config.ts` (10/10 à 23 h 59)

## Mise en ligne sur Vercel (rien à installer sur le PC)

1. Créer un dépôt sur **github.com** (bouton **New**) puis **Add file → Upload files** et glisser
   tout le contenu de ce dossier (sauf `node_modules` et `.next` s'ils existent).
2. Sur **vercel.com** : **Add New → Project** → importer le dépôt → **Deploy**.
3. Dans le projet Vercel : **Storage → Create Database → Upstash (Redis)** → le relier au projet.
   Les variables `KV_REST_API_URL` et `KV_REST_API_TOKEN` sont ajoutées automatiquement.
4. **Settings → Environment Variables** : ajouter `ADMIN_PASSWORD` (mot de passe de la page admin).
5. **Deployments → ⋯ → Redeploy** pour prendre en compte les variables.

## Récupérer les réponses

Ouvrir `https://<votre-site>.vercel.app/admin`, saisir le mot de passe → **Télécharger en Excel**.
Le fichier contient : date d'envoi, nom, prénom, BU, pronostic (€), avec filtres.
