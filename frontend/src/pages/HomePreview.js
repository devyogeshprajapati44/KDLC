import React, { useState } from "react";

const RECORDS = [
  { id: 1, title: "Midnight Static", artist: "Coral Drift", price: 24, cat: "WW-001", tone: "coral" },
  { id: 2, title: "Low Tide Sessions", artist: "The Amber Room", price: 28, cat: "WW-002", tone: "amber" },
  { id: 3, title: "Nightbloom", artist: "Vera Quinn", price: 22, cat: "WW-003", tone: "teal" },
  { id: 4, title: "Analog Ghosts", artist: "Ferris & Lowe", price: 26, cat: "WW-004", tone: "indigo" },
  { id: 5, title: "Slow Static", artist: "Marta Vale", price: 30, cat: "WW-005", tone: "amber" },
  { id: 6, title: "Paper Moon", artist: "Coral Drift", price: 24, cat: "WW-006", tone: "coral" },
];

function AlbumArt({ tone }) {
  return (
    <svg viewBox="0 0 200 200" className={`disc disc--${tone}`} aria-hidden="true">
      <circle cx="100" cy="100" r="98" className="disc__base" />
      <circle cx="100" cy="100" r="80" className="disc__groove" />
      <circle cx="100" cy="100" r="64" className="disc__groove" />
      <circle cx="100" cy="100" r="48" className="disc__groove" />
      <circle cx="100" cy="100" r="34" className="disc__label" />
      <circle cx="100" cy="100" r="4" className="disc__hole" />
    </svg>
  );
}

