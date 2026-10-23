import { lazy, Suspense, useState, type CSSProperties } from 'react'
import { about } from './about-content'
import type { Lang } from './content'

const base = import.meta.env.BASE_URL + 'about/'

// The phone + city figure is a large generated SVG, so it loads on its own.
const PhoneCity = lazy(() => import('./figures/phone-city/PhoneCity'))

// The portrait enters as this many vertical strips, one after another.
const STRIPS = 6

function Accent({ h }: { h: [string, string] }) {
  return (
    <>
      {h[0]}
      <em className="serif">{h[1]}</em>
    </>
  )
}

// An image that falls back to a labelled placeholder until the file exists.
function Photo({ src, alt, pending, className }: { src: string; alt: string; pending: string; className?: string }) {
  const [missing, setMissing] = useState(false)
  return (
    <div className={`ab-photo ${className ?? ''}`}>
      {missing ? (
        <span className="ab-photo-pending">{pending}</span>
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setMissing(true)} />
      )}
    </div>
  )
}

// Company logo, or a monogram tile until the logo file is supplied.
function Logo({ id, mark }: { id: string; mark: string }) {
  const [missing, setMissing] = useState(false)
  return (
    <span className={missing ? 'ab-logo' : 'ab-logo has-img'} aria-hidden="true">
      {missing ? mark : <img src={`${base}logos/${id}.png`} alt="" onError={() => setMissing(true)} />}
    </span>
  )
}

// The full stop after "ME": the home page's liquid blob in its merged,
// rounded shape, its colours slowly turning inside the outline. Colour fields blend inside the outline, film grain sits on top,
// and the mask softens the edge.
const ORB_PATH =
  'M175 250 C170 175 230 115 315 110 C400 105 470 150 480 230 C490 300 455 380 375 405 C300 428 210 400 185 335 C178 310 177 280 175 250 Z'

function Orb() {
  return (
    <svg className="ab-hero-dot" viewBox="60 40 530 460" aria-hidden="true">
      <defs>
        {/* Soft edge: the outline is blurred in the mask only, so the grain
            inside stays crisp. */}
        <filter id="ab-orb-edge" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <mask id="ab-orb-mask" maskUnits="userSpaceOnUse" x="60" y="40" width="530" height="460">
          <path d={ORB_PATH} fill="#fff" filter="url(#ab-orb-edge)" />
        </mask>
        <filter id="ab-orb-melt" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
        <filter id="ab-orb-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
        </filter>
      </defs>
      <g mask="url(#ab-orb-mask)">
        <rect x="60" y="40" width="530" height="460" fill="#c95ae6" />
        <g filter="url(#ab-orb-melt)" className="ab-dot-swirl">
          <circle cx="210" cy="190" r="105" fill="#ff7ec9" />
          <circle cx="420" cy="160" r="100" fill="#ff5fb8" />
          <circle cx="330" cy="290" r="95" fill="#b36bff" />
          <circle cx="180" cy="330" r="80" fill="#5f9dff" />
          <circle cx="480" cy="250" r="95" fill="#5b7cff" />
        </g>
        <rect x="60" y="40" width="530" height="460" filter="url(#ab-orb-grain)" style={{ mixBlendMode: 'overlay' }} />
      </g>
    </svg>
  )
}

