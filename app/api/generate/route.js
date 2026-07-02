// app/api/generate/route.js
// Pipeline : lien/nom → SerpApi (fiche + avis) → Anthropic (enrichissement) → siteData
// Tourne côté serveur (les clés restent secrètes). Sans clés, renvoie la démo.

import { resolveQuery, fetchPlace, fetchReviews, normalizeHours } from "@/lib/serpapi";
import { enrich } from "@/lib/anthropic";
import { sampleData } from "@/lib/sampleData";

export const runtime = "nodejs";
export const maxDuration = 60;

const ACCENTS = {
  vin: "#7A2638", bar: "#7A2638", restaurant: "#9c3b2e", café: "#6b4a2e", coffee: "#6b4a2e",
  coiffeur: "#5b3a7a", beauté: "#a35a7a", spa: "#3f7d72", massage: "#3f7d72",
  fitness: "#2f6d8e", sport: "#2f6d8e", clinique: "#2e6d6d", dentiste: "#2e6d6d",
  immobilier: "#3a5a8e", boulangerie: "#b07b3f", default: "#7A2638"
};
function pickAccent(category = "") {
  const c = category.toLowerCase();
  for (const k of Object.keys(ACCENTS)) if (c.includes(k)) return ACCENTS[k];
  return ACCENTS.default;
}

export async function POST(req) {
  const { query } = await req.json().catch(() => ({}));
  const SERP = process.env.SERPAPI_KEY;
  const ANTH = process.env.ANTHROPIC_API_KEY;
  const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  // Pas de clés → démo, pour que le déploiement marche tout de suite
  if (!SERP || !ANTH) {
    return Response.json({ ...sampleData, note: "Mode démo — ajoutez SERPAPI_KEY et ANTHROPIC_API_KEY dans Vercel." });
  }

  try {
    const q = await resolveQuery(query || "");
    const place = await fetchPlace(q, SERP);

    const category = Array.isArray(place.type) ? place.type[0] : (place.type || place.category || "Établissement");
    const dataId = place.data_id;
    const reviews = await fetchReviews(dataId, SERP, 8);

    const business = {
      placeId: place.place_id || dataId || "",
      name: place.title || q,
      category,
      cuisine: Array.isArray(place.type) ? place.type.join(" · ") : category,
      tagline: "",
      rating: place.rating || 4.8,
      reviewCount: place.reviews || place.user_reviews?.total || reviews.length,
      priceLevel: place.price || "€€",
      phone: place.phone || "",
      address: (place.address || "").split(",")[0] || "",
      postal: ((place.address || "").match(/\b\d{5}\b/) || [""])[0],
      city: place.address?.split(",").slice(-1)[0]?.trim().replace(/\b\d{5}\b/, "").trim() || "",
      neighborhood: place.neighborhood || "",
      website: place.website || "",
      accent: pickAccent(category),
      hours: normalizeHours(place.hours)
    };

    const ai = await enrich(business, reviews, ANTH, MODEL);
    business.tagline = ai.tagline || business.name;

    const blog = ai.blog ? [{
      title: ai.blog.title, excerpt: ai.blog.excerpt, body: ai.blog.body,
      tag: ai.blog.tag, date: "Cette semaine", read: "4 min", hue: business.accent
    }] : sampleData.blog;

    const siteData = {
      demo: false,
      agency: { id: "shake", name: "Shake Agency", brandColor: "#7c3aed", domain: (business.website || business.name.toLowerCase().replace(/\s+/g, "-") + ".fr") },
      business,
      ai: {
        seoTitle: ai.seoTitle, seoDescription: ai.seoDescription, keywords: ai.keywords || [],
        about: ai.about, highlights: ai.highlights || [], faq: ai.faq || []
      },
      reviews: reviews.length ? reviews : sampleData.reviews,
      blog
    };

    return Response.json(siteData);
  } catch (err) {
    return Response.json(
      { ...sampleData, error: String(err.message || err), note: "Échec du pipeline — démo affichée." },
      { status: 200 }
    );
  }
}
