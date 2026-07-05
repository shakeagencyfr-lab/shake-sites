import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;

/* ============================================================
   1. SMOOTH SCROLL (Lenis) ↔ GSAP ScrollTrigger
   ============================================================ */
let lenis;
if (!reduce) {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

const scrollTo = (target) => {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -10 });
  else el.scrollIntoView({ behavior: "smooth" });
};

/* ============================================================
   2. PRELOADER
   ============================================================ */
function runPreloader(onDone) {
  const pre = document.getElementById("preloader");
  const countEl = document.getElementById("count");
  const bar = document.getElementById("preBar");
  const letters = document.querySelectorAll(".preloader__word span");

  const hide = () => {
    pre.style.display = "none";
  };

  if (reduce) {
    hide();
    onDone();
    return;
  }

  // Hard safety net: never let the preloader trap the page, whatever happens.
  const failSafe = setTimeout(() => {
    hide();
    onDone();
  }, 3500);

  const tl = gsap.timeline({
    onComplete: () => {
      clearTimeout(failSafe);
      onDone();
    },
  });
  const counter = { v: 0 };

  tl.to(letters, { y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }, 0.1)
    .to(
      counter,
      {
        v: 100,
        duration: 1.8,
        ease: "power1.inOut",
        onUpdate: () => {
          const val = Math.round(counter.v);
          countEl.textContent = val;
          bar.style.width = val + "%";
        },
      },
      0
    )
    .to(letters, { y: "-110%", duration: 0.6, stagger: 0.04, ease: "power3.in" }, 2.0)
    .to(pre, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 2.3)
    .add(hide);
}

/* ============================================================
   3. CUSTOM CURSOR + MAGNETIC
   ============================================================ */
function initCursor() {
  if (isTouch) return;
  const cursor = document.getElementById("cursor");
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  let mx = innerWidth / 2,
    my = innerHeight / 2,
    rx = mx,
    ry = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
  });
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    gsap.set(ring, { x: rx, y: ry });
  });

  document.querySelectorAll('[data-cursor="hover"], a, button').forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });
}

function initMagnetic() {
  if (isTouch) return;
  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = 0.4;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" })
    );
  });
}

/* ============================================================
   4. NAV — hide on scroll down, solid past hero, progress bar
   ============================================================ */
function initNav() {
  const nav = document.getElementById("nav");
  const scrollbar = document.getElementById("scrollbar");
  let last = 0;

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle("is-solid", y > 60);
      if (y > last && y > 300) nav.classList.add("is-hidden");
      else nav.classList.remove("is-hidden");
      last = y;
      gsap.set(scrollbar, { scaleX: self.progress });
    },
  });

  // anchor links → smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        e.preventDefault();
        scrollTo(id);
      }
    });
  });

  // burger (mobile) just jumps to pricing
  const burger = document.getElementById("burger");
  burger?.addEventListener("click", () => scrollTo("#tarifs"));
}

/* ============================================================
   5. HERO — title reveal + auto-zoom out on scroll
   ============================================================ */
function initHero() {
  // words are visible by default (CSS) — JS animates them IN via .from,
  // so if scripts never run the hero still reads normally.
  const words = document.querySelectorAll(".hero__title .w");
  gsap.from(words, {
    yPercent: 110,
    duration: 1,
    stagger: 0.08,
    ease: "power4.out",
    delay: reduce ? 0 : 0.1,
  });
  gsap.from(".reveal-up", {
    y: 30,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.5,
  });

  if (reduce) return;

  // auto-zoom: hero content scales up & fades as you scroll away
  gsap.to(".hero__inner", {
    scale: 1.35,
    opacity: 0,
    filter: "blur(14px)",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  // parallax orbs
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    gsap.to(el, {
      yPercent: 30 * parseFloat(el.dataset.parallax),
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  });
}

/* ============================================================
   6. MARQUEES — velocity-reactive infinite scroll
   ============================================================ */
function initMarquees() {
  document.querySelectorAll("[data-marquee]").forEach((wrap) => {
    const track = wrap.querySelector(".marquee__track");
    const slow = wrap.classList.contains("marquee--slow");
    const base = slow ? 28 : 20; // seconds per loop
    const dir = { v: 1 };

    const tween = gsap.to(track, {
      xPercent: -50,
      repeat: -1,
      duration: base,
      ease: "none",
    });

    if (lenis) {
      lenis.on("scroll", ({ velocity }) => {
        const v = gsap.utils.clamp(-4, 4, velocity * 0.08);
        tween.timeScale(1 + Math.abs(v));
        dir.v = velocity < 0 ? -1 : 1;
        gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true });
      });
    }
  });
}

