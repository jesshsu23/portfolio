import { CaseStudy } from './CaseStudy'
import { cases } from './cases'

// Lazy-loaded entry for #/work/<id>, kept out of the home page bundle.
export default function CaseRoute({ id, backLabel }: { id: string; backLabel: string }) {
  return <CaseStudy key={id} c={cases[id]} backLabel={backLabel} />
}