export function About({ lang, backLabel }: { lang: Lang; backLabel: string }) {
  const a = about[lang]
  // Each half of the strip must be wider than the viewport, so short photo
  // sets repeat until a half holds at least six.
  const run = a.mentorship.photos
  const half = Array.from({ length: Math.max(6, run.length) }, (_, i) => run[i % run.length])
  const reveal = (d = 0) => ({ 'data-reveal': '', style: { '--d': d } as CSSProperties })

  return (
    <article className="ab">
      {/* Opening: "ABOUT ME." and the intro on the left, the portrait on the
          right revealed strip by strip. */}
      <section className="ab-hero" aria-labelledby="ab-hero-h">
        <div className="ab-hero-copy">
          <h1 id="ab-hero-h" className="ab-hero-title" lang="en">
            <span className="ab-hero-word">ABOUT</span>
            <span className="ab-hero-word is-second">
              ME
              <Orb />
            </span>
          </h1>
          <div className="ab-hero-text">
            <p>{a.intro.body[0]}</p>
            <p>{a.intro.body[1]}</p>
            <img className="ab-signature" src={`${base}signature.png`} alt="Hui-Hsuan" />
          </div>
        </div>
        <div className="ab-hero-photo" role="img" aria-label={a.intro.photoAlt}>
          {Array.from({ length: STRIPS }, (_, i) => (
            <span key={i} className="ab-strip-cell" style={{ '--i': i } as CSSProperties}>
              <img src={`${base}about-photo.jpg`} alt="" decoding="async" />
            </span>
          ))}
        </div>
      </section>

      <section className="ab-section" aria-labelledby="ab-skills">
        <h2 id="ab-skills" className="ab-h" lang="en" {...reveal()}>
          <Accent h={a.skills.heading} />
        </h2>
        <div className="ab-skills">
          {a.skills.groups.map((g, i) => (
            <div key={g.title} {...reveal(i)}>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="ab-section" aria-labelledby="ab-exp">
        <h2 id="ab-exp" className="ab-h" lang="en" {...reveal()}>
          <Accent h={a.experience.heading} />
        </h2>
        <ul className="ab-jobs" lang="en">
          {a.experience.jobs.map((j) => (
            <li key={j.company} {...reveal()}>
              <Logo id={j.logo} mark={j.mark} />
              <div>
                <p className="ab-job-title">
                  {j.role}
                  <span className="ab-sep" aria-hidden="true" />
                  <span className="ab-company">{j.company}</span>
                </p>
                <p className="ab-period">{j.period}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="ab-section" aria-labelledby="ab-edu">
        <h2 id="ab-edu" className="ab-h" lang="en" {...reveal()}>
          <Accent h={a.education.heading} />
        </h2>
        <ul className="ab-schools" lang="en">
          {a.education.schools.map((s) => (
            <li key={s.degree} {...reveal()}>
              <strong>{s.degree}</strong>
              <span>{s.school}</span>
              <span className="ab-period">{s.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ab-section ab-practice" aria-labelledby="ab-practice">
        {/* The statement on the left, the phone + city figure on the right. */}
        <div className="ab-practice-intro">
          <div>
            <h2 id="ab-practice" className="ab-statement" {...reveal()}>
              {a.practice.heading}
            </h2>
            <p className="ab-lead" {...reveal(1)}>
              {a.practice.body}
            </p>
          </div>
          <div className="ab-fig" lang="en" {...reveal(1)}>
            <Suspense fallback={<div className="ab-fig-hold" />}>
              <PhoneCity />
            </Suspense>
          </div>
        </div>

        <div className="ab-block">
          <h3 className="ab-sub" lang="en" {...reveal()}>
            <Accent h={a.workshop.heading} />
          </h3>
          <p className="ab-lead" {...reveal(1)}>
            {a.workshop.body}
          </p>
          <ul className="ab-events">
            {a.workshop.events.map((e, i) => (
              <li key={e.photo} {...reveal(i % 3)}>
                <Photo src={`${base}workshop/${e.photo}.jpg`} alt={e.title} pending={a.photoPending} />
                <p className="ab-event-title">{e.title}</p>
                <p className="ab-period">{e.period}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="ab-uxtw card" {...reveal()}>
          <div className="ab-uxtw-copy">
            <span className="ab-period">{a.uxtw.period}</span>
            <h3>{a.uxtw.title}</h3>
            <p>{a.uxtw.body}</p>
          </div>
          <Photo src={`${base}${a.uxtw.photo}.jpg`} alt={a.uxtw.title} pending={a.photoPending} />
        </div>

        <div className="ab-block">
          <h3 className="ab-sub" {...reveal()}>
            {a.mentorship.heading}
          </h3>
          <p className="ab-lead" {...reveal(1)}>
            {a.mentorship.body}
          </p>
        </div>
      </section>

      {/* Full-bleed strip that drifts sideways; two copies loop seamlessly. */}
      <div className="ab-strip" {...reveal()}>
        <div className="ab-strip-track">
          {[0, 1].map((copy) =>
            half.map((p, i) => (
              <Photo
                key={`${copy}-${i}`}
                src={`${base}mentorship/${p}.jpg`}
                alt={copy || i >= run.length ? '' : `${a.mentorship.heading} ${p}`}
                pending={a.photoPending}
              />
            )),
          )}
        </div>
      </div>

      <a className="cs-back cs-back-end" href="#work" lang="en">
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13 8H3M7 4L3 8l4 4" />
        </svg>
        {backLabel}
      </a>
    </article>
  )
}
