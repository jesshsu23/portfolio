import { CaseStudy } from './CaseStudy'
import { cases } from './cases'
import type { Lang } from './content'

// Lazy-loaded entry for #/work/<id>, kept out of the home page bundle.
export default function CaseRoute({ id, lang, backLabel }: { id: string; lang: Lang; backLabel: string }) {
  return <CaseStudy key={id} c={cases[id][lang]} lang={lang} backLabel={backLabel} />
}
