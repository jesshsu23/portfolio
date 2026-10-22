import type { Lang } from '../content'
import { lazyotter } from './lazyotter'
import { lazyotterEn } from './lazyotter.en'
import { localize } from './localize'
import { vulcan, type CaseData } from './vulcan'
import { vulcanEn } from './vulcan.en'

export const cases: Record<string, Record<Lang, CaseData>> = {
  vulcan: { zh: vulcan, en: localize(vulcan, vulcanEn, 'vulcan') },
  lazyotter: { zh: lazyotter, en: localize(lazyotter, lazyotterEn, 'lazyotter') },
}
