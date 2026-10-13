import { useEffect, useRef } from 'react'

// LazyOtter website screens as a tilted collage. Each row loops sideways,
// alternating direction (left, right, left, right); every row moves at the same
// pace, and the screens repeat so the motion never reverses.

const base = import.meta.env.BASE_URL + 'works/lazyotter/site/'

const ROWS: { dir: 'left' | 'right'; shots: string[] }[] = [
  { dir: 'left', shots: ['roadmap', 'works-01', 'community', 'vision'] },
  { dir: 'right', shots: ['hero', 'works-03', 'partners', 'works-02'] },
  { dir: 'left', shots: ['works-02', 'vision', 'roadmap', 'hero'] },
  { dir: 'right', shots: ['partners', 'works-01', 'community', 'works-03'] },
]

// The view travels one frame width in this many seconds, on every row.
const SECONDS_PER_FRAME = 460

export function SiteMarquee({ label }: { label: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const fig = ref.current
    if (!fig) return
    const sync = () => {
      const frame = fig.clientWidth
      if (!frame) return
      fig.querySelectorAll<HTMLElement>('.sm-track').forEach((t) => {
        t.style.animationDuration = `${(t.scrollWidth / 2 / frame) * SECONDS_PER_FRAME}s`
      })
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(fig)
    // Images change track widths as they load.
    fig.querySelectorAll('img').forEach((i) => i.addEventListener('load', sync))
    return () => ro.disconnect()
  }, [])

  return (
    <a
      href="https://lazyotter.finance/"
      target="_blank"
      rel="noreferrer"
      className="sm-link"
      aria-label={`${label}（開啟 LazyOtter 官網）`}
    >
    <figure ref={ref} className="sm">
      <div className="sm-stage">
        {ROWS.map((r, ri) => (
          <div key={ri} className="sm-row">
            <div className={`sm-track is-${r.dir}`}>
              {/* Two identical halves: shifting by exactly one half loops with no seam. */}
              {[0, 1].map((half) =>
                r.shots.map((s) => (
                  <img key={`${half}-${s}`} src={`${base}${s}.jpg`} alt="" loading="lazy" decoding="async" />
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </figure>
    </a>
  )
}
