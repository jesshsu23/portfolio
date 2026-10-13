import { useEffect, useRef } from 'react'

// Muted, looping screen recording that plays only while on screen, as the
// reference portfolio does. Reduced-motion visitors get the poster frame.
export function LoopVideo({ src, poster, label, ratio }: { src: string; poster: string; label: string; ratio: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <figure className="cs-video">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        style={{ aspectRatio: ratio }}
      />
      <figcaption>{label}</figcaption>
    </figure>
  )
}
