// Miniature previews for the four OneSleeve layers, drawn in code so they stay
// crisp at any size. Each one shows what the layer is made of, not a screen.

const Search = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
)

function Foundations() {
  return (
    <div className="sp-grid sp-foundations">
      <span className="sp-swatch" style={{ background: '#f2c94c' }} />
      <span className="sp-swatch" style={{ background: '#0b0b0c', boxShadow: 'inset 0 0 0 1px #3a3a40' }} />
      <span className="sp-swatch" style={{ background: '#d9d6cf' }} />
      <span className="sp-type">Aa</span>
      <span className="sp-swatch" style={{ background: '#4a90e2' }} />
      <span className="sp-type is-small">Aa</span>
      <span className="sp-radius">
        <i style={{ borderRadius: 2 }} />
        <i style={{ borderRadius: 5 }} />
        <i style={{ borderRadius: 9 }} />
      </span>
    </div>
  )
}

function Basic() {
  return (
    <div className="sp-stack sp-basic">
      <div className="sp-row">
        <span className="sp-btn">Button</span>
        <span className="sp-input">Input</span>
      </div>
      <div className="sp-row">
        <span className="sp-check">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
        <span className="sp-select">
          <i />
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
        <span className="sp-tip">Tooltip</span>
      </div>
    </div>
  )
}

function Composite() {
  return (
    <div className="sp-composite">
      <div className="sp-tile sp-search">
        <i />
        <Search />
      </div>
      <div className="sp-tile sp-modal">
        <i className="is-short" />
        <i />
        <i />
        <b />
      </div>
      <div className="sp-tile sp-table">
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}

function Patterns() {
  return (
    <div className="sp-grid sp-patterns">
      <div className="sp-tile sp-search is-wide">
        <i />
        <Search />
      </div>
      <div className="sp-tile sp-icon">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
        </svg>
      </div>
      <div className="sp-tile sp-icon">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.5 9.5l2-5h7l2 5v3h-11zM2.5 9.5h3.5l.8 1.5h2.4l.8-1.5h3.5" />
        </svg>
      </div>
      <div className="sp-tile sp-error">
        <span>!</span>
        <i />
      </div>
      <div className="sp-tile sp-icon sp-spin">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2v2.5M8 11.5V14M2 8h2.5M11.5 8H14M3.8 3.8l1.8 1.8M10.4 10.4l1.8 1.8M3.8 12.2l1.8-1.8M10.4 5.6l1.8-1.8" />
        </svg>
      </div>
    </div>
  )
}

const PREVIEWS = [Foundations, Basic, Composite, Patterns]

export function StackPreview({ index }: { index: number }) {
  const P = PREVIEWS[index]
  return P ? (
    <div className="sp" aria-hidden="true">
      <P />
    </div>
  ) : null
}
