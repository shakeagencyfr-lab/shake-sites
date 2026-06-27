// lib/anthropic.js — enrichissement éditorial via l'API Anthropic (Messages)
// On ancre la génération dans les VRAIES données (nom, catégorie, ville, thèmes
// des avis réels) pour produire un contenu spécifique et utile — pas du remplissage
// générique, ce qui est précisément ce que Google pénalise (scaled content abuse).

const API = "https://api.anthropic.com/v1/messages";

function buildPrompt(b, reviews) {
  const reviewThemes = reviews.slice(0, 8).map(r => `- (${r.rating}★) ${r.text}`).join("\n");
  return `Tu es rédacteur SEO local pour des sites de commerces de proximité.
À partir des données réelles ci-dessous, produis un contenu spécifique, chaleureux et crédible — jamais générique.

ÉTABLISSEMENT
Nom : ${b.name}
Catégorie : ${b.category}
Ville / quartier : ${b.city}${b.neighborhood ? " (" + b.neighborhood + ")" : ""}
Note Google : ${b.rating}/5 sur ${b.reviewCount} avis

EXTRAITS D'AVIS CLIENTS RÉELS (sers-t'en pour capter le ton et les points forts cités) :
${reviewThemes || "(aucun avis)"}

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte autour, pas de balises markdown) :
{
  "tagline": "accroche courte et évocatrice (max 8 mots)",
  "about": "2-3 phrases décrivant le lieu, ancrées dans la réalité, sans superlatifs creux",
  "seoTitle": "titre SEO < 60 caractères incluant catégorie + ville",
  "seoDescription": "meta description 150-160 caractères, incitative, avec la note Google",
  "keywords": ["5 expressions de recherche locale réalistes"],
  "highlights": [{"t":"titre court","d":"1 phrase"}, ...3 éléments concrets...],
  "faq": [{"q":"question fréquente","a":"réponse utile"}, ...3 questions...],
  "blog": {
    "title": "titre d'article de blog local et utile, pas commercial",
    "excerpt": "2 phrases d'accroche",
    "tag": "catégorie courte",
    "body": "article de 250-350 mots, ancré localement, avec un vrai angle (E-E-A-T)"
  }
}`;
}

export async function enrich(b, reviews, apiKey, model = "claude-sonnet-4-6") {
  const r = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      messages: [{ role: "user", content: buildPrompt(b, reviews) }]
    })
  });
  if (!r.ok) throw new Error("Anthropic " + r.status + " " + (await r.text()).slice(0, 200));
  const data = await r.json();
  const text = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  return JSON.parse(clean.slice(start, end + 1));
}
