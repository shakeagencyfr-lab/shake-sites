"use client";
import { useState, useRef } from "react";
import { renderSite } from "@/lib/renderSite";
import "./globals.css";

const STEPS = [
  "Connexion à votre fiche Google Business",
  "Import : horaires, coordonnées, photos",
  "Analyse de vos avis clients",
  "Enrichissement par l'IA pour le référencement local",
  "Optimisation pour Google & les IA (ChatGPT, Perplexity)",
  "Rédaction de votre premier article de blog",
  "Construction du site mobile"
];

export default function Home() {
  const [query, setQuery] = useState("Comptoir Sauvage, Marseille");
  const [phase, setPhase] = useState("input"); // input | loading | result
  const [active, setActive] = useState(-1);
  const [data, setData] = useState(null);
  const [device, setDevice] = useState("mobile");
  const [showSeo, setShowSeo] = useState(false);
  const [pubLabel, setPubLabel] = useState("Publier le site");
  const fetchedRef = useRef(null);

  async function generate() {
    setPhase("loading"); setActive(0); setShowSeo(false); fetchedRef.current = null;
    // lance le fetch réel en parallèle de l'animation
    fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) })
      .then(r => r.json()).then(d => { fetchedRef.current = d; }).catch(() => { fetchedRef.current = "error"; });

    for (let i = 0; i < STEPS.length; i++) {
      setActive(i);
      await new Promise(r => setTimeout(r, i === 3 ? 700 : 480));
    }
    // attendre la fin du fetch si besoin
    while (fetchedRef.current === null) await new Promise(r => setTimeout(r, 200));
    const d = fetchedRef.current === "error" ? null : fetchedRef.current;
    if (d) { setData(d); setPhase("result"); window.scrollTo({ top: 0 }); }
    else { setPhase("input"); alert("La génération a échoué. Réessayez."); }
  }

  const html = data ? renderSite(data) : "";

  return (
    <div className="glow">
      <div className="wrap">
        <header className="topbar">
          <div className="logo"><span className="mark">✦</span> Shake <small>Sites</small></div>
          <a className="navlink" href="/dashboard">Dashboard client →</a>
        </header>

        {phase !== "result" && (
          <section className="hero">
            <div className="eyebrow">Site web + SEO + IA + blog auto</div>
            <h1 className="big">Le site de votre établissement, généré depuis <em>Google</em>.</h1>
            <p className="sub">Collez le lien de votre fiche Google. En moins d'une minute : un site optimisé pour le référencement et les moteurs IA, vos avis synchronisés, et un blog qui se publie tout seul.</p>
            <div className="composer">
              <div className="field">
                <span className="gi" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 13.5a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6"/><path d="M12 22s7-5.6 7-11.5A7 7 0 005 10.5C5 16.4 12 22 12 22z" stroke="currentColor" strokeWidth="1.6"/></svg>
                </span>
                <input className="url" value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && generate()} placeholder="Lien Google Maps ou nom de l'établissement…" />
                <button className="btn primary" onClick={generate}>Générer mon site</button>
              </div>
              <div className="presets">
                <button className="chip" onClick={() => { setQuery("Comptoir Sauvage, Marseille"); generate(); }}>Démo : <b>Comptoir Sauvage</b> — Marseille</button>
              </div>
            </div>
            <div className="feats"><span>Optimisé SEO + IA</span><span>Avis Google synchronisés</span><span>Blog automatique</span><span>100% mobile</span></div>
          </section>
        )}

        {phase === "result" && data && (
          <section style={{ paddingTop: 18 }}>
            <div className="res-head">
              <div className="eyebrow">Site généré{data.demo ? " · mode démo" : ""}</div>
              <h2>{data.business.name}</h2>
              <p>{data.business.category} · {data.reviews.length} avis synchronisés · 1 article publié</p>
            </div>
            <div className="toolbar">
              <div className="seg">
                <button className={device === "mobile" ? "sel" : ""} onClick={() => setDevice("mobile")}>Mobile</button>
                <button className={device === "desktop" ? "sel" : ""} onClick={() => setDevice("desktop")}>Desktop</button>
              </div>
              <button className="btn ghost" onClick={() => setShowSeo(s => !s)}>SEO &amp; schema</button>
              <button className="btn ghost" onClick={() => { setPhase("input"); setData(null); }}>Nouveau</button>
              <button className="btn gold" onClick={() => { setPubLabel("✓ Déploiement…"); setTimeout(() => setPubLabel("Publier le site"), 1800); }}>{pubLabel}</button>
            </div>

            <div className="stage">
              {device === "mobile" ? (
                <div className="device mobile"><iframe title="Aperçu mobile" srcDoc={html} /></div>
              ) : (
                <div className="device desktop">
                  <div className="bar"><i></i><i></i><i></i><span className="addr">{data.agency.domain}</span></div>
                  <iframe title="Aperçu desktop" srcDoc={html} />
                </div>
              )}
            </div>

            {showSeo && (
              <div style={{ maxWidth: 1040, margin: "24px auto 0", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "15px 20px", borderBottom: "1px solid var(--line)", fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 14 }}>Optimisation injectée automatiquement</div>
                <div style={{ padding: 20, display: "grid", gap: 14 }}>
                  <div><div className="mono" style={{ fontFamily: "Space Mono", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>Title</div><div>{data.ai.seoTitle}</div></div>
                  <div><div style={{ fontFamily: "Space Mono", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>Meta description</div><div style={{ color: "var(--mut)" }}>{data.ai.seoDescription}</div></div>
                  <div><div style={{ fontFamily: "Space Mono", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>Mots-clés locaux (IA)</div><div style={{ color: "var(--teal)" }}>{(data.ai.keywords || []).join(" · ")}</div></div>
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="foot">
          Le site généré est un document HTML complet (meta, Open Graph, JSON-LD). Source : <a href="#">SerpApi</a> / Places API · enrichissement <a href="#">API Anthropic</a>.
        </footer>
      </div>

      {phase === "loading" && (
        <div className="overlay">
          <div className="loadcard">
            <h3><span className="mark">✦</span> Génération en cours</h3>
            <div className="site-name">{query.toLowerCase()}</div>
            <ul className="steps">
              {STEPS.map((s, i) => (
                <li key={i} className={"step " + (i < active ? "done" : i === active ? "active" : "")}>
                  <span className="ico"><span className="ring"></span>
                    <svg className="check" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span className="lbl">{s}</span>
                </li>
              ))}
            </ul>
            <div className="progress"><i style={{ width: ((active + 1) / STEPS.length * 100) + "%" }}></i></div>
          </div>
        </div>
      )}
    </div>
  );
}
