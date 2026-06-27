"use client";
import { useState } from "react";
import { sampleData } from "@/lib/sampleData";
import { renderSite } from "@/lib/renderSite";
import "../globals.css";

const NAV = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "site", label: "Mon site" },
  { id: "blog", label: "Journal" },
  { id: "reviews", label: "Avis Google" },
  { id: "seo", label: "Référencement" }
];

export default function Dashboard() {
  const d = sampleData;
  const [tab, setTab] = useState("overview");
  const [biz, setBiz] = useState({ name: d.business.name, tagline: d.business.tagline, phone: d.business.phone });
  const [gen, setGen] = useState(false);

  return (
    <div className="glow dash">
      <aside className="side">
        <div className="logo"><span className="mark">✦</span> Shake <small>Sites</small></div>
        {NAV.map(n => (
          <button key={n.id} className={"navitem" + (tab === n.id ? " on" : "")} onClick={() => setTab(n.id)}>
            <span className="ico">●</span>{n.label}
          </button>
        ))}
        <a className="navitem" href="/"><span className="ico">←</span>Générateur</a>
        <div className="biz">
          <div className="nm">{d.business.name}</div>
          <div className="st"><span className="d"></span>EN LIGNE</div>
        </div>
      </aside>

      <main className="main">
        {tab === "overview" && (
          <>
            <div className="dh"><div><h1>Bonjour 👋</h1><p>Voici comment votre site se porte cette semaine.</p></div>
              <a className="btn primary sm" href="/" target="_blank">Voir mon site ↗</a></div>
            <div className="kpis">
              <div className="kpi"><div className="lab">Visiteurs / 30j</div><div className="val">1 284</div><div className="delta">+18% vs mois dernier</div></div>
              <div className="kpi"><div className="lab">Note Google</div><div className="val">{String(d.business.rating).replace(".", ",")}<span className="u"> /5</span></div><div className="delta">{d.business.reviewCount} avis</div></div>
              <div className="kpi"><div className="lab">Mots-clés top 10</div><div className="val">7</div><div className="delta">+3 ce mois</div></div>
              <div className="kpi"><div className="lab">Articles publiés</div><div className="val">12</div><div className="delta">prochain : lundi</div></div>
            </div>
            <div className="grid2">
              <div className="card">
                <h3>Prochain article</h3>
                <div className="csub">Publié automatiquement chaque lundi — sans rien faire.</div>
                <div className="article" style={{ borderBottom: 0 }}>
                  <div className="thumb"></div>
                  <div style={{ flex: 1 }}><div className="at">Vins d'hiver : nos 6 bouteilles pour la saison</div><div className="am">Programmé · lundi 8h</div></div>
                  <span className="tag sched">Programmé</span>
                </div>
                <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={() => { setGen(true); setTimeout(() => setGen(false), 1600); }}>{gen ? "✓ Génération…" : "Générer un article maintenant"}</button>
              </div>
              <div className="card">
                <h3>Aperçu</h3>
                <div className="csub">Votre site, tel que vu par vos clients.</div>
                <div className="previewbox"><iframe title="preview" srcDoc={renderSite(d)} /></div>
              </div>
            </div>
          </>
        )}

        {tab === "site" && (
          <>
            <div className="dh"><div><h1>Mon site</h1><p>Modifiez vos infos — synchronisées avec votre fiche Google.</p></div>
              <button className="btn primary sm">Enregistrer</button></div>
            <div className="card">
              <h3>Informations</h3>
              <div className="csub">Importées depuis Google, modifiables ici.</div>
              <div className="grid2">
                <div className="field-row"><label>Nom de l'établissement</label><input value={biz.name} onChange={e => setBiz({ ...biz, name: e.target.value })} /></div>
                <div className="field-row"><label>Téléphone</label><input value={biz.phone} onChange={e => setBiz({ ...biz, phone: e.target.value })} /></div>
              </div>
              <div className="field-row"><label>Accroche</label><input value={biz.tagline} onChange={e => setBiz({ ...biz, tagline: e.target.value })} /></div>
              <div className="field-row"><label>À propos (rédigé par l'IA, modifiable)</label><textarea rows={4} defaultValue={d.ai.about} /></div>
            </div>
            <div className="card">
              <h3>Adresse &amp; horaires</h3>
              <div className="csub">Source : Google Business Profile.</div>
              <div className="grid2">
                <div className="field-row"><label>Adresse</label><input defaultValue={`${d.business.address}, ${d.business.postal} ${d.business.city}`} /></div>
                <div className="field-row"><label>Quartier</label><input defaultValue={d.business.neighborhood} /></div>
              </div>
            </div>
          </>
        )}

        {tab === "blog" && (
          <>
            <div className="dh"><div><h1>Journal</h1><p>Un article optimisé publié chaque semaine, automatiquement.</p></div>
              <button className="btn primary sm" onClick={() => { setGen(true); setTimeout(() => setGen(false), 1600); }}>{gen ? "✓ Génération…" : "Nouvel article"}</button></div>
            <div className="card">
              <h3>Articles</h3>
              <div className="csub">3 publiés ce mois · 1 programmé</div>
              <div className="article"><div className="thumb"></div><div style={{ flex: 1 }}><div className="at">Vins d'hiver : nos 6 bouteilles pour la saison</div><div className="am">Programmé · lundi 8h</div></div><span className="tag sched">Programmé</span></div>
              {d.blog.map((p, i) => (
                <div className="article" key={i}><div className="thumb" style={{ background: `linear-gradient(135deg,${p.hue},#3a2018)` }}></div>
                  <div style={{ flex: 1 }}><div className="at">{p.title}</div><div className="am">{p.date} · {p.read}</div></div><span className="tag live">En ligne</span></div>
              ))}
              <div className="article"><div className="thumb" style={{ background: "linear-gradient(135deg,#79805C,#3a2018)" }}></div><div style={{ flex: 1 }}><div className="at">Notre cave : comment on choisit nos vignerons</div><div className="am">il y a 3 semaines · 5 min</div></div><span className="tag live">En ligne</span></div>
            </div>
          </>
        )}

        {tab === "reviews" && (
          <>
            <div className="dh"><div><h1>Avis Google</h1><p>Synchronisés en continu depuis votre fiche.</p></div></div>
            <div className="grid2">
              <div className="card">
                <h3>{String(d.business.rating).replace(".", ",")} / 5 · {d.business.reviewCount} avis</h3>
                <div className="csub">Répartition</div>
                {[[5, 86], [4, 9], [3, 3], [2, 1], [1, 1]].map(([s, pct]) => (
                  <div className="bar-dist" key={s}><span>{s}★</span><div className="track"><i style={{ width: pct + "%" }}></i></div><span>{pct}%</span></div>
                ))}
              </div>
              <div className="card">
                <h3>Derniers avis</h3>
                <div className="csub">Affichés dans le carrousel de votre site.</div>
                {d.reviews.slice(0, 4).map((r, i) => (
                  <div className="revrow" key={i}><span className="ava" style={{ background: r.c }}>{r.author.charAt(0)}</span>
                    <div><div className="rt"><b>{r.author}</b><span className="rstars">{"★".repeat(r.rating)}</span></div><div className="rx">{r.text}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "seo" && (
          <>
            <div className="dh"><div><h1>Référencement</h1><p>Optimisation Google + moteurs IA (ChatGPT, Perplexity).</p></div></div>
            <div className="grid2">
              <div className="card">
                <h3>État de l'optimisation</h3>
                <div className="csub">Vérifié automatiquement.</div>
                <div className="checks">
                  {[["Données structurées JSON-LD (LocalBusiness, Review, FAQ)", false],
                    ["Fiche Google synchronisée (NAP cohérent)", false],
                    ["Site rapide & mobile (Core Web Vitals)", false],
                    ["Crawlers IA autorisés (GPTBot, ClaudeBot)", false],
                    ["Contenu frais — 1 article / semaine", true]].map(([t, w], i) => (
                    <div className="checkrow" key={i}><span className={"ck" + (w ? " warn" : "")}>{w ? "↻" : "✓"}</span>{t}</div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3>Mots-clés locaux ciblés</h3>
                <div className="csub">Générés par l'IA d'après votre activité.</div>
                <div style={{ marginTop: 4 }}>{d.ai.keywords.map((k, i) => <span className="kw" key={i}>{k}</span>)}</div>
              </div>
            </div>
            <div className="card">
              <h3>Meta &amp; schema injectés</h3>
              <div className="field-row"><label>Title</label><input readOnly value={d.ai.seoTitle} /></div>
              <div className="field-row"><label>Meta description</label><textarea readOnly rows={2} value={d.ai.seoDescription} /></div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
