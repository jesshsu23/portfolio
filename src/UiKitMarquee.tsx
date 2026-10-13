import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// LazyOtter UI kit, rebuilt in code so each column can loop seamlessly.
// Columns alternate direction (up, down, up, ...); every column repeats its
// own components, so the motion never reverses and never runs out.

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Calendar({ mark }: { mark: 'selected' | 'hover' }) {
  const cells: (number | null)[] = [null, null, ...Array.from({ length: 31 }, (_, i) => i + 1)]
  return (
    <div className="uk-cal">
      <div className="uk-cal-head">
        <span>
          Mar 2022 <i className="uk-caret" />
        </span>
        <span className="uk-cal-nav">
          <svg viewBox="0 0 16 16">
            <path d="M10 3L5 8l5 5" />
          </svg>
          <svg viewBox="0 0 16 16">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </span>
      </div>
      <div className="uk-cal-grid">
        {DAYS.map((d) => (
          <span key={d} className="uk-cal-dow">
            {d}
          </span>
        ))}
        {cells.map((n, i) => (
          <span key={i} className={n === 19 ? `uk-cal-day is-${mark}` : 'uk-cal-day'}>
            {n ?? ''}
          </span>
        ))}
      </div>
    </div>
  )
}

function Field({ state, label, value, caption }: { state?: 'focus' | 'error' | 'disabled'; label?: string; value?: string; caption?: string }) {
  return (
    <div className="uk-field-wrap">
      {caption && <span className="uk-caption">{caption}</span>}
      <div className={`uk-field${state ? ` is-${state}` : ''}`}>
        {label && <span className="uk-field-label">{label}</span>}
        {value !== undefined && <span className="uk-field-value">{value}</span>}
      </div>
      {state === 'error' && <span className="uk-error">Error Message</span>}
    </div>
  )
}