/* ============================================================
   7. MANIFESTO — word-by-word color reveal
   ============================================================ */
function splitWords(el) {
  const nodes = [...el.childNodes];
  el.innerHTML = "";
  nodes.forEach((node) => {
    if (node.nodeType === 3) {
      node.textContent.split(/(\s+)/).forEach((token) => {
        if (token.trim() === "") {
          el.appendChild(document.createTextNode(token));
        } else {
          const s = document.createElement("span");
          s.className = "word";
          s.textContent = token;
          el.appendChild(s);
        }
      });
    } else {
      // keep <em> etc, but wrap its text as a highlighted word
      const s = document.createElement("span");
      s.className = "word em";
      s.style.background = "var(--grad-soft)";
      s.style.webkitBackgroundClip = "text";
      s.style.backgroundClip = "text";
      s.appendChild(node.cloneNode(true));
      el.appendChild(s);
      el.appendChild(document.createTextNode(" "));
    }
  });
  return el.querySelectorAll(".word");
}

function initManifesto() {
  const el = document.querySelector("[data-words]");
  if (!el) return;
  const words = splitWords(el);
  if (reduce) {
    gsap.set(words, { color: "var(--txt)" });
    return;
  }
  gsap.to(words, {
    color: "var(--txt)",
    stagger: 0.5,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top 75%",
      end: "bottom 55%",
      scrub: true,
    },
  });

  // CTA title words
  const cta = document.querySelector("[data-words-cta]");
  if (cta) {
    const w = splitWords(cta);
    gsap.to(w, {
      color: "var(--txt)",
      stagger: 0.3,
      ease: "none",
      scrollTrigger: { trigger: cta, start: "top 85%", end: "bottom 60%", scrub: true },
    });
  }
}

/* ============================================================
   8. HORIZONTAL SCROLL — pinned panels + progress + zoom
   ============================================================ */
function initHorizontal(mm) {
  mm.add("(min-width: 901px)", () => {
    const pin = document.querySelector("[data-horizon]");
    const section = document.querySelector(".horizon");
    if (!pin) return;
    // Switch off the no-JS vertical fallback → enable the real pinned layout.
    document.documentElement.classList.add("js-ready");
    const bar = pin.querySelector("[data-horizon-bar]");

    const getDistance = () => pin.scrollWidth - window.innerWidth;

    const tween = gsap.to(pin, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + getDistance(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (bar) bar.style.width = self.progress * 100 + "%";
        },
      },
    });

    // per-panel auto-zoom of the inner visual
    document.querySelectorAll("[data-zoom]").forEach((v) => {
      gsap.fromTo(
        v,
        { scale: 0.82, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: v,
            containerAnimation: tween,
            start: "left 80%",
            end: "center 55%",
            scrub: true,
          },
        }
      );
    });
  });
}

/* ============================================================
   9. SHOWCASE — pinned phone, screen switching + zoom
   ============================================================ */
