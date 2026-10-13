import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { AlertProto } from './AlertProto'
import { Compare } from './Compare'
import { LoopVideo } from './LoopVideo'
import { StackPreview } from './StackPreview'
import { SiteMarquee } from './SiteMarquee'
import { UiKitMarquee } from './UiKitMarquee'
import type { Block, CaseData, Icon, Img, Section } from './cases/vulcan'

const base = import.meta.env.BASE_URL

// One stroke family for every tile icon, drawn on a 24px grid.
const ICONS: Record<Icon, ReactNode> = {
  shield: <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />,
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-5" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.8 13.5L7.5 21l4.5-2.5 4.5 2.5-1.3-7.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5s1.1-6.1 3.4-8.5z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  language: <path d="M4 6h9M8.5 4v2c0 4-2 7-4.5 8.5M6 10c1.2 2 3 3.5 5 4.5M13 20l3.5-8 3.5 8M14.2 17.3h4.6" />,
  scale: <path d="M12 4v16M7 20h10M5 7h14M5 7l-2.5 6a2.5 2.5 0 005 0L5 7zM19 7l-2.5 6a2.5 2.5 0 005 0L19 7z" />,
  layers: <path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8 12 3.5zM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" />,
  route: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 18H15a3 3 0 000-6H9a3 3 0 010-6h6.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 20c.7-3.4 3.3-5.5 6.5-5.5s5.8 2.1 6.5 5.5M16 5.2a3.5 3.5 0 010 6.6M18 14.8c1.8.7 3 2.6 3.5 5.2" />
    </>
  ),
  grid: <path d="M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z" />,
  code: <path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14" />,
  briefcase: <path d="M3.5 8h17v11h-17zM9 8V5.5h6V8M3.5 13h17" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
}

// Counts from `from` to `to` each time it scrolls into view, easing in and
// out over a second, as the reference's goal cards do.
function CountUp({ from, to }: { from: number; to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
    const run = () => {
      cancelAnimationFrame(frame)
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1000)
        el.textContent = String(Math.round(from + (to - from) * ease(t)))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) run()
        else {
          cancelAnimationFrame(frame)
          el.textContent = String(from)
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [from, to])
  // Rendered at the target so no-JS and reduced-motion readers see the result.
  return (
    <span ref={ref} className="cs-count">
      {to}
    </span>
  )
}

function Tile({ icon }: { icon: Icon }) {
  return (
    <span className="cs-tile" aria-hidden="true">
      <svg viewBox="0 0 24 24">{ICONS[icon]}</svg>
    </span>
  )
}

function Shot({ img }: { img: Img }) {
  return (
    <figure
      className="cs-shot"
      style={img.max ? { maxWidth: img.max, ...(img.alignEnd ? { justifySelf: 'end' } : null) } : undefined}
    >
      {img.static ? (
        <div className="cs-zoom is-static">
          <img src={base + img.src} alt={img.alt} loading="lazy" decoding="async" />
        </div>
      ) : (
        <a href={base + img.src} target="_blank" rel="noreferrer" className="cs-zoom">
          <img src={base + img.src} alt={img.alt} loading="lazy" decoding="async" />
        </a>
      )}
      {img.caption && <figcaption lang="en">{img.caption}</figcaption>}
    </figure>
  )
}

// Every image sits inside a padded dark card, as on the reference.
function Frame({ imgs, arrow }: { imgs: Img[]; arrow?: boolean }) {
  return (
    <div
      className={`cs-frame cs-frame-${imgs.length}${arrow ? ' has-arrow' : ''}${imgs.every((i) => i.bare) ? ' is-bare' : ''}${imgs.every((i) => i.panel) ? ' is-panel' : ''}${imgs.every((i) => i.square) ? ' is-square' : ''}${imgs.every((i) => i.soft) ? ' is-soft' : ''}`}
    >
      {imgs.map((img) => (
        <Shot key={img.src} img={img} />
      ))}
    </div>
  )
}

function Paragraphs({ body }: { body: string[] }) {
  return (
    <>
      {body.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </>
  )
}

function Check() {
  return (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  )
}

function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d+–\d+%)/).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}
    </>
  )
}