function Buttons({ kinds }: { kinds: ('fill' | 'outline' | 'ghost' | 'link')[] }) {
  return (
    <div className="uk-btns">
      {(['default', 'hover', 'disabled'] as const).map((st) => (
        <div key={st} className="uk-btn-row">
          {kinds.map((k) => (
            <span key={k} className={`uk-btn is-${k} is-${st}`}>
              Small Button
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function Up() {
  return (
    <svg className="uk-chev" viewBox="0 0 16 16">
      <path d="M4 10l4-4 4 4" />
    </svg>
  )
}

function Sidebar({ mark }: { mark: 'hover' | 'active' }) {
  return (
    <div className="uk-side">
      <div className="uk-side-group">
        <b>Vault</b>
        <ul>
          <li>Vaults</li>
          <li>oPTP</li>
          <li>oJOE</li>
        </ul>
      </div>
      <div className="uk-side-group">
        <b>
          Will <Up />
        </b>
        <ul>
          <li>Owner</li>
          <li>Beneficiary</li>
          <li>Vaildator</li>
        </ul>
      </div>
      <div className="uk-side-item">Stake</div>
      <div className="uk-side-group">
        <b>
          Gauge <Up />
        </b>
        <ul>
          <li className={`is-${mark}`}>Gauge Result</li>
          <li>My Vote</li>
        </ul>
      </div>
      <hr />
      <div className="uk-side-item">Governance</div>
      <div className="uk-side-item">Doc</div>
      <div className="uk-side-social">
        {['M8 1a7 7 0 00-2.2 13.6c.3.1.5-.1.5-.3v-1.2c-2 .4-2.4-.9-2.4-.9-.3-.8-.8-1-.8-1-.6-.4.1-.4.1-.4.7 0 1.1.7 1.1.7.6 1.1 1.7.8 2.1.6 0-.5.2-.8.4-1-1.6-.2-3.2-.8-3.2-3.5 0-.8.3-1.4.7-1.9 0-.2-.3-.9.1-1.9 0 0 .6-.2 1.9.7a6.6 6.6 0 013.5 0c1.3-.9 1.9-.7 1.9-.7.4 1 .1 1.7.1 1.9.4.5.7 1.1.7 1.9 0 2.7-1.6 3.3-3.2 3.5.3.2.5.7.5 1.3v2c0 .2.2.4.5.3A7 7 0 008 1z',
          'M4.5 4.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm6 .3c1 0 1.7 1.4 1.7 3.2s-.8 3.2-1.7 3.2-1.7-1.4-1.7-3.2.8-3.2 1.7-3.2zm3.1.4c.3 0 .6 1.2.6 2.8s-.3 2.8-.6 2.8-.6-1.2-.6-2.8.3-2.8.6-2.8z',
          'M14.5 4.2c-.5.2-1 .4-1.5.4.6-.3 1-.9 1.2-1.5-.5.3-1.1.5-1.7.6a2.7 2.7 0 00-4.6 2.5 7.6 7.6 0 01-5.5-2.8 2.7 2.7 0 00.8 3.6c-.4 0-.9-.1-1.2-.3 0 1.3.9 2.4 2.1 2.6-.4.1-.8.1-1.2 0 .3 1.1 1.3 1.8 2.5 1.9A5.4 5.4 0 011.5 12.3 7.6 7.6 0 0013.2 5.9v-.3c.5-.4 1-.8 1.3-1.4z',
          'M13 3.3a12 12 0 00-3-1l-.4.8a11 11 0 00-3.2 0L6 2.3a12 12 0 00-3 1A12.6 12.6 0 00.9 11.7a12 12 0 003.7 1.9l.8-1.3-1.2-.6.3-.2a8.6 8.6 0 007.3 0l.3.2-1.2.6.8 1.3a12 12 0 003.7-1.9A12.5 12.5 0 0013 3.3zM5.6 9.9c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5zm4.8 0c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5z',
        ].map((d) => (
          <span key={d}>
            <svg viewBox="0 0 16 16">
              <path d={d} />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

const COLUMNS: { width: number; dir: 'up' | 'down'; items: ReactNode[] }[] = [
  { width: 21.6, dir: 'up', items: [<Calendar key="k1" mark="selected" />, <Calendar key="k2" mark="hover" />] },
  {
    width: 18.2,
    dir: 'down',
    items: [
      <Field key="k3" value="Input Label" />,
      <Field key="k4" caption="Focus" state="focus" label="Input Label" value="|" />,
      <Field key="k5" caption="Disabled" state="disabled" value="Input Label" />,
      <Buttons key="k6" kinds={['fill']} />,
      <Buttons key="k7" kinds={['outline']} />,
    ],
  },
  {
    width: 20.4,
    dir: 'up',
    items: [
      <Field key="k8" label="Input Label" value="PO-10352053" />,
      <Field key="k9" caption="Error" state="error" label="Input Label" value="PO-10352053" />,
      <div className="uk-warn-wrap" key="k10">
        <div className="uk-warn">Warning: You will receive oPTP at a 1:1 ratio. PTP conversions are irreversible. You can stake.</div>
        <span className="uk-caption">
          Token Deposited <i className="uk-info">i</i>
        </span>
      </div>,
      <Buttons key="k11" kinds={['ghost']} />,
      <Buttons key="k12" kinds={['link']} />,
    ],
  },
  { width: 13.6, dir: 'down', items: [<Sidebar key="k13" mark="hover" />] },
  { width: 13.6, dir: 'up', items: [<Sidebar key="k14" mark="active" />] },
]

// One shared speed for every column: the view travels one frame height in
// this many seconds. Each column's duration is derived from its own content
// height, so taller and shorter columns still move at the same pace.
const SECONDS_PER_FRAME = 200

export function UiKitMarquee({ label }: { label: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const fig = ref.current
    if (!fig) return
    const sync = () => {
      const frame = fig.clientHeight
      if (!frame) return
      fig.querySelectorAll<HTMLElement>('.uk-track').forEach((t) => {
        const half = t.scrollHeight / 2
        t.style.animationDuration = `${(half / frame) * SECONDS_PER_FRAME}s`
      })
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(fig)
    return () => ro.disconnect()
  }, [])

  return (
    <figure ref={ref} className="uk" role="img" aria-label={label} lang="en">
      <div className="uk-cols">
        {COLUMNS.map((c, ci) => (
          <div key={ci} className="uk-col" style={{ flexBasis: `${c.width}%` } as CSSProperties}>
            <div className={`uk-track is-${c.dir}`}>
              {/* Two identical halves: shifting by exactly one half loops with no seam. */}
              {[0, 1].map((half) => (
                <div key={half} className="uk-half" aria-hidden={half === 1 || undefined}>
                  {c.items.map((it, i) => (
                    <div key={i} className="uk-item">
                      {it}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}