function initShowcase(mm) {
  const screens = gsap.utils.toArray("[data-app-screen]");
  const steps = gsap.utils.toArray("[data-show-step]");
  const phone = document.querySelector("[data-zoom-device]");
  if (!screens.length) return;

  const setActive = (i) => {
    screens.forEach((s, k) => s.classList.toggle("is-on", k === i));
    steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
  };
  setActive(0);

  mm.add("(min-width: 901px)", () => {
    const st = ScrollTrigger.create({
      trigger: ".showcase__sticky",
      start: "top top",
      end: "+=2600",
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const i = Math.min(screens.length - 1, Math.floor(self.progress * screens.length));
        setActive(i);
      },
    });
    // zoom breathing on the phone as you progress
    gsap.fromTo(
      phone,
      { scale: 0.92 },
      {
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: ".showcase__sticky",
          start: "top top",
          end: "+=2600",
          scrub: true,
        },
      }
    );
    return () => st.kill();
  });

  mm.add("(max-width: 900px)", () => {
    // simple auto-cycle on mobile
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % screens.length;
      setActive(i);
    }, 2200);
    return () => clearInterval(id);
  });
}

/* ============================================================
   10. GENERIC REVEALS + COUNTERS
   ============================================================ */
function initReveals() {
  gsap.utils.toArray(".reveal-scale").forEach((el) => {
    gsap.from(el, {
      scale: 0.86,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 82%" },
    });
  });

  gsap.utils.toArray(".reveal-stagger").forEach((group) => {
    gsap.from(group.children, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: group, start: "top 80%" },
    });
  });

  gsap.utils.toArray(".section-title").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
}

function initCounters() {
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals) + suffix;
          },
        }),
    });
  });
}

/* ============================================================
   11. BILLING TOGGLE — mensuel / annuel (2 mois offerts)
   ============================================================ */
function initBilling() {
  const wrap = document.querySelector(".billing");
  if (!wrap) return;
  const pill = wrap.querySelector("[data-billing-pill]");
  const opts = [...wrap.querySelectorAll(".billing__opt")];
  const priceEl = document.querySelector("[data-price]");
  const periodEl = document.querySelector("[data-period]");
  const billedEl = document.querySelector("[data-billed]");

  const DATA = {
    monthly: { value: 19, decimals: 0, period: "/ mois", billed: "Facturé chaque mois · sans engagement" },
    yearly: { value: 190, decimals: 0, period: "/ an", billed: "2 mois offerts · soit 15,83€/mois" },
  };
  const fmt = (v, d) => (d ? v.toFixed(2).replace(".", ",") : String(Math.round(v))) + "€";

  const movePill = (btn) => {
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
  };

  let current = DATA.monthly.value;
  const select = (btn, animate = true) => {
    const key = btn.dataset.billing;
    const d = DATA[key];
    opts.forEach((o) => {
      const on = o === btn;
      o.classList.toggle("is-on", on);
      o.setAttribute("aria-selected", on ? "true" : "false");
    });
    movePill(btn);
    periodEl.textContent = d.period;
    billedEl.textContent = d.billed;

    if (animate && !reduce) {
      const obj = { v: current };
      gsap.to(obj, {
        v: d.value,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          priceEl.textContent = fmt(obj.v, obj.v % 1 === 0 ? 0 : 2);
        },
        onComplete: () => (priceEl.textContent = fmt(d.value, d.decimals)),
      });
    } else {
      priceEl.textContent = fmt(d.value, d.decimals);
    }
    current = d.value;
  };

  opts.forEach((btn) => btn.addEventListener("click", () => select(btn)));

  const active = () => wrap.querySelector(".billing__opt.is-on");
  requestAnimationFrame(() => movePill(active()));
  window.addEventListener("resize", () => movePill(active()));
  if (document.fonts) document.fonts.ready.then(() => movePill(active()));
}

/* ============================================================
   BOOT
   ============================================================ */
function boot() {
  document.getElementById("year").textContent = new Date().getFullYear();
  const mm = gsap.matchMedia();

  initCursor();
  initMagnetic();
  initNav();
  initHero();
  initMarquees();
  initManifesto();
  initHorizontal(mm);
  initShowcase(mm);
  initReveals();
  initCounters();
  initBilling();

  // keep triggers in sync after fonts/layout settle
  ScrollTrigger.refresh();
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

runPreloader(boot);
