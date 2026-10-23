import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import { content, langNames, type Lang } from './content'
import { caseIds } from './cases/ids'
// Hero visual. GrainGradient (the earlier wave) stays in the repo to swap back.
import { LiquidBlob } from './LiquidBlob'
import { ScrollBadge } from './ScrollBadge'
import { About } from './About'
import './App.css'

const LANG_KEY = 'jh-lang'

// Case studies (components + copy) load on demand; home stays light.
const loadCaseRoute = () => import('./CaseRoute')
const CaseRoute = lazy(loadCaseRoute)

// Sections waiting on final copy. Flip to true once the text is ready.
const SHOW = { about: false, different: false, record: false, close: false }

function readLang(): Lang {
  const param = new URLSearchParams(location.search).get('lang')
  if (param === 'en' || param === 'zh') return param
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'en' || saved === 'zh') return saved
  } catch {
    // storage unavailable: fall through to the default
  }
  return 'en'
}

function ArrowRight() {
  return (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  )
}

function Globe() {
  return (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" />
      <path d="M1.75 8h12.5M8 1.75c1.7 1.8 2.5 3.9 2.5 6.25S9.7 12.45 8 14.25C6.3 12.45 5.5 10.35 5.5 8S6.3 3.55 8 1.75z" />
    </svg>
  )
}

function Accent({ h }: { h: [string, string] }) {
  return (
    <>
      {h[0]}
      <em className="serif">{h[1]}</em>
    </>
  )
}

function Chevron() {
  return (
    <svg className="icon chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 6l4.5 4.5L12.5 6" />
    </svg>
  )
}

