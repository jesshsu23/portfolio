# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: hiring managers, design leads, and recruiters at international (foreign-headquartered), remote-first companies evaluating a Senior Product Designer (UI/UX). They review the site asynchronously, often across time zones, usually while screening several candidates; they need to judge seniority, process, and impact quickly, then go deeper in a case study before or during an interview.

## Product Purpose
A personal portfolio that wins interviews for Senior Product Designer roles. Success means a reviewer understands within the first screen who the designer is and at what level they work, and finishes a case study convinced of their judgment, process, and outcomes.

## Positioning
Jess Hsu, Senior Product Designer, 8 years of experience. Core claim (from the designer's draft): 擅長拆解複雜情境，轉化為易用的設計 — breaks down complex situations and turns them into usable design. Every selected work sits in a technically dense, high-stakes domain (GenAI security and compliance, crypto yield, SaaS security testing); the designer confirmed this as the differentiator: making complex technical domains usable. The homepage must surface key highlights of personal strengths and differentiators, in the spirit of https://kat-wang.framer.website/. Confirmed homepage sections: What makes me different, and Testimonials / Talks & Writing (real content to be supplied by the designer). Target employers are domain-open.

## Operating Context
- Reviewed on desktop during screening; also opened on mobile from a recruiter message or LinkedIn link.
- Remote-first hiring: the portfolio must stand on its own without the designer present to narrate it.
- Bilingual (English and Traditional Chinese) with a language switch. English is the primary language because the target employers are international.

## Capabilities and Constraints
- Stack: existing React + TypeScript + Vite project, deployed to GitHub Pages (jesshsu23.github.io/portfolio) via GitHub Actions.
- Content scale: three selected works on the homepage: Vulcan (GenAI 安全、保障和合規工具 / GenAI safety, security and compliance tool), LazyOtter (加密貨幣收益聚合器 / crypto yield aggregator), Cymetrics (SaaS 資訊安全檢測平台 / SaaS security testing platform). Depth matters more than volume.
- Navigation: Work, About, Resume, language switch (中文 / English).
- Undecided: NDA handling (whether any case study needs password protection or redaction), contact channels (email, LinkedIn, résumé PDF), the designer's display name and bio.

## Brand Commitments
The overall impression must be professional, with award-level craft and a clear personal character; it must not read as AI-generated or templated. The designer delegated the visual direction.

## Evidence on Hand
- Homepage wireframe draft by the designer: hero (Hello, I'm Jess / 8年經驗 / Sr. Product Designer / tagline), About Me summary with 瞭解更多 link, Selected Works list of three image + text rows.
- Case study content and project images exist with the designer but are not yet in the repo.
- No testimonials, metrics, company names, or client logos have been provided. Do not invent any.
- Current repo content is the Vite starter template; none of it is portfolio content.

## Product Principles
1. Senior signal first: show judgment, trade-offs, and outcomes, not only screens.
2. Respect the reviewer's time: scannable at a glance, with depth available on demand.
3. Self-explanatory for asynchronous, remote review.
4. English-first, with Chinese as an equal-quality alternative, not a machine-translated afterthought.
5. Truthful: every claim, number, and name comes from the designer.

## Accessibility & Inclusion
As a UI/UX designer's portfolio, the site itself is evidence of craft: aim for WCAG 2.2 AA (contrast, keyboard navigation, alt text, reduced-motion support).
