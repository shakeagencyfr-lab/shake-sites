# Shake — Site vitrine

Nouveau site vitrine de **Shake**, la plateforme de visibilité locale propulsée par l'IA
(avis Google, SEO local, moteurs IA / GEO, réseaux sociaux, agent conversationnel).

Projet **indépendant** du produit `shake-sites` : une single-page ultra-moderne, orientée
motion design, avec scroll vertical **et** horizontal, zooms automatiques et animations variées.

## Stack

- **Vite** (build statique, déployable partout : Vercel, Netlify, S3…)
- **GSAP + ScrollTrigger** — timelines, pinning, scroll horizontal, zooms au scroll, compteurs
- **Lenis** — smooth scroll, marquees réactifs à la vélocité
- Zéro framework UI : HTML sémantique + CSS custom (tokens de marque violet → teal + or)

## Démarrer

```bash
cd agency-site
npm install
npm run dev        # http://localhost:5173
npm run build      # génère dist/
npm run preview    # sert le build
```

## Ce qu'il contient

| Section | Animation |
|--------|-----------|
| Preloader | compteur 0→100, lettres, rideau |
| Hero | reveal du titre + **zoom automatique** au scroll, orbes parallax |
| Marquee moteurs | boucle infinie **réactive à la vélocité** du scroll |
| Manifeste | révélation **mot par mot** au scroll |
| Agents IA | **scroll horizontal épinglé** (SEO · Social · GEO) + zoom des visuels |
| La plateforme | **téléphone épinglé**, écrans qui défilent, zoom progressif |
| Réputation / Avis | reveals, interception d'avis, compteurs animés |
| Stats | compteurs animés |
| Verticaux | marquee de secteurs |
| Tarifs | carte magnétique 19€/mois |
| CTA final | titre révélé mot à mot |

Plus : curseur personnalisé, boutons magnétiques, barre de progression, nav auto-masquée,
`prefers-reduced-motion` respecté, responsive complet.

## Contenu

Copy et structure basés sur l'offre réelle de Shake (shakeagency.io) : essai gratuit 30 jours,
dès 19€/mois sans engagement, pour restaurants, artisans, santé, immobilier, salons, garages…

> Les polices (Space Grotesk / Hanken Grotesk / Space Mono) sont chargées depuis Google Fonts.
> Pour un hébergement 100% autonome, self-hoster les `.woff2`.
