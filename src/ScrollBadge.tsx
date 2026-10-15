// Round "scroll down" badge: the words and a run of tick marks circle a
// down arrow, and the ring turns slowly clockwise. Links to the works.

const C = 60 // centre of the 120 × 120 viewBox
const R = 46 // radius the text sits on
const TEXT_DEG = 118 // arc the words take, starting at 9 o'clock
const GAP = 9 // degrees of air between the words and the ticks
const STEP = 7 // degrees between ticks

// Screen angles: 0 = 3 o'clock, increasing clockwise.
const ticks: number[] = []
for (let a = 180 + TEXT_DEG + GAP; a <= 540 - GAP + 0.01; a += STEP) ticks.push(a)

// Circle path starting at 9 o'clock, running clockwise over the top.
const ring = `M ${C - R} ${C} a ${R} ${R} 0 1 1 ${2 * R} 0 a ${R} ${R} 0 1 1 ${-2 * R} 0`

export function ScrollBadge({ label, href }: { label: string; href: string }) {
  return (
    <a className="scroll-badge" href={href} aria-label={label}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <g className="scroll-badge-ring">
          <path id="scroll-badge-path" d={ring} fill="none" />
          <text>
            <textPath href="#scroll-badge-path" textLength={(R * Math.PI * TEXT_DEG) / 180} lengthAdjust="spacing">
              SCROLL DOWN
            </textPath>
          </text>
          {ticks.map((a) => {
            const rad = (a * Math.PI) / 180
            const [x, y] = [Math.cos(rad), Math.sin(rad)]
            return (
              <line
                key={a}
                x1={C + x * (R + 0.5)}
                y1={C + y * (R + 0.5)}
                x2={C + x * (R + 7)}
                y2={C + y * (R + 7)}
              />
            )
          })}
        </g>
        <path className="scroll-badge-arrow" d="M60 38 V82 M48 70 L60 82 L72 70" />
      </svg>
    </a>
  )
}
