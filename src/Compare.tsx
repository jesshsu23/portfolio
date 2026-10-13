import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import type { Img } from './cases/vulcan'

const base = import.meta.env.BASE_URL

// Before / after comparison: the after image sits on top, clipped to the
// right of a draggable divider. Drag, click, or use the arrow keys.
export function Compare({ before, after, ratio }: { before: Img; after: Img; ratio: string }) {
  const [pos, setPos] = useState(50)
  const frame = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX)
  }
  const onUp = () => {
    dragging.current = false
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - step))
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + step))
    else if (e.key === 'Home') setPos(0)
    else if (e.key === 'End') setPos(100)
    else return
    e.preventDefault()
  }

  return (
    <figure className="cs-compare">
      <div
        ref={frame}
        className="cs-compare-frame"
        style={{ '--pos': `${pos}%`, aspectRatio: ratio } as CSSProperties}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <img className="cs-compare-before" src={base + before.src} alt={before.alt} draggable={false} />
        <img className="cs-compare-after" src={base + after.src} alt={after.alt} draggable={false} />
        <span className="cs-compare-tag is-before" lang="en">
          Before
        </span>
        <span className="cs-compare-tag is-after" lang="en">
          After
        </span>
        <div
          className="cs-compare-handle"
          role="slider"
          tabIndex={0}
          aria-label="Before / After"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`After ${Math.round(100 - pos)}%`}
          onKeyDown={onKey}
        >
          <span className="cs-compare-knob" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </figure>
  )
}
