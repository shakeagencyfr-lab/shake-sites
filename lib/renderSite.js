// lib/renderSite.js — produit un document HTML complet (head, meta, JSON-LD)
// pour le site généré. Responsive : colonne mobile élégante + vraie mise en page
// desktop avec carrousel d'avis pleine largeur.

function star(f){return '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" fill="'+(f?'#E8B53D':'rgba(232,181,61,.28)')+'"/></svg>';}
function stars(n){let s='';for(let i=1;i<=5;i++)s+=star(i<=Math.round(n));return s;}
const esc = s => String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const fr = n => String(n).replace(".", ",");

export function renderSite(d) {
  const b = d.business, ai = d.ai;
  const accent = b.accent || "#7A2638";

  const reviewsHtml = d.reviews.map(r => (
    '<article class="rev" role="group" aria-roledescription="avis">'+
      '<div class="rev-top"><span class="ava" style="background:'+r.c+'">'+esc(r.author.charAt(0))+'</span>'+
        '<div><div class="rev-name">'+esc(r.author)+'</div><div class="rev-meta"><span class="g">G</span> '+esc(r.time)+'</div></div>'+
        '<span class="rev-stars">'+stars(r.rating)+'</span></div>'+
      '<p class="rev-text">'+esc(r.text)+'</p>'+
    '</article>'
  )).join('');

  const highHtml = ai.highlights.map((h,i) => (
    '<div class="hl reveal"><span class="hl-n">0'+(i+1)+'</span><h3>'+esc(h.t)+'</h3><p>'+esc(h.d)+'</p></div>'
  )).join('');

  const blogHtml = d.blog.map(p => (
    '<a class="post reveal" href="#"><div class="post-img" style="--h:'+(p.hue||accent)+'"><span class="post-tag">'+esc(p.tag)+'</span></div>'+
      '<div class="post-body"><div class="post-meta">'+esc(p.date)+' · '+esc(p.read||"3 min")+' de lecture</div>'+
      '<h3>'+esc(p.title)+'</h3><p>'+esc(p.excerpt)+'</p><span class="post-link">Lire l\'article →</span></div></a>'
  )).join('');

  const faqHtml = ai.faq.map(f => (
    '<details class="faq reveal"><summary>'+esc(f.q)+'<span class="faq-x">+</span></summary><p>'+esc(f.a)+'</p></details>'
  )).join('');

  const ld = {
    "@context":"https://schema.org","@type":"LocalBusiness","name":b.name,
    "image":b.website||d.agency.domain,"priceRange":b.priceLevel,"telephone":b.phone,
    "address":{"@type":"PostalAddress","streetAddress":b.address,"postalCode":b.postal,"addressLocality":b.city,"addressCountry":"FR"},
    "aggregateRating":{"@type":"AggregateRating","ratingValue":b.rating,"reviewCount":b.reviewCount},
    "review":d.reviews.slice(0,3).map(r=>({"@type":"Review","author":{"@type":"Person","name":r.author},"reviewRating":{"@type":"Rating","ratingValue":r.rating}}))
  };
  const faqLd = { "@context":"https://schema.org","@type":"FAQPage","mainEntity":ai.faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}})) };
  const ldString = JSON.stringify(ld);
  const faqString = JSON.stringify(faqLd);
  const hoursJson = JSON.stringify(b.hours || {});

  const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#161210;color:#ECE3D4;font-family:"Hanken Grotesk",system-ui,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
  :root{--ink:#161210;--char:#1f1813;--bone:#ECE3D4;--accent:${accent};--ember:#CE6A33;--haze:#A99E8C;--line:rgba(236,227,212,.13)}
  .mono{font-family:"Space Mono",monospace;letter-spacing:.14em;text-transform:uppercase;font-size:11px}
  .wrapS{max-width:560px;margin:0 auto;padding:0 22px}
  /* nav */
  .nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:13px 22px;background:transparent;transition:.3s;border-bottom:1px solid transparent}
  .nav.stuck{background:rgba(22,18,16,.88);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
  .nav .bn{font-family:"Instrument Serif",serif;font-size:21px}
  .nav .cta{font-family:"Space Mono",monospace;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--ink);background:var(--ember);padding:8px 14px;border-radius:999px;text-decoration:none}
  /* hero */
  .hero{position:relative;min-height:92vh;display:flex;flex-direction:column;justify-content:flex-end;padding:0 22px 46px;overflow:hidden}
  .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(120% 80% at 70% 0%,rgba(206,106,51,.32),transparent 55%),radial-gradient(130% 90% at 10% 100%,${accent}99,transparent 60%),linear-gradient(180deg,#221813,#120e0c);z-index:0}
  .hero::after{content:"";position:absolute;inset:0;z-index:1;opacity:.45;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.5'/></svg>")}
  .hero-in{position:relative;z-index:2;width:100%;max-width:560px;margin:0 auto}
  .hero .eb{color:var(--ember);margin-bottom:18px;display:block}
  .hero h1{font-family:"Instrument Serif",serif;font-size:clamp(52px,17vw,84px);line-height:.92;font-weight:400}
  .hero h1 i{color:var(--ember)}
  .hero .tg{font-size:18px;color:var(--haze);margin-top:18px;max-width:30ch}
  .spec{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:26px}
  .spec b{font-weight:700}.spec .sep{opacity:.4}
  .spec .open{color:#8fc99b}.spec .open.closed{color:var(--haze)}
  .hbtns{display:flex;gap:10px;margin-top:30px;flex-wrap:wrap}
  .bp{font-family:"Space Mono",monospace;text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:14px 22px;border-radius:999px;text-decoration:none;text-align:center}
  .bp.fill{background:var(--ember);color:var(--ink)}.bp.line{border:1px solid var(--line);color:var(--bone)}
  /* sections */
  section{padding:74px 0}
  .lbl-row{display:flex;align-items:center;gap:12px;color:var(--ember);margin-bottom:22px}
  .lbl-row::before{content:"";width:30px;height:1px;background:var(--ember)}
  .h2{font-family:"Instrument Serif",serif;font-size:clamp(32px,8vw,46px);line-height:1.04;font-weight:400}
  .lede{color:var(--haze);font-size:16.5px;margin-top:18px}
  .about{background:var(--char)}
  .hls{display:flex;flex-direction:column;gap:2px;margin-top:30px}
  .hl{border-top:1px solid var(--line);padding:22px 0;display:grid;grid-template-columns:auto 1fr;gap:4px 18px;align-items:baseline}
  .hl-n{font-family:"Space Mono",monospace;font-size:12px;color:var(--ember);grid-row:span 2}
  .hl h3{font-family:"Instrument Serif",serif;font-size:24px;font-weight:400}
  .hl p{color:var(--haze);font-size:15px}
  /* reviews */
  .reviews{background:linear-gradient(180deg,var(--ink),#1a1411);overflow:hidden}
  .rev-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:26px}
  .rev-score{text-align:right;flex:0 0 auto}
  .rev-score .big{font-family:"Instrument Serif",serif;font-size:46px;line-height:1}
  .rev-score .gl{display:flex;align-items:center;gap:6px;justify-content:flex-end;color:var(--haze);font-size:12px;margin-top:4px}
  .car{position:relative}
  .track{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:0 22px 4px;cursor:grab}
  .track::-webkit-scrollbar{display:none}
  .track.drag{cursor:grabbing;scroll-snap-type:none}
  .rev{flex:0 0 84%;max-width:340px;scroll-snap-align:center;background:var(--char);border:1px solid var(--line);border-radius:18px;padding:20px;user-select:none}
  .rev-top{display:flex;align-items:center;gap:11px;margin-bottom:13px}
  .ava{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;flex:0 0 38px}
  .rev-name{font-weight:600;font-size:14.5px}
  .rev-meta{font-size:11.5px;color:var(--haze);display:flex;align-items:center;gap:6px}
  .rev-meta .g{font-family:"Space Mono",monospace;font-weight:700;color:#4285F4;font-size:13px}
  .rev-stars{margin-left:auto;display:flex;gap:1px}
  .rev-text{font-size:14.5px;color:#ded3c4;line-height:1.55}
  .car-foot{display:flex;align-items:center;justify-content:space-between;margin-top:18px}
  .dots{display:flex;gap:7px;flex-wrap:wrap}.dot{width:7px;height:7px;border-radius:50%;background:var(--line);border:0;padding:0;cursor:pointer;transition:.2s}.dot.on{background:var(--ember);width:20px;border-radius:4px}
  .arrows{display:flex;gap:8px}.arr{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--bone);cursor:pointer;display:grid;place-items:center;font-size:18px}
  .arr:hover{border-color:var(--ember);color:var(--ember)}
  /* blog */
  .blog{background:var(--bone);color:#2a2018}
  .blog .lbl-row{color:var(--accent)}.blog .lbl-row::before{background:var(--accent)}
  .blog .lede{color:#6e5f4f}
  .auto-badge{display:inline-flex;align-items:center;gap:7px;font-family:"Space Mono",monospace;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);background:rgba(122,38,56,.08);padding:6px 12px;border-radius:999px;margin-top:16px}
  .auto-badge .pulse{width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 1.6s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  .posts{display:flex;flex-direction:column;gap:18px;margin-top:28px}
  .post{display:block;text-decoration:none;color:inherit;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 12px 30px -18px rgba(60,40,20,.4)}
  .post-img{height:140px;background:linear-gradient(135deg,var(--h),#3a2018);position:relative}
  .post-tag{position:absolute;left:14px;bottom:14px;font-family:"Space Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#fff;background:rgba(0,0,0,.35);padding:5px 10px;border-radius:999px}
  .post-body{padding:18px 20px 22px}
  .post-meta{font-family:"Space Mono",monospace;font-size:11px;color:#9a8a76;text-transform:uppercase;letter-spacing:.06em}
  .post h3{font-family:"Instrument Serif",serif;font-size:23px;font-weight:400;margin:8px 0;line-height:1.1}
  .post p{font-size:14.5px;color:#6e5f4f}
  .post-link{display:inline-block;margin-top:12px;font-weight:600;font-size:13.5px;color:var(--accent)}
  /* faq */
  .faq{border-bottom:1px solid var(--line)}
  .faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:14px;padding:20px 0;font-size:17px;font-weight:600}
  .faq summary::-webkit-details-marker{display:none}
  .faq-x{font-family:"Space Mono",monospace;color:var(--ember);font-size:20px;transition:.2s}
  .faq[open] .faq-x{transform:rotate(45deg)}
  .faq p{padding:0 0 20px;color:var(--haze);font-size:15px}
  /* infos */
  .infos{background:var(--char)}
  .info-grid{display:flex;flex-direction:column;gap:1px;margin-top:28px;border-radius:16px;overflow:hidden;border:1px solid var(--line)}
  .info-row{display:flex;gap:14px;padding:18px;background:var(--ink);align-items:flex-start}
  .info-row .k{font-family:"Space Mono",monospace;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--ember);flex:0 0 84px;padding-top:2px}
  .info-row .v{font-size:15px}
  .info-row .v .day{display:flex;justify-content:space-between;gap:20px;max-width:240px;color:var(--haze)}
  .info-row .v .day.today{color:var(--bone)}
  .map{margin-top:18px;height:200px;border-radius:16px;overflow:hidden;position:relative;background:#13241d}
  .map svg{position:absolute;inset:0;width:100%;height:100%}
  .pin{position:absolute;left:50%;top:46%;transform:translate(-50%,-100%);z-index:2}
  .foot{padding:50px 22px 60px;text-align:center;border-top:1px solid var(--line)}
  .foot .bn{font-family:"Instrument Serif",serif;font-size:30px}
  .foot .by{margin-top:22px;font-family:"Space Mono",monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:.12em;color:var(--haze);opacity:.7}
  .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s,transform .7s}
  .reveal.in{opacity:1;transform:none}
  @media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}

  /* ========================= DESKTOP ========================= */
  @media(min-width:820px){
    .wrapS{max-width:1080px;padding:0 48px}
    .nav{padding:18px 48px}
    .hero{min-height:88vh;padding:0 48px 64px}
    .hero-in{max-width:1080px}
    .hero h1{font-size:clamp(84px,11vw,140px)}
    .hero .tg{font-size:22px;max-width:38ch}
    .spec{font-size:14px}
    section{padding:110px 0}
    .h2{font-size:clamp(44px,4.6vw,60px)}
    .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
    .hls{margin-top:0;display:grid;grid-template-columns:1fr 1fr;gap:0 40px}
    .hl{grid-template-columns:auto 1fr}
    /* carrousel pleine largeur */
    .rev-head{margin-bottom:36px}
    .rev-score .big{font-size:60px}
    .car{width:100vw;position:relative;left:50%;transform:translateX(-50%)}
    .track{gap:22px;padding:6px max(48px,calc(50vw - 540px)) 8px}
    .rev{flex:0 0 360px;max-width:none;padding:26px}
    .rev-text{font-size:15px}
    .car-foot{max-width:1080px;margin:24px auto 0;padding:0 48px}
    .posts{display:grid;grid-template-columns:1fr 1fr;gap:24px}
    .post-img{height:180px}
    .faq-wrap{max-width:780px}
    .infos-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
    .info-grid{margin-top:0}
    .map{margin-top:0;height:100%;min-height:300px}
  }`;

  const body = `
  <nav class="nav" id="nav"><span class="bn">${esc(b.name)}</span><a class="cta" href="#contact">Réserver</a></nav>
  <header class="hero"><div class="hero-in">
    <span class="eb mono">${esc(b.category)}${b.neighborhood ? " · " + esc(b.neighborhood) : ""}</span>
    <h1>${esc(b.name)}</h1>
    <p class="tg">${esc(b.tagline)}</p>
    <div class="spec mono"><span><b>★ ${fr(b.rating)}</b></span><span class="sep">—</span><span>${b.reviewCount} avis Google</span><span class="sep">·</span><span class="open" id="openNow">Ouvert</span></div>
    <div class="hbtns"><a class="bp fill" href="#contact">Réserver</a><a class="bp line" href="#about">Découvrir le lieu</a></div>
  </div></header>

  <section class="about" id="about"><div class="wrapS"><div class="about-grid">
    <div><div class="lbl-row mono">Le lieu</div><h2 class="h2 reveal">${esc(ai.tagline || "Une adresse à part.")}</h2><p class="lede reveal">${esc(ai.about)}</p></div>
    <div class="hls">${highHtml}</div>
  </div></div></section>

  <section class="reviews"><div class="wrapS"><div class="rev-head">
    <div><div class="lbl-row mono">Ils en parlent</div><h2 class="h2">Vos clients,<br>vos meilleurs ambassadeurs.</h2></div>
    <div class="rev-score"><div class="big">${fr(b.rating)}</div><div class="gl mono"><span style="color:#4285F4;font-weight:700">G</span> ${b.reviewCount} avis</div></div>
  </div></div>
  <div class="car"><div class="track" id="track" tabindex="0" aria-label="Avis Google">${reviewsHtml}</div></div>
  <div class="car-foot"><div class="dots" id="dots"></div><div class="arrows"><button class="arr" id="prev" aria-label="Précédent">‹</button><button class="arr" id="next" aria-label="Suivant">›</button></div></div>
  </section>

  <section class="blog"><div class="wrapS">
    <div class="lbl-row mono">Journal</div>
    <h2 class="h2 reveal">Des articles qui vous font remonter sur Google.</h2>
    <p class="lede reveal">Un nouvel article optimisé, publié automatiquement chaque semaine.</p>
    <div class="auto-badge"><span class="pulse"></span> Publication automatique · 1 article / semaine</div>
    <div class="posts">${blogHtml}</div>
  </div></section>

  <section><div class="wrapS faq-wrap">
    <div class="lbl-row mono">Questions fréquentes</div>
    <h2 class="h2 reveal" style="margin-bottom:18px">Bon à savoir avant de venir.</h2>
    ${faqHtml}
  </div></section>

  <section class="infos" id="contact"><div class="wrapS">
    <div class="lbl-row mono">Infos pratiques</div>
    <h2 class="h2 reveal" style="margin-bottom:8px">Nous trouver.</h2>
    <div class="infos-grid" style="margin-top:24px">
      <div class="info-grid reveal">
        <div class="info-row"><span class="k">Adresse</span><span class="v">${esc(b.address)}<br>${esc(b.postal)} ${esc(b.city)}</span></div>
        <div class="info-row"><span class="k">Horaires</span><span class="v" id="hoursList"></span></div>
        <div class="info-row"><span class="k">Téléphone</span><span class="v"><a href="tel:${esc((b.phone||"").replace(/ /g,""))}" style="color:var(--ember);text-decoration:none">${esc(b.phone)}</a></span></div>
      </div>
      <div class="map reveal"><svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice"><rect width="400" height="200" fill="#13241d"/><g stroke="#1f3a30" stroke-width="6" fill="none"><path d="M-20 60 H420"/><path d="M-20 130 H420"/><path d="M90 -20 V220"/><path d="M250 -20 V220"/></g><g stroke="#26473a" stroke-width="2" fill="none"><path d="M-20 95 H420"/><path d="M170 -20 V220"/><path d="M330 -20 V220"/></g></svg><div class="pin"><svg width="34" height="42" viewBox="0 0 34 42"><path d="M17 0C8 0 1 7 1 16c0 11 16 26 16 26s16-15 16-26C33 7 26 0 17 0z" fill="${accent}"/><circle cx="17" cy="16" r="6" fill="#161210"/></svg></div></div>
    </div>
  </div></section>

  <footer class="foot"><div class="bn">${esc(b.name)}</div>
    <div class="spec mono" style="justify-content:center;margin-top:14px"><span>★ ${fr(b.rating)}</span><span class="sep">·</span><span>${esc(b.neighborhood||b.city)}</span></div>
    <div class="by">Site créé avec ✦ ${esc(d.agency.name)}</div>
  </footer>`;

  // Script interne (chaîne simple : pas de backticks, pas de ${ })
  const innerJS =
    'var hours=JSON.parse(document.getElementById("hoursData").textContent||"{}");'
    +'var days=["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];'
    +'(function(){var el=document.getElementById("openNow");var s=hours[new Date().getDay()];if(!s){el.textContent="Fermé aujourd\'hui";el.className="open closed";return;}var now=new Date();var m=now.getHours()*60+now.getMinutes();var open=false;for(var i=0;i<s.length;i++){var a=s[i][0].split(":"),z=s[i][1].split(":");var st=(+a[0])*60+(+a[1]);var en=(+z[0])*60+(+z[1]);if(en<=st)en+=1440;if(m>=st&&m<en)open=true;}el.textContent=open?"Ouvert maintenant":"Fermé";if(!open)el.className="open closed";})();'
    +'(function(){var L=document.getElementById("hoursList");var dow=new Date().getDay();var order=[1,2,3,4,5,6,0];var h="";for(var i=0;i<order.length;i++){var dn=order[i];var s=hours[dn];var t=s?s.map(function(x){return x[0]+"–"+x[1];}).join(", "):"Fermé";h+="<div class=\\"day"+(dn===dow?" today":"")+"\\"><span>"+days[dn]+"</span><span>"+t+"</span></div>";}L.innerHTML=h;})();'
    +'var nav=document.getElementById("nav");window.addEventListener("scroll",function(){nav.classList.toggle("stuck",window.scrollY>40);});'
    +'(function(){var t=document.getElementById("track");if(!t)return;var sl=t.children;var n=sl.length;var dots=document.getElementById("dots");var idx=0;for(var i=0;i<n;i++){var bt=document.createElement("button");bt.className="dot"+(i===0?" on":"");bt.setAttribute("aria-label","Avis "+(i+1));(function(k){bt.onclick=function(){go(k);stop();};})(i);dots.appendChild(bt);}'
    +'function go(i){idx=Math.max(0,Math.min(n-1,i));var s=sl[idx];t.scrollTo({left:s.offsetLeft-(t.clientWidth-s.clientWidth)/2,behavior:"smooth"});mark();}'
    +'function mark(){var ds=dots.children;for(var i=0;i<ds.length;i++)ds[i].className="dot"+(i===idx?" on":"");}'
    +'document.getElementById("next").onclick=function(){go(idx+1);stop();};document.getElementById("prev").onclick=function(){go(idx-1);stop();};'
    +'var raf;t.addEventListener("scroll",function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){var c=t.scrollLeft+t.clientWidth/2;var best=0,bd=1e9;for(var i=0;i<n;i++){var sc=sl[i].offsetLeft+sl[i].clientWidth/2;var dd=Math.abs(sc-c);if(dd<bd){bd=dd;best=i;}}idx=best;mark();});});'
    +'var down=false,sx=0,st0=0;t.addEventListener("pointerdown",function(e){down=true;sx=e.clientX;st0=t.scrollLeft;t.classList.add("drag");try{t.setPointerCapture(e.pointerId);}catch(_){}});t.addEventListener("pointermove",function(e){if(!down)return;t.scrollLeft=st0-(e.clientX-sx);});function up(){down=false;t.classList.remove("drag");}t.addEventListener("pointerup",up);t.addEventListener("pointercancel",up);'
    +'var auto=setInterval(function(){go((idx+1)%n);},4500);function stop(){clearInterval(auto);}t.addEventListener("pointerdown",stop);})();'
    +'(function(){if(!("IntersectionObserver" in window))return;var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.16});document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});})();';

  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">'
    +'<meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>'+esc(ai.seoTitle)+'</title>'
    +'<meta name="description" content="'+esc(ai.seoDescription)+'">'
    +'<meta name="keywords" content="'+esc((ai.keywords||[]).join(", "))+'">'
    +'<meta property="og:title" content="'+esc(b.name+" — "+b.category+" à "+b.city)+'">'
    +'<meta property="og:description" content="'+esc(b.tagline)+'">'
    +'<meta property="og:type" content="website">'
    +'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    +'<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">'
    +'<script type="application/ld+json">'+ldString+'<\/script>'
    +'<script type="application/ld+json">'+faqString+'<\/script>'
    +'<script type="application/json" id="hoursData">'+hoursJson+'<\/script>'
    +'<style>'+css+'</style></head><body>'+body
    +'<script>'+innerJS+'<\/script></body></html>';
}