function LangMenu({ lang, label, onChange }: { lang: Lang; label: string; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${label}: ${langNames[lang]}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Globe />
        <span className="lang-name">{langNames[lang]}</span>
        <Chevron />
      </button>
      {open && (
        <ul className="lang-menu">
          {(Object.keys(langNames) as Lang[]).map((l) => (
            <li key={l}>
              <button
                type="button"
                aria-current={l === lang}
                lang={l === 'zh' ? 'zh-Hant' : 'en'}
                onClick={() => {
                  onChange(l)
                  setOpen(false)
                }}
              >
                {langNames[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Entrance animation: elements marked data-reveal fade up out of a soft blur,
// on load for the hero and as they scroll into view for the rest.
function useReveal(key: string) {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}

// The masthead frosts over once the page has scrolled past the top.
function useScrolled(threshold = 120) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

// Case studies live at #/work/<id>, the About page at #/about; every other
// hash is an anchor on home.
const CASES = caseIds
const ABOUT = 'about'

function useRoute() {
  const read = () => {
    if (/^#\/about\/?$/.test(location.hash)) return ABOUT
    const m = location.hash.match(/^#\/work\/([\w-]+)/)
    return m && CASES.includes(m[1]) ? m[1] : null
  }
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onHash = () => {
      const next = read()
      setRoute(next)
      if (next) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else {
        // Wait for home to render, then honour the anchor.
        requestAnimationFrame(() => {
          const id = location.hash.slice(1)
          const el = id && document.getElementById(id)
          if (el) el.scrollIntoView()
          else window.scrollTo({ top: 0, behavior: 'instant' })
        })
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

function App() {
  const [lang, setLang] = useState<Lang>(readLang)
  const t = content[lang]
  const route = useRoute()
  useReveal(`${lang}-${route}`)
  const scrolled = useScrolled()

  // Warm the case study chunk once home is idle, so opening one feels instant.
  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500))
    ric(() => void loadCaseRoute())
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en'
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      // not persisted; the menu still works for this visit
    }
  }, [lang])

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className={scrolled ? 'masthead is-scrolled' : 'masthead'}>
        <div className="masthead-inner">
          <a className="wordmark" href="#top" lang="en">
            Jess Hsu
          </a>
          <nav className="nav" aria-label="Primary" lang="en">
            <a href="#work">{t.nav.work}</a>
            <a href="#/about" aria-current={route === ABOUT ? 'page' : undefined}>
              {t.nav.about}
            </a>
            <a href={`${import.meta.env.BASE_URL}resume-${lang}.pdf`} target="_blank" rel="noreferrer">
              {t.nav.resume}
            </a>
          </nav>
          <LangMenu lang={lang} label={t.langLabel} onChange={setLang} />
        </div>
      </header>

      {route === ABOUT ? (
        <main id="main" className="page">
          <About lang={lang} backLabel={t.works.back} />
        </main>
      ) : route ? (
        <main id="main" className="page">
          <Suspense fallback={null}>
            <CaseRoute id={route} lang={lang} backLabel={t.works.back} />
          </Suspense>
        </main>
      ) : (
      <main id="main" className="page">
        <section className="hero" id="top" aria-labelledby="greeting">
          <div className="hero-glow is-blob" aria-hidden="true">
            <LiquidBlob />
          </div>
          <div className="hero-copy">
            <h1 id="greeting" className="greeting" lang="en" data-reveal style={{ '--d': 1 } as CSSProperties}>
              {t.hero.greeting[0]}
              <strong className="greeting-name">{t.hero.greeting[1]}</strong>
            </h1>
            <p className="role" data-reveal style={{ '--d': 2 } as CSSProperties}>
              <span className="experience">{t.hero.experience}</span>
              <span className="role-title" lang="en">{t.hero.role}</span>
            </p>
            <p className="tagline" data-reveal style={{ '--d': 3 } as CSSProperties}>
              {t.hero.tagline.map((seg, i) =>
                typeof seg === 'string' ? seg : <strong key={i}>{seg.em}</strong>,
              )}
            </p>
            <div className="scroll-badge-wrap" data-reveal style={{ '--d': 4 } as CSSProperties}>
              <ScrollBadge label="Scroll down to selected works" href="#work" />
            </div>
          </div>
        </section>

        {SHOW.about && (
          <section className="about card" id="about" aria-labelledby="about-h">
            <h2 id="about-h" className="card-h">
              <Accent h={t.about.heading} />
            </h2>
            <p>{t.about.body}</p>
            <a className="button is-pending" href="#about" aria-disabled="true">
              {t.about.more}
            </a>
          </section>
        )}

        <section className="works" id="work" aria-labelledby="work-h">
          <h2 id="work-h" className="section-h" lang="en" data-reveal>
            <Accent h={t.works.heading} />
          </h2>
          <ul className="work-list">
            {t.works.items.map((w) => (
              <li className={w.href ? 'work card is-link' : 'work card'} key={w.id} data-reveal>
                <div className="work-image">
                  <img
                    className="work-media"
                    src={`${import.meta.env.BASE_URL}works/${w.id}.webp`}
                    alt={`${w.name} ${t.works.imageAlt}`}
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Case study not yet published: the cover sits behind frosted glass. */}
                  {w.id === 'cymetrics' && <span className="work-glass" aria-hidden="true" />}
                </div>
                <div className="work-copy">
                  <span className="work-period">{w.period}</span>
                  <h3 lang="en">
                    {w.href ? (
                      <a className="work-link" href={w.href}>
                        {w.name}
                      </a>
                    ) : (
                      w.name
                    )}
                  </h3>
                  <p>{w.summary}</p>
                  <div className="work-foot">
                    {/* Decorative on a linked card (the stretched title link covers it);
                        without a link it shows the disabled state. */}
                    <span className={w.href ? 'see-more' : 'see-more is-disabled'} aria-hidden={w.href ? true : undefined}>
                      <span className="see-more-circle" aria-hidden="true">
                        <ArrowRight />
                      </span>
                      <span className="see-more-text">{w.href ? t.works.open : t.works.status}</span>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {SHOW.different && (
          <section className="different card" aria-labelledby="diff-h">
            <h2 id="diff-h" className="section-h">
              <Accent h={t.different.heading} />
            </h2>
            <ol className="strengths">
              {t.different.items.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {SHOW.record && (
          <section className="record" aria-labelledby="record-h">
            <h2 id="record-h" className="section-h">
              <Accent h={t.record.heading} />
            </h2>
            <p className="section-sub">{t.record.note}</p>
            <ul className="quotes">
              {t.record.items.map((r, i) => (
                <li className="quote card" key={i} role="img" aria-label={`${r.label}: ${t.record.withheld}`}>
                  <svg className="quote-mark" viewBox="0 0 48 32" aria-hidden="true">
                    <path d="M0 32V19.5C0 8.6 5.2 2.1 15.5 0l2 4.3C11.6 6 8.6 9.6 8.4 15H17v17H0zm27 0V19.5C27 8.6 32.2 2.1 42.5 0l2 4.3C38.6 6 35.6 9.6 35.4 15H44v17H27z" />
                  </svg>
                  <span className="lines">
                    <span />
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="byline">
                    <span className="avatar" />
                    <span className="lines lines-short">
                      <span />
                      <span />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {SHOW.close && (
          <section className="close" aria-labelledby="close-h">
            <h2 id="close-h">
              <Accent h={t.close.heading} />
            </h2>
            <p>{t.close.body}</p>
            <p className="close-pending">{t.close.pending}</p>
          </section>
        )}
      </main>
      )}

      <footer className="foot" lang="en">
        <span>© 2026 Jess Hsu</span>
      </footer>
    </>
  )
}

export default App
