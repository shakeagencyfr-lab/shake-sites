// lib/serpapi.js — accès aux données Google via SerpApi
// Deux moteurs : google_maps (fiche établissement) + google_maps_reviews (avis)
// NB: source interchangeable — pour basculer sur la Places API officielle de Google,
// il suffit de réécrire ces deux fonctions en conservant le même format de sortie.

const SERP = "https://serpapi.com/search.json";

// Palette d'avatars pour les avis (Google ne fournit pas de couleur)
const AVATAR = ["#7A2638", "#CE6A33", "#79805C", "#5b6cb0", "#9a5ea0", "#3f8e7d", "#b07b3f", "#4f7d8e"];

// Un lien Maps partagé (maps.app.goo.gl/…) redirige vers l'URL longue qui
// contient le nom du lieu dans /place/<Nom>/. On suit la redirection pour
// récupérer une requête exploitable.
export async function resolveQuery(input) {
  const raw = (input || "").trim();
  if (!/^https?:\/\//i.test(raw)) return raw; // déjà un nom d'établissement

  try {
    const res = await fetch(raw, { redirect: "follow" });
    const finalUrl = res.url || raw;
    const m = finalUrl.match(/\/place\/([^/@]+)/);
    if (m) return decodeURIComponent(m[1].replace(/\+/g, " "));
    return raw;
  } catch {
    return raw;
  }
}

export async function fetchPlace(query, apiKey) {
  const url = `${SERP}?engine=google_maps&type=search&hl=fr&q=${encodeURIComponent(query)}&api_key=${apiKey}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("SerpApi google_maps " + r.status);
  const data = await r.json();
  const p = data.place_results || (data.local_results && data.local_results[0]);
  if (!p) throw new Error("Aucun établissement trouvé pour : " + query);
  return p;
}

export async function fetchReviews(dataId, apiKey, limit = 8) {
  if (!dataId) return [];
  const url = `${SERP}?engine=google_maps_reviews&data_id=${encodeURIComponent(dataId)}&hl=fr&api_key=${apiKey}`;
  const r = await fetch(url);
  if (!r.ok) return [];
  const data = await r.json();
  const rows = (data.reviews || []).slice(0, limit);
  return rows.map((rv, i) => ({
    author: rv.user?.name || "Client Google",
    rating: rv.rating || 5,
    time: rv.date || "",
    text: (rv.snippet || rv.extracted_snippet?.original || "").trim(),
    c: AVATAR[i % AVATAR.length]
  })).filter(rv => rv.text);
}

// Normalise les horaires SerpApi (format variable) vers notre map {0..6:[[a,b]]}
const DAY_IDX = { dimanche:0, lundi:1, mardi:2, mercredi:3, jeudi:4, vendredi:5, samedi:6,
                  sunday:0, monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6 };

export function normalizeHours(hours) {
  const out = { 0:null,1:null,2:null,3:null,4:null,5:null,6:null };
  if (!Array.isArray(hours)) return out;
  for (const entry of hours) {
    const day = Object.keys(entry)[0];
    const idx = DAY_IDX[(day || "").toLowerCase()];
    if (idx === undefined) continue;
    const val = String(entry[day] || "").toLowerCase();
    if (val.includes("fermé") || val.includes("closed")) { out[idx] = null; continue; }
    const ranges = [];
    const re = /(\d{1,2})\s*[:hH]?\s*(\d{2})?\s*[–\-—à]+\s*(\d{1,2})\s*[:hH]?\s*(\d{2})?/g;
    let m;
    while ((m = re.exec(val))) {
      const a = `${m[1].padStart(2,"0")}:${(m[2]||"00")}`;
      const b = `${m[3].padStart(2,"0")}:${(m[4]||"00")}`;
      ranges.push([a, b]);
    }
    out[idx] = ranges.length ? ranges : null;
  }
  return out;
}