// A dark laptop drawn in CSS: lid with a thin bezel and camera notch, a soft
// glare across the glass, and a low deck with a front lip.
function Laptop({ img }: { img: Img }) {
  return (
    <figure className="xp-mac">
      <div className="xp-lid">
        <div className="xp-screen">
          <img src={base + img.src} alt={img.alt} loading="lazy" decoding="async" />
          <span className="xp-glare" aria-hidden="true" />
        </div>
        <span className="xp-notch" aria-hidden="true" />
      </div>
      <div className="xp-deck" aria-hidden="true">
        <span className="xp-lip" />
      </div>
      {img.caption && <figcaption lang="en">{img.caption}</figcaption>}
    </figure>
  )
}

function QuestionList({ groups, peek }: { groups: { title: string; items: string[] }[]; peek?: number }) {
  return (
    <>
      {groups.map((g, gi) => (
        <section key={g.title} className={peek !== undefined && gi > 0 ? 'is-hidden-peek' : undefined}>
          <h4>{g.title}</h4>
          <ol>
            {(peek !== undefined && gi === 0 ? g.items.slice(0, peek) : g.items).map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>
      ))}
    </>
  )
}

// Shows the first nine questions fading out; click opens the full sheet.
function Questions({ groups }: { groups: { title: string; items: string[] }[] }) {
  const dlg = useRef<HTMLDialogElement>(null)
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  return (
    <>
      <button type="button" className="cs-questions is-peek" onClick={() => dlg.current?.showModal()}>
        <QuestionList groups={groups} peek={9} />
        <span className="cs-questions-more">
          查看全部 {total} 題
          <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
          </svg>
        </span>
      </button>
      <dialog
        ref={dlg}
        className="cs-dialog"
        aria-label="訪談問題"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
      >
        <div className="cs-questions">
          <button type="button" className="cs-dialog-close" aria-label="關閉" onClick={() => dlg.current?.close()}>
            <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
          <QuestionList groups={groups} />
        </div>
      </dialog>
    </>
  )
}

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'text':
      return (
        <div className={`cs-text${b.full ? ' is-full' : ''}${b.center ? ' is-center' : ''}${b.rule ? ' has-rule' : ''}`}>
          {b.heading && <h3>{b.heading}</h3>}
          <Paragraphs body={b.body} />
          {b.list && (
            <ul className={b.accentList ? 'cs-list is-accent' : 'cs-list'}>
              {b.list.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )}
        </div>
      )
    case 'split':
      if (b.bodyAlign && b.heading) {
        // Heading sits above both columns' start, so the image lines up with the first paragraph.
        return (
          <div className={`cs-split is-body-align${b.rule ? ' has-rule' : ''}`}>
            <div className="cs-text cs-split-head">
              <h3>{b.heading}</h3>
            </div>
            <div className="cs-text cs-split-body">
              <Paragraphs body={b.body} />
            </div>
            <Frame imgs={[b.img]} />
          </div>
        )
      }
      return (
        <div className={`cs-split${b.wideText ? ' is-wide-text' : ''}${b.rule ? ' has-rule' : ''}`}>
          <div className="cs-text">
            {b.heading && <h3>{b.heading}</h3>}
            <Paragraphs body={b.body} />
          </div>
          <Frame imgs={[b.img]} />
        </div>
      )
    case 'splitQuestions':
      return (
        <div className="cs-split">
          <div className="cs-text">
            {b.heading && <h3>{b.heading}</h3>}
            <Paragraphs body={b.body} />
          </div>
          <Questions groups={b.groups} />
        </div>
      )
    case 'alerts':
      return <AlertProto label={b.label} />
    case 'site':
      return <SiteMarquee label={b.label} />
    case 'uikit':
      return <UiKitMarquee label={b.label} />
    case 'image':
      return <Frame imgs={[b.img]} />
    case 'video':
      return (
        <div className="cs-frame">
          <LoopVideo src={base + b.src} poster={base + b.poster} label={b.label} ratio={b.ratio} />
        </div>
      )
    case 'compare':
      return <Compare before={b.before} after={b.after} ratio={b.ratio} />
    case 'pair':
      return <Frame imgs={b.imgs} arrow={b.arrow} />
    case 'cards':
      if (b.stacked)
        return (
          <ol className="cs-card cs-stacked">
            {b.items.map((c, i) => (
              <li key={c.title}>
                <h3>
                  <span className="cs-stacked-no" lang="en">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span lang="en">{c.title}</span>
                </h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ol>
        )
      return (
        <ul className={b.note ? 'cs-cards is-note' : 'cs-cards'} style={{ '--cols': b.cols ?? 3 } as CSSProperties}>
          {b.items.map((c) => (
            <li key={c.title} className={b.note ? 'cs-note' : 'cs-card'}>
              {c.icon && <Tile icon={c.icon} />}
              <h3>{c.title}</h3>
              <p>
                <Emphasis text={c.body} />
              </p>
            </li>
          ))}
        </ul>
      )
    case 'points':
      return (
        <ol className="cs-points">
          {b.items.map((pt) => (
            <li key={pt.label} className="cs-card">
              <span className="cs-dot" lang="en">
                {pt.label}
              </span>
              <h3>{pt.title}</h3>
              <Paragraphs body={pt.body} />
              <div className="cs-point-shot">
                <Shot img={pt.img} />
              </div>
            </li>
          ))}
        </ol>
      )
    case 'steps':
      return (
        <div className="cs-steps">
          {b.title && <h3>{b.title}</h3>}
          <ol>
            {b.items.map((s, i) => (
              <li key={s} className="cs-card">
                <span className="cs-step-no" lang="en">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )
    case 'stack':
      return (
        <ol className="cs-stack" lang="en">
          {b.items.map((s, i) => (
            <li key={s.title} className="cs-card">
              <span className="cs-stack-no">{String(i + 1).padStart(2, '0')}</span>
              <h4>{s.title}</h4>
              <ul>
                {s.list.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <StackPreview index={i} />
            </li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <div className="cs-table cs-card">
          <table>
            <thead>
              <tr>
                {b.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>
                    <code lang="en">{r[2]}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'crossProduct':
      return (
        <div className="xp">
          <Laptop img={b.left} />
          <div className="xp-hub">
            <span className="xp-arrow is-left" aria-hidden="true" />
            <div className="xp-hub-card">
              <img src={base + 'works/vulcan/onesleeve-mark.png'} alt="" />
              <p lang="en">{b.hub}</p>
              <ul>
                {b.items.map((x) => (
                  <li key={x} lang="en">
                    <Check />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <span className="xp-arrow is-right" aria-hidden="true" />
          </div>
          <Laptop img={b.right} />
        </div>
      )
    case 'insight':
      return (
        <figure className="cs-insight">
          <figcaption>
            <span className="cs-insight-eyebrow">{b.eyebrow}</span>
            <h3>{b.title}</h3>
          </figcaption>
          <ul>
            {b.points.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <blockquote>{b.quote}</blockquote>
        </figure>
      )
    case 'lists':
      return (
        <div className="cs-lists">
          {b.cols.map((col) => (
            <div key={col.title} className={`cs-card cs-list-col is-${col.tone}`}>
              <h3>{col.title}</h3>
              <ul>
                {col.items.map((x) => (
                  <li key={x}>
                    <svg className="icon cs-dot-icon" viewBox="0 0 20 20" aria-hidden="true">
                      <circle cx="10" cy="10" r="9" />
                      {col.tone === 'yes' ? <path d="M6.3 10.3l2.5 2.5 4.9-5.3" /> : <path d="M8.1 6.8v6.4M11.9 6.8v6.4" />}
                    </svg>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    case 'palette':
      return (
        <div className="cs-palette">
          <div className="cs-text">
            {b.heading && <h3>{b.heading}</h3>}
            {b.body && <Paragraphs body={b.body} />}
          </div>
          {/* Colour blocks sized by weight, as in the draft: background,
              accent, brand navy, white. */}
          <ul className="cs-mosaic" aria-label="品牌色彩">
            {b.items.map((c) => (
              <li key={c.hex} style={{ background: c.hex }} aria-label={`${c.name} ${c.hex}：${c.role}`} />
            ))}
          </ul>
        </div>
      )
    case 'annotated':
      return (
        <div className={b.items.length > 2 ? 'cs-annotated is-long' : 'cs-annotated'}>
          <ol className="cs-annotations">
            {b.items.map((it, i) => (
              <li key={it.title}>
                <span className="cs-step-no" lang="en">
                  {(b.start ?? 1) + i}
                </span>
                <div>
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Frame imgs={[b.img]} />
        </div>
      )
    case 'flow':
      return (
        <ol className="cs-flow">
          {b.items.map((it) => (
            <li key={it.title} className="cs-card">
              {it.icon && <Tile icon={it.icon} />}
              <h3>{it.title}</h3>
              {it.body && <p>{it.body}</p>}
              {it.list && (
                <ul>
                  {it.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )
    case 'checks':
      return (
        <ul className="cs-checks">
          {b.items.map((c) => (
            <li key={c} className="pill">
              <Check />
              {c}
            </li>
          ))}
        </ul>
      )
  }
}

function SectionHead({ s }: { s: Section }) {
  if (s.headAlerts) {
    return (
      <div className="cs-section-head has-proto">
        {s.kicker && <span className="cs-kicker">{s.kicker}</span>}
        <div className="cs-split">
          <div className="cs-section-head-copy">
            <h2 id={`cs-${s.id}`}>{s.heading}</h2>
            {s.intro && <Paragraphs body={s.intro} />}
          </div>
          <AlertProto label={s.headAlerts} />
        </div>
      </div>
    )
  }
  if (s.headImg) {
    return (
      <div className="cs-section-head has-img">
        <div className="cs-section-head-copy">
          <h2 id={`cs-${s.id}`}>{s.heading}</h2>
          {s.intro && <Paragraphs body={s.intro} />}
        </div>
        <img className="cs-head-img" src={base + s.headImg.src} alt={s.headImg.alt} loading="lazy" decoding="async" />
      </div>
    )
  }
  return (
    <div className="cs-section-head">
      {s.tag && <span className="cs-tag">{s.tag}</span>}
      {s.kicker && <span className="cs-kicker">{s.kicker}</span>}
      <h2 id={`cs-${s.id}`} className={s.pill ? 'cs-chapter-pill' : undefined}>
        {s.heading}
      </h2>
      {s.intro && <Paragraphs body={s.intro} />}
    </div>
  )
}

function SectionView({ s, goals }: { s: Section; goals?: CaseData['goals'] }) {
  const blocks = s.blocks.map((b, i) => <BlockView key={i} b={b} />)
  const cls = ['cs-section']
  if (s.dark) cls.push('is-band', 'is-dark')
  if (s.chapter) cls.push(...(s.flat ? [] : ['is-band']), 'is-chapter')
  if (s.divider) cls.push('has-divider')
  if (s.roomy) cls.push('is-roomy')
  if (s.left) cls.push('is-left')
  if (s.bandHead) cls.push('is-band-head')
  if (s.bandCont) cls.push('is-band', 'is-band-cont')
  if (s.bandRule) cls.push('has-band-rule')
  if (s.wide) cls.push('is-wide')

  if (s.aside) {
    // The pinned heading stays beside the points only; whatever follows them
    // runs full width below, so the two columns never both carry text.
    const pts = s.blocks.findIndex((b) => b.kind === 'points')
    const split = pts === -1 ? blocks.length : pts + 1
    return (
      <section className={[...cls, 'is-aside'].join(' ')} aria-labelledby={`cs-${s.id}`}>
        {/* Own container, so the sticky heading is released where the cards end. */}
        <div className="cs-aside-grid">
          <div className="cs-aside-col">
            <SectionHead s={s} />
          </div>
          <div className="cs-main-col">{blocks.slice(0, split)}</div>
        </div>
        {split < blocks.length && <div className="cs-aside-after">{blocks.slice(split)}</div>}
      </section>
    )
  }

  if (s.id === 'goal' && goals) {
    return (
      <section className={cls.join(' ')} aria-labelledby={`cs-${s.id}`}>
        <div className="cs-goal">
          <div className="cs-goal-copy">
            <SectionHead s={s} />
            {blocks}
          </div>
          <dl className="cs-stats">
            {goals.map((g) => (
              <div key={g.label} className="cs-card">
                <dd>
                  <span className="cs-from">{g.from}</span>
                  <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                  <strong>
                    <CountUp from={Number(g.from)} to={parseInt(g.to, 10)} />
                    {g.to.replace(/^\d+/, '')}
                  </strong>
                </dd>
                <dt>{g.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
    )
  }

  return (
    <section className={cls.join(' ')} aria-labelledby={`cs-${s.id}`}>
      <SectionHead s={s} />
      {blocks}
    </section>
  )
}

export function CaseStudy({ c, backLabel }: { c: CaseData; backLabel: string }) {
  return (
    <article className="cs" lang="zh-Hant">
      <a className="cs-back" href="#work" lang="en">
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13 8H3M7 4L3 8l4 4" />
        </svg>
        {backLabel}
      </a>

      <header className="cs-head">
        <p className="cs-project" lang="en">
          {c.name}
        </p>
        <h1>{c.lede}</h1>
        <ul className="cs-tags">
          {c.tags.map((t) => (
            <li key={t} className="pill">
              {t}
            </li>
          ))}
        </ul>
      </header>

      {c.coverStage ? (
        <div className="cs-cover cs-stage">
          <span className="cs-stage-glow" aria-hidden="true" />
          <span className="cs-stage-grid" aria-hidden="true" />
          <img src={base + c.coverStage.src} alt={c.coverStage.alt} />
        </div>
      ) : (
        <div className="cs-cover">
          <img src={base + c.cover} alt={c.coverAlt} />
        </div>
      )}

      <dl className="cs-meta">
        {c.meta.map((m) => (
          <div key={m.label}>
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>

      <section className="cs-section has-divider" aria-labelledby="cs-bg">
        {c.context ? (
          <div className="cs-bg">
            <div className="cs-section-head">
              <h2 id="cs-bg">專案背景</h2>
              <Paragraphs body={c.background} />
            </div>
            <figure className="cs-bg-shot">
              <img src={base + c.context.src} alt={c.context.alt} loading="lazy" decoding="async" />
            </figure>
          </div>
        ) : (
          <div className="cs-section-head is-full">
            <h2 id="cs-bg">專案背景</h2>
            <Paragraphs body={c.background} />
          </div>
        )}

        {c.proofHeading && <h3 className="cs-proof-heading">{c.proofHeading}</h3>}

        <ul className="cs-proof">
          {c.proof.map((p) => (
            <li key={p.label} className="cs-card">
              {p.icon && <Tile icon={p.icon} />}
              {p.label && <span className="cs-proof-label">{p.label}</span>}
              <span className="cs-proof-figure">
                <strong lang={/^[ -~]+$/.test(p.figure) ? 'en' : undefined}>{p.figure}</strong>
                {p.unit && <span>{p.unit}</span>}
              </span>
              {p.caption && (
                <span
                  className={p.nowrap ? 'cs-proof-caption is-nowrap' : 'cs-proof-caption'}
                  lang={/^[ -~]+$/.test(p.caption) ? 'en' : undefined}
                >
                  {p.caption}
                </span>
              )}
            </li>
          ))}
        </ul>

        {c.partners && (
          <div className="cs-partners">
            <h3 lang="en">Public Cases &amp; Partnerships</h3>
            <ul>
              {c.partners.map((p) => (
                <li key={p} className="pill">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {c.sections.map((s) => (
        <SectionView key={s.id} s={s} goals={c.goals} />
      ))}

      <a className="cs-back cs-back-end" href="#work" lang="en">
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13 8H3M7 4L3 8l4 4" />
        </svg>
        {backLabel}
      </a>
    </article>
  )
}