function RecordCard({ record, onAdd }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="card__sleeve">
        <div className={`card__disc ${hover ? "card__disc--out" : ""}`}>
          <AlbumArt tone={record.tone} />
        </div>
        <div className="card__sleeveFace">
          <span className="card__cat">{record.cat}</span>
        </div>
      </div>
      <div className="card__body">
        <div className="card__text">
          <p className="card__title">{record.title}</p>
          <p className="card__artist">{record.artist}</p>
        </div>
        <div className="card__buy">
          <span className="card__price">${record.price}</span>
          <button
            type="button"
            className="card__addBtn"
            aria-label={`Add ${record.title} to bag`}
            onClick={() => onAdd(record)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [bagCount, setBagCount] = useState(0);

  function handleAdd() {
    setBagCount((n) => n + 1);
  }

  return (
    <div className="page">
      <style>{`@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..900&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap");

:root {
  --ink: #15141f;
  --ink-soft: #211f30;
  --paper: #f3ecdd;
  --paper-dim: #e6dcc6;
  --amber: #c97c3e;
  --amber-deep: #8f5324;
  --teal: #3f7d74;
  --coral: #c85a4a;
  --line: rgba(243, 236, 221, 0.16);
}

* {
  box-sizing: border-box;
}

.page {
  background: var(--ink);
  color: var(--paper);
  font-family: "Work Sans", sans-serif;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ---------- nav ---------- */

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px clamp(20px, 6vw, 72px);
  border-bottom: 1px solid var(--line);
}

.nav__logo {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.02em;
}

.nav__logoAccent {
  color: var(--amber);
  font-style: italic;
}

.nav__links {
  display: flex;
  gap: 32px;
  font-size: 14px;
}

.nav__links a {
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.nav__links a:hover,
.nav__links a:focus-visible {
  opacity: 1;
}

.nav__bag {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--paper);
  font-family: "IBM Plex Mono", monospace;
  font-size: 12px;
  padding: 9px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.15s ease;
}

.nav__bag:hover {
  border-color: var(--amber);
}

.nav__bag:active {
  transform: scale(0.97);
}

@media (max-width: 640px) {
  .nav__links {
    display: none;
  }
}

/* ---------- hero ---------- */

.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 40px;
  padding: clamp(48px, 8vw, 96px) clamp(20px, 6vw, 72px);
}

.hero__eyebrow {
  font-family: "IBM Plex Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--amber);
  margin: 0 0 18px;
}

.hero__title {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: clamp(38px, 5.4vw, 64px);
  line-height: 1.04;
  margin: 0 0 24px;
}

.hero__sub {
  font-size: 17px;
  line-height: 1.6;
  color: var(--paper-dim);
  max-width: 46ch;
  margin: 0 0 32px;
}

.hero__cta {
  display: inline-block;
  background: var(--amber);
  color: var(--ink);
  font-weight: 600;
  font-size: 15px;
  padding: 14px 28px;
  border-radius: 999px;
  transition: transform 0.15s ease, background 0.2s ease;
}

.hero__cta:hover {
  background: #dc9257;
}

.hero__cta:focus-visible,
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 3px;
}

.hero__cta:active {
  transform: scale(0.97);
}

.hero__visual {
  display: flex;
  justify-content: center;
}

.turntable {
  position: relative;
  width: min(360px, 90%);
  aspect-ratio: 1;
}

.turntable__platter {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--ink-soft);
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6%;
}

.turntable__record {
  width: 100%;
  height: 100%;
  animation: spin 9s linear infinite;
}

.turntable__arm {
  position: absolute;
  top: 6%;
  right: -4%;
  width: 46%;
  height: 46%;
  border-top: 4px solid var(--paper-dim);
  border-right: 4px solid var(--paper-dim);
  border-radius: 0 100% 0 0;
  transform-origin: top right;
  transform: rotate(-18deg);
}

.turntable__armHead {
  position: absolute;
  bottom: -6px;
  left: -8px;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: var(--coral);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .hero__visual {
    order: -1;
  }
}

/* ---------- groove divider ---------- */

.groove-divider {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 8px 0 32px;
}

.groove-divider span {
  width: 60px;
  height: 1px;
  background: var(--line);
  align-self: center;
}

.groove-divider span:nth-child(2) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--amber);
}

/* ---------- crate / product grid ---------- */

.crate {
  padding: 0 clamp(20px, 6vw, 72px) 96px;
}

.crate__heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 36px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 18px;
}

.crate__heading h2 {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 30px;
  margin: 0;
}

.crate__heading p {
  color: var(--paper-dim);
  font-size: 14px;
  margin: 0;
}

.crate__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 28px;
}

/* ---------- card ---------- */

.card {
  display: flex;
  flex-direction: column;
}

.card__sleeve {
  position: relative;
  aspect-ratio: 1;
  border-radius: 6px;
  background: var(--paper);
  overflow: hidden;
}

.card__sleeveFace {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 12px;
  pointer-events: none;
}

.card__cat {
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  color: var(--ink);
  opacity: 0.55;
}

.card__disc {
  position: absolute;
  top: 0;
  right: 6%;
  width: 88%;
  height: 100%;
  transition: transform 0.35s ease;
  transform: translateX(28%);
}

.card__disc--out {
  transform: translateX(4%);
}

.card__body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
}

.card__title {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 17px;
  margin: 0 0 4px;
}

.card__artist {
  font-size: 13px;
  color: var(--paper-dim);
  margin: 0;
}

.card__buy {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.card__price {
  font-family: "IBM Plex Mono", monospace;
  font-size: 14px;
  color: var(--amber);
}

.card__addBtn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--paper);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}

.card__addBtn:hover {
  background: var(--teal);
  border-color: var(--teal);
}

.card__addBtn:active {
  transform: scale(0.92);
}

/* ---------- disc svg ---------- */

.disc {
  width: 100%;
  height: 100%;
}

.disc__base {
  fill: var(--ink);
}

.disc__groove {
  fill: none;
  stroke: rgba(243, 236, 221, 0.08);
  stroke-width: 1;
}

.disc__hole {
  fill: var(--paper);
}

.disc--coral .disc__label {
  fill: var(--coral);
}

.disc--amber .disc__label {
  fill: var(--amber);
}

.disc--teal .disc__label {
  fill: var(--teal);
}

.disc--indigo .disc__label {
  fill: #7b78c9;
}

/* ---------- footer ---------- */

.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 32px;
  padding: 48px clamp(20px, 6vw, 72px) 56px;
  border-top: 1px solid var(--line);
}

.footer__logo {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 8px;
}

.footer__line {
  font-size: 13px;
  color: var(--paper-dim);
  margin: 0;
}

.footer__cols {
  display: flex;
  gap: 56px;
}

.footer__cols a {
  display: block;
  font-size: 13px;
  color: var(--paper-dim);
  margin-top: 8px;
  transition: color 0.2s ease;
}

.footer__cols a:hover {
  color: var(--paper);
}

.footer__head {
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--paper);
  margin: 0;
}

/* ---------- motion & accessibility ---------- */

@media (prefers-reduced-motion: reduce) {
  .turntable__record {
    animation: none;
  }
  .card__disc {
    transition: none;
  }
}
`}</style>
      <nav className="nav">
        <span className="nav__logo">
          Wax <span className="nav__logoAccent">&amp;</span> Wave
        </span>
        <div className="nav__links">
          <a href="#crate">The crate</a>
          <a href="#about">About</a>
          <a href="#visit">Visit</a>
        </div>
        <button type="button" className="nav__bag" aria-label="View bag">
          Bag ({bagCount})
        </button>
      </nav>

      <header className="hero">
        <div className="hero__text">
          <p className="hero__eyebrow">Now spinning</p>
          <h1 className="hero__title">
            Records worth
            <br />
            dropping the needle on.
          </h1>
          <p className="hero__sub">
            A small crate of independent presses, reissues and first pressings,
            picked one at a time and shipped from our shop floor.
          </p>
          <a href="#crate" className="hero__cta">
            Browse the crate
          </a>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="turntable">
            <div className="turntable__platter">
              <div className="turntable__record">
                <AlbumArt tone="indigo" />
              </div>
            </div>
            <div className="turntable__arm">
              <div className="turntable__armHead" />
            </div>
          </div>
        </div>
      </header>

      <div className="groove-divider" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <main id="crate" className="crate">
        <div className="crate__heading">
          <h2>The crate</h2>
          <p>Six on the shelf this week, more in the back room.</p>
        </div>
        <div className="crate__grid">
          {RECORDS.map((record) => (
            <RecordCard record={record} onAdd={handleAdd} key={record.id} />
          ))}
        </div>
      </main>

      <footer className="footer" id="visit">
        <div>
          <p className="footer__logo">Wax &amp; Wave</p>
          <p className="footer__line">Open Tuesday–Sunday, 11–7. Turntable always warm.</p>
        </div>
        <div className="footer__cols">
          <div>
            <p className="footer__head">Shop</p>
            <a href="#crate">New arrivals</a>
            <a href="#crate">Reissues</a>
            <a href="#crate">Trade-ins</a>
          </div>
          <div>
            <p className="footer__head">Shop floor</p>
            <a href="#about">Our story</a>
            <a href="#visit">Find us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
