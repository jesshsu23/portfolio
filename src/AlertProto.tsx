import { useEffect, useRef, useState } from 'react'

// LazyOtter post-deposit alert sign-up, rebuilt in code as a looping prototype:
// leave an email and confirm, enter the verification code and confirm, then
// the success screen. Coordinates follow the 955 × 803 design frames.

const EMAIL = 'text01@gmail.com'
const CODE = '482916'

type State = {
  screen: 0 | 1 | 2
  typed: number
  focus: boolean
  press: boolean
  cursor: [number, number]
}

const REST: [number, number] = [700, 380]
const INPUT: [number, number] = [520, 492]
const BUTTON = (screen: number): [number, number] => (screen === 0 ? [520, 672] : [520, 660])

const START: State = { screen: 0, typed: 0, focus: false, press: false, cursor: REST }

function Close() {
  return (
    <svg className="ap-close" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

function Field({ placeholder, value, focus }: { placeholder: string; value: string; focus: boolean }) {
  return (
    <div className="ap-input">
      {value ? <span className="ap-value">{value}</span> : !focus && <span className="ap-ph">{placeholder}</span>}
      {focus && <i className="ap-caret" />}
    </div>
  )
}

export function AlertProto({ label }: { label: string }) {
  const ref = useRef<HTMLElement>(null)
  const [s, setS] = useState<State>(START)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    // Scale the 955 × 803 design frame to fit the stage.
    const fit = () => {
      const k = Math.min((el.clientWidth * 0.88) / 955, (el.clientHeight * 0.8) / 803)
      el.style.setProperty('--k', String(k))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => {
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let alive = true
    const timers = new Set<number>()
    const wait = (ms: number) =>
      new Promise<void>((done, stop) => {
        const id = window.setTimeout(() => {
          timers.delete(id)
          if (alive) done()
          else stop()
        }, ms)
        timers.add(id)
      })
    const set = (p: Partial<State>) => alive && setS((v) => ({ ...v, ...p }))

    const fill = async (screen: 0 | 1, text: string) => {
      if (still) {
        set({ typed: text.length })
        await wait(1600)
        set({ screen: (screen + 1) as 1 | 2, typed: 0 })
        return
      }
      await wait(700)
      set({ cursor: INPUT })
      await wait(750)
      set({ focus: true })
      await wait(350)
      for (let i = 1; i <= text.length; i++) {
        set({ typed: i })
        await wait(screen === 0 ? 75 : 160)
      }
      await wait(450)
      set({ focus: false, cursor: BUTTON(screen) })
      await wait(800)
      set({ press: true })
      await wait(200)
      set({ press: false })
      await wait(220)
      set({ screen: (screen + 1) as 1 | 2, typed: 0, cursor: REST })
    }

    const run = async () => {
      for (;;) {
        set(START)
        await fill(0, EMAIL)
        await fill(1, CODE)
        await wait(still ? 3000 : 2800)
      }
    }
    run().catch(() => {})
    return () => {
      alive = false
      timers.forEach(clearTimeout)
      setS(START)
    }
  }, [visible])

  const email = s.screen === 0 ? EMAIL.slice(0, s.typed) : EMAIL
  const on = (n: number) => `ap-card${s.screen === n ? ' is-on' : ''}`

  return (
    <figure ref={ref} className="ap" role="img" aria-label={label} lang="en">
      <div className="ap-stage">
        <div className="ap-canvas">
          <section className={on(0)} aria-hidden="true">
            <Close />
            <h4 className="ap-title" style={{ top: 98 }}>Successful Deposit !</h4>
            <p className="ap-body" style={{ top: 246 }}>
              If you wish to be notified, please leave an
              <br />
              email
            </p>
            <div className="ap-slot" style={{ top: 444 }}>
              <Field placeholder="Enter your email address" value={email} focus={s.screen === 0 && s.focus} />
            </div>
            <div className={`ap-btn${s.screen === 0 && s.press ? ' is-press' : ''}`} style={{ top: 623 }}>
              Confirm
            </div>
          </section>

          <section className={on(1)} aria-hidden="true">
            <Close />
            <h4 className="ap-title" style={{ top: 98 }}>Verification code</h4>
            <p className="ap-body" style={{ top: 176 }}>
              Please go to your mailbox to receive the
              <br />
              verification code
            </p>
            <p className="ap-email" style={{ top: 318 }}>
              {EMAIL}
              <svg className="ap-pencil" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 4.5l4 4L8 20H4v-4L15.5 4.5z" />
              </svg>
            </p>
            <div className="ap-slot" style={{ top: 443 }}>
              <Field
                placeholder="Enter your verification code"
                value={s.screen === 1 ? CODE.slice(0, s.typed) : ''}
                focus={s.screen === 1 && s.focus}
              />
            </div>
            <div className={`ap-btn${s.screen === 1 && s.press ? ' is-press' : ''}`} style={{ top: 611 }}>
              Confirm
            </div>
          </section>

          <section className={on(2)} aria-hidden="true">
            <Close />
            <h4 className="ap-title" style={{ top: 98 }}>Sign up successful !</h4>
            <p className="ap-body" style={{ top: 236 }}>
              You will receive alert notifications on:
            </p>
            <p className="ap-email" style={{ top: 318 }}>
              {EMAIL}
            </p>
            <p className="ap-body" style={{ top: 522 }}>
              Also, you can receive alerts on telegram:
            </p>
            <div className="ap-btn" style={{ top: 611 }}>
              <svg className="ap-plane" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 2.5L1.8 10.4c-.8.3-.8 1.4 0 1.7l5 1.8 1.9 6.1c.2.7 1.1.9 1.6.4l2.8-2.6 5.1 3.8c.6.4 1.4.1 1.6-.6L23.2 3.6c.2-.8-.5-1.4-1.2-1.1zM9.5 14.2l-.6 4-1.4-4.9L18.3 6.6 9.5 14.2z" />
              </svg>
              Subscribe to risk alerts
            </div>
          </section>

          <svg
            className="ap-cursor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ left: s.cursor[0], top: s.cursor[1], opacity: s.screen === 2 ? 0 : 1 }}
          >
            <path d="M5 2.5v17.2l4.3-4.1 2.7 6.2 3-1.3-2.7-6.1h6z" />
          </svg>
        </div>
      </div>
    </figure>
  )
}
