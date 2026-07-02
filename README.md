# Shake Sites

Micro-SaaS : génère un site web local optimisé SEO + IA depuis une fiche Google Business.
Pipeline **SerpApi → API Anthropic**, avis Google synchronisés, blog auto-publié, dashboard client.

## Stack
- Next.js 14 (App Router) · React 18
- API route serverless `/api/generate` (les clés restent côté serveur)
- Aucune dépendance lourde : appels SerpApi & Anthropic en `fetch` natif

## Déploiement (GitHub → Vercel)
1. Pousse ce dossier sur un repo GitHub (upload web ou drag & drop).
2. Sur Vercel : **New Project → Import** le repo. Framework détecté : Next.js. Deploy.
3. Dans **Settings → Environment Variables**, ajoute :
   | Clé | Valeur |
   |-----|--------|
   | `SERPAPI_KEY` | ta clé serpapi.com |
   | `ANTHROPIC_API_KEY` | ta clé console.anthropic.com |
   | `ANTHROPIC_MODEL` | `claude-sonnet-5` (optionnel) |
4. Redeploy.

> Sans clés, l'app tourne en **mode démo** (données Comptoir Sauvage) — pratique pour montrer le concept avant de brancher les API.

## Comment ça marche
`app/api/generate/route.js` :
1. `resolveQuery` — résout un lien Google Maps (suit la redirection) ou un nom.
2. `fetchPlace` / `fetchReviews` (SerpApi) — fiche + avis.
3. `enrich` (Anthropic) — about, SEO, FAQ, 1er article, **ancrés dans les vrais avis** (anti scaled-content-abuse).
4. Retourne un objet `siteData` que `lib/renderSite.js` transforme en document HTML complet.

## Pages
- `/` — générateur (flux client : lien → site)
- `/dashboard` — console client PME (vue d'ensemble, mon site, journal, avis, SEO)

## Couche données interchangeable
Tout passe par `lib/serpapi.js`. Pour basculer sur la **Places API officielle de Google**
(recommandé vu le litige Google × SerpApi en cours), réécris ces fonctions en gardant
le même format de sortie — le reste du produit ne bouge pas.

## Prochaines étapes
- Persistance Supabase (sites, articles, avis) + multi-tenant agences (white-label)
- Cron Vercel hebdo pour le blog auto
- Auth + facturation Stripe Connect (modèle revendeur)
- Publication du site sur domaine custom (API domaines Vercel)
