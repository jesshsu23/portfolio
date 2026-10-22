// Builds a case in another language from the Chinese original: every string
// holding Chinese is swapped for its entry in `dict`, everything else (layout
// flags, image paths, English terms) is kept, so the layout lives in one place.

const CJK = /[㐀-鿿＀-￯]/

export function localize<T>(data: T, dict: Record<string, string>, name: string): T {
  const missing: string[] = []
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') {
      if (!CJK.test(v)) return v
      if (v in dict) return dict[v]
      missing.push(v)
      return v
    }
    if (Array.isArray(v)) return v.map(walk)
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
    return v
  }
  const out = walk(data) as T
  // Edited Chinese copy no longer matches its key; flag it while developing.
  if (import.meta.env.DEV && missing.length) console.warn(`[${name}] untranslated strings:`, missing)
  return out
}
