// Vulcan case study, transcribed from the designer's draft (2026-10-04).
// Copy is the designer's own; Traditional Chinese only for now.

export type Img = { src: string; alt: string; caption?: string; light?: boolean; max?: number; static?: boolean; bare?: boolean; square?: boolean; soft?: boolean; alignEnd?: boolean; panel?: boolean }

export type Icon =
  | 'shield' | 'check' | 'award' | 'globe' | 'eye' | 'language' | 'scale'
  | 'layers' | 'route' | 'users' | 'grid' | 'code' | 'briefcase' | 'search'

export type Block =
  | { kind: 'text'; heading?: string; body: string[]; list?: string[]; full?: boolean; center?: boolean; accentList?: boolean; rule?: boolean }
  | { kind: 'split'; heading?: string; body: string[]; list?: string[]; img: Img; wideText?: boolean; rule?: boolean; bodyAlign?: boolean }
  | { kind: 'splitQuestions'; heading?: string; body: string[]; groups: { title: string; items: string[] }[] }
  | { kind: 'image'; img: Img }
  | { kind: 'uikit'; label: string }
  | { kind: 'site'; label: string }
  | { kind: 'alerts'; label: string }
  | { kind: 'video'; src: string; poster: string; label: string; ratio: string }
  | { kind: 'compare'; before: Img; after: Img; ratio: string }
  | { kind: 'pair'; imgs: [Img, Img]; arrow?: boolean }
  | { kind: 'cards'; items: { title: string; body: string; icon?: Icon }[]; cols?: 2 | 3 | 4; note?: boolean; stacked?: boolean }
  | { kind: 'points'; items: { label: string; title: string; body: string[]; img: Img }[] }
  | { kind: 'steps'; title?: string; items: string[] }
  | { kind: 'stack'; items: { title: string; list: string[] }[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'checks'; items: string[] }
  | { kind: 'crossProduct'; left: Img; right: Img; hub: string; items: string[] }
  | { kind: 'insight'; eyebrow: string; title: string; points: string[]; quote: string }
  | { kind: 'lists'; cols: { title: string; tone: 'yes' | 'later'; items: string[] }[] }
  | { kind: 'palette'; heading?: string; body?: string[]; items: { hex: string; name: string; role: string }[] }
  | { kind: 'annotated'; items: { title: string; body: string }[]; img: Img; start?: number }
  | { kind: 'flow'; items: { title: string; body?: string; list?: string[]; icon?: Icon }[] }

export type Section = {
  id: string
  heading: string
  intro?: string[]
  blocks: Block[]
  dark?: boolean
  // White pill above the heading, as on the reference's design items.
  tag?: string
  // Centred heading on a tinted band: opens a chapter of the story.
  chapter?: boolean
  // Heading and intro stay pinned on the left while blocks scroll on the right.
  aside?: boolean
  // Hairline above the section, separating sibling design items.
  divider?: boolean
  // Chapter heading set as a quiet dark pill instead of a large title.
  pill?: boolean
  // Chapter head aligned left instead of centred.
  left?: boolean
  // Chapter without the tinted band (sits on the page black).
  flat?: boolean
  // Small grey label above the heading (e.g. the page this item covers).
  kicker?: string
  // Chapter head that opens a band continued by the following sections.
  bandHead?: boolean
  // Continues the previous section's tinted band without a gap.
  bandCont?: boolean
  // Hairline between consecutive items inside a continued band.
  bandRule?: boolean
  // Image set beside the heading and intro; the head then reads left-aligned.
  headImg?: { src: string; alt: string }
  // Alert sign-up prototype beside the heading and intro, its frame level with the heading.
  headAlerts?: string
  // Intro copy runs the full content width.
  wide?: boolean
  // Wider spacing between the blocks of a long, multi-part section.
  roomy?: boolean
}

export type Proof = { icon?: Icon; label: string; figure: string; unit: string; caption: string; nowrap?: boolean }

export type CaseData = {
  id: string
  name: string
  lede: string
  tags: string[]
  cover: string
  coverAlt: string
  // Device mockup floated over a glowing stage instead of a photo cover.
  coverStage?: { src: string; alt: string }
  meta: { label: string; value: string }[]
  background: string[]
  context?: { src: string; alt: string }
  proofHeading?: string
  proof: Proof[]
  goals?: { label: string; from: string; to: string }[]
  sections: Section[]
}

const I = (name: string, alt: string, extra: Partial<Img> = {}): Img => ({
  src: `works/vulcan/${name}.jpg`,
  alt,
  ...extra,
})

export const vulcan: CaseData = {
  id: 'vulcan',
  name: 'Vulcan',
  lede: '讓複雜的生成式 AI 風險更容易理解，幫助團隊及早辨識、有效處理',
  tags: ['企業級 B2B SaaS', '生成式 AI 安全'],
  cover: 'works/vulcan-cover.jpg',
  coverAlt: 'Vulcan 產品介面展示',
  context: { src: 'works/vulcan/context.jpg', alt: '資安人員在筆電上檢視 Vulcan 資產關聯與風險偵測畫面' },
  meta: [
    { label: '專案期間', value: '2025 年至今' },
    { label: '合作對象', value: '產品經理團隊、工程師團隊、產品設計師' },
    { label: '我的角色', value: '資深產品設計師／設計系統主導者' },
    { label: '負責範圍', value: '優化產品體驗、規劃操作流程、設計策略、設計系統基礎' },
  ],
  background: [
    '隨著 GenAI 進入金融、製造、電信等高監管產業，提示詞注入、資料外洩、模型幻覺與不當輸出，成為傳統資安工具難以處理的新風險。Vulcan 透過 Vulcan Attack 的上線前弱點評估，以及 Vulcan Protect 的上線後即時防護，建立涵蓋 AI 應用生命週期的安全機制。',
    '產品同時支援 SaaS 自助操作與資安顧問導入：企業可以自行建立專案、執行紅隊測試並取得報告，也能由專家依實際應用情境規劃檢測範圍。這使產品必須同時服務不同專業程度、操作目的與組織角色的使用者。',
  ],
  proof: [
    { icon: 'shield', label: '技術可信度', figure: 'I889636', unit: '', caption: '台灣發明專利' },
    { icon: 'check', label: '國際場域驗證', figure: '30,000', unit: '筆', caption: 'Vulcan Protect 實場測試' },
    { icon: 'award', label: '產業認可', figure: '第二名', unit: '資安組', caption: '2026 Nexus Luxembourg', nowrap: true },
    { icon: 'globe', label: '跨市場採用', figure: '21', unit: '家企業與專案', caption: '橫跨 4 個市場：台灣、新加坡、泰國、香港' },
  ],
  sections: [
    {
      id: 'pain',
      divider: true,
      heading: 'AI 安全測試的使用者痛點',
      blocks: [
        {
          kind: 'cards',
          cols: 3,
          items: [
            { icon: 'eye', title: '新型 AI 風險難以被看見', body: '傳統資安工具難以涵蓋提示詞注入、資料外洩與不當輸出等模型風險。' },
            { icon: 'language', title: '在地語境與持續防護不足', body: '企業缺乏能理解多語情境，並隨模型與攻擊變化持續監控的防護能力。' },
            { icon: 'scale', title: '風險難以轉化為治理決策', body: '資安、AI 與法遵團隊缺乏共同依據，難以判斷風險、安排修復與決定是否上線。' },
          ],
        },
      ],
    },
    {
      id: 'goal',
      heading: '商業目標',
      blocks: [
        {
          kind: 'text',
          body: [
            'Vulcan 原先以專案形式提供服務，導入與操作高度依賴資安專家，難以支援更多企業與不同市場。',
            '我們的設計目標，是將複雜的政策、測試策略、端點設定、結果判讀與重測流程，重新整理為清楚且可自行完成的操作體驗，降低學習與溝通成本，同時統一 Attack 與 Protect 的資訊架構、互動模式與回饋機制，讓使用者能更快完成測試、掌握高風險問題並採取行動，也為新模組、多語系及跨市場擴充建立可重複使用的產品基礎，協助 Vulcan 從 PoC 驗證走向可規模化導入的企業級 SaaS。',
          ],
        },
      ],
    },
    {
      id: 'challenge',
      divider: true,
      heading: '設計挑戰',
      blocks: [
        {
          kind: 'cards',
          note: true,
          cols: 4,
          items: [
            { title: '複雜資訊的分層與轉譯', body: '測試結果同時包含模型、攻擊手法、風險等級、技術證據與修復建議。設計需要讓不同專業程度的使用者快速掌握重點，並找到下一步行動。' },
            { title: '多條件流程的引導與回饋', body: '使用者必須依序完成政策、測試策略、模型端點與專案設定。設計需要清楚呈現前置條件、當前進度與異常狀態，避免使用者設定錯誤或不知道下一步。' },
            { title: '跨角色協作與結果追蹤', body: 'AI、資安、法遵與產品團隊關注的資訊不同。設計需要支援權限、檢視、修復與重測流程，讓風險證據與處理進度能被持續追蹤。' },
            { title: '快速擴張下的產品一致性', body: 'Vulcan 計畫拓展亞太與中東市場，服務超過 30 家企業。設計需以一致且可延展的架構支援多語與產業需求，並降低在地化與功能擴充成本。' },
          ],
        },
      ],
    },
    {
      id: 'decision',
      heading: '設計決策',
      blocks: [
        {
          kind: 'text',
          heading: '以雙軌方式建立可規模化的體驗基礎',
          full: true,
          body: [
            '面對高資訊密度、複雜的設定與系統狀態、多角色協作，以及跨市場擴張帶來的一致性需求，我們意識到，僅逐頁改善流程與介面，無法長期支撐產品成長。',
            '因此，我們決定採取雙軌設計：在優化 Vulcan 核心流程與互動細節的同時，同步建立 OneSleeve Design System，並將共用模式逐步應用至 Cymetrics 等公司其他產品。',
            'OneSleeve 不只是元件庫，而是將產品設計中反覆出現的資訊架構、互動模式與系統回饋，沉澱為跨產品可複用的規則。產品情境持續驗證並完善 Design System，系統規範則反過來支援新功能與其他產品，降低重複設計及實作差異，為跨產品、跨語言與跨市場發展建立一致且可擴充的基礎。',
          ],
        },
        { kind: 'image', img: I('approach', '設計方法圖：整合產品、資安、工程與商業需求，經需求轉譯後分為流程與互動設計、設計系統化兩軌，形成可落地且可擴充的產品體驗，並透過跨團隊校準持續對齊', { static: true }) },
      ],
    },
    {
      id: 'research',
      heading: '使用者研究',
      chapter: true,
      pill: true,
      blocks: [
        {
          kind: 'text',
          heading: '主要用戶',
          center: true,
          body: ['導入或開發生成式 AI 應用的中大型企業及公部門單位，特別聚焦以下高監管、高風險產業：'],
          list: [
            '金融與保險業：銀行、證券、保險公司導入 AI Copilot、客服助理或智能授信系統。',
            '製造與科技業：半導體、電子業使用 AI 於內部流程與客戶互動場景，需防範資料外洩。',
            '電信與雲端服務商：導入 GenAI 於客服與智能網管系統，需保障資料隱私與法遵。',
            '政府與研究機構：建置 AI 平台與生成式服務時，需符合 AI 法案與安全稽核要求。',
          ],
        },
        { kind: 'image', img: I('persona', '主要用戶：企業 AI 安全與治理負責人，任職於導入生成式 AI 的中大型企業與公部門。關心哪裡不安全、該先修什麼、是否能夠上線', { static: true, panel: true }) },
        {
          kind: 'text',
          heading: '使用情境',
          body: ['我們先以典型工作流程設計了第一版的測試流程，並再根據內部團隊測試，改善優化檢視設定 AI 攻擊測試、執行評測與查看結果的操作流程，並依據回饋調整設計，讓測試對象、設定與結果之間的關係更清楚。'],
        },
        { kind: 'steps', title: '典型工作流程', items: ['定義範圍', '執行測試', '判讀風險', '推動修復', '上線決策'] },
        {
          kind: 'text',
          heading: '使用者旅程圖',
          body: ['特定用戶為負責 AI 安全評測的工程師／資安人員：客服 AI 上線前，需要安排安全測試並確認風險，目標是針對正確的 AI 與風險範圍完成評測，取得可追溯的結果。'],
        },
        { kind: 'image', img: I('journey', '使用者旅程圖：確認評測對象、規劃測試內容、確認並執行測試、解讀與追蹤結果四個階段的使用者行為、心中疑問與潛在痛點，以及機會與預期價值', { static: true, panel: true }) },
      ],
    },
    {
      id: 'p1',
      wide: true,
      tag: '設計項目 1',
      roomy: true,
      heading: '改善設定測試',
      intro: ['舊版以專案為操作起點，使用者需要在測試對象清單與策略頁面之間確認設定關係；新版則讓使用者從指定的 AI 資產出發，直接查看或建立對應的測試設定，讓「正在測試哪個 AI」與「使用哪些設定」的關係更清楚。'],
      blocks: [
        { kind: 'compare', ratio: '3495 / 2206', before: I('p1-before', '舊版：以專案為起點的專案詳情頁，Endpoint 與 Policy 分列在不同表格'), after: I('p1-after', '新版：從 AI 資產出發，在資產側邊面板直接查看與建立對應的安全設定檔') },
      ],
    },
    {
      id: 'p2',
      wide: true,
      tag: '設計項目 2',
      roomy: true,
      divider: true,
      heading: '優化測試結果的呈現方式',
      intro: ['舊版摘要側欄優先呈現測試結果與歷次變化，方便快速瀏覽評測表現。新版詳情頁則依照「確認背景、掌握結果、定位風險、追查案例」安排資訊：先呈現測試對象與設定，再提供整體摘要、風險分布及個別案例，讓使用者由概覽逐步深入，同時保留解讀結果所需的背景。'],
      blocks: [
        { kind: 'compare', ratio: '1304 / 1308', before: I('p2-before', '舊版：評測清單旁的摘要側欄，優先呈現測試結果與歷次 ASR 變化'), after: I('p2-after', '新版：評測詳情頁依序呈現測試對象與設定、整體摘要、依威脅分布的失敗案例與案例清單') },
      ],
    },
    {
      id: 'rules',
      divider: true,
      aside: true,
      heading: '把複雜的防護規則，整理成清楚的設定步驟',
      intro: [
        '當團隊替客服 AI 設定防護時，需要決定要偵測哪些風險，以及偵測後如何處理內容。例如，遇到敏感資料時，輸入與輸出可能需要不同的處理方式。',
        '我將設定依威脅分類、輸入與輸出、內容處理方式分組，讓使用者先找到要處理的風險，再逐步調整對應規則。',
      ],
      blocks: [
        { kind: 'image', img: I('rules-overview', '防護規則設定頁全貌', { max: 520 }) },
        {
          kind: 'points',
          items: [
            { label: '01', title: '依威脅分類，聚焦當下要設定的風險', body: ['透過左側的威脅分類，讓使用者找到需要調整的項目，並在右側查看對應設定。將分類與設定內容並列，讓使用者在調整規則時，仍能確認目前處理的是哪一種風險。'], img: I('rules-index', '威脅分類索引', { max: 280 }) },
            { label: '02', title: '分開設定輸入與輸出，保留不同的防護需求', body: ['送進 AI 的資料與 AI 回傳的回答，可能需要不同的防護方式。因此，我將 Input 與 Output 設定分開，讓使用者針對同一種威脅，分別調整判定門檻與系統回應，並依適用條件設定內容處理方式。', '文字內容可選擇不處理、移除、替換或遮罩；選擇替換或遮罩時，再設定替換值、遮罩字元等細節。白名單則提供特定內容的例外設定。', '兩側維持一致的欄位結構，方便理解與對照；當防護需求相同時，也能透過 Copy from Input／Output 沿用設定，減少重複填寫。'], img: I('rules-io', '輸入與輸出分欄設定') },
            { label: '03', title: '讓設定可以複用，也讓例外清楚可見', body: ['提供子分類同步設定，方便使用者套用共通規則。同時，針對不支援特定處理方式的威脅，說明同步後會採用的替代方式，讓使用者在儲存前理解設定的影響。'], img: I('rules-sync', '開啟子分類同步後的設定狀態') },
          ],
        },
        { kind: 'text', heading: '保留設定彈性，也讓每個決定更容易理解', body: ['輸入與輸出可能有不同的防護需求，因此我保留兩側獨立設定，但使用相同的欄位結構，方便對照。當規則一致時，使用者可以直接複製設定，或同步到子分類。', '同步也有例外。部分威脅不支援特定處理方式，因此介面會說明同步後採用的替代方式，讓使用者在套用前知道哪些設定會改變。'] },
        { kind: 'checks', items: ['分類清楚', '設定可複用', '例外可理解'] },
      ],
    },
    {
      id: 'roles',
      wide: true,
      tag: '設計項目 3',
      divider: true,
      roomy: true,
      heading: '讓不同角色，在合適的範圍內協作',
      intro: ['AI 安全管理涉及工程、法遵與管理等不同團隊。我們透過角色權限管理（RBAC），區分使用者可存取的組織範圍與可執行的操作，並將這些差異反映在導覽與操作入口，協助使用者辨認目前的工作範圍。'],
      blocks: [
        {
          kind: 'cards',
          cols: 3,
          items: [
            { icon: 'code', title: 'AI／ML 工程師', body: '設定與執行測試，追查問題並驗證修正。' },
            { icon: 'scale', title: '法遵／風險人員', body: '檢視風險與評測紀錄，確認治理要求。' },
            { icon: 'briefcase', title: '產品與管理者', body: '掌握安全狀態，協調改善優先順序。' },
          ],
        },
        { kind: 'split', heading: '權限架構：管理範圍 × 角色權限', body: ['我們將存取範圍與角色權限分開規劃，並區分管理設定與產品操作兩種情境。使用者切換群組或組織時，選單會對應目前範圍呈現管理項目；同一範圍內，再依角色區分設定入口與唯讀限制，讓使用者更清楚知道自己正在管理哪裡，以及可以進行哪些操作。'], img: I('permissions', '權限架構圖：服務商層、公司層、公司部門層的管理後台與產品平台權限，以及 Group 與 Service Provider 的關聯範圍', { static: true, bare: true }) },
        { kind: 'text', heading: '一致的選單邏輯，對應不同角色與管理範圍', body: ['側邊選單依目前的管理範圍與角色權限，呈現對應的功能入口。使用者在不同群組或組織之間切換時，仍能透過一致的選單結構，辨識自己正在管理哪裡，以及可以使用哪些功能。'] },
        { kind: 'video', src: 'works/vulcan/sp-flow.mp4', poster: 'works/vulcan/sp-flow-poster.jpg', ratio: '1160 / 725', label: 'Service Provider 介面：切換範圍，並在產品平台與管理後台之間切換' },
        { kind: 'pair', imgs: [I('scope-group', 'Group 介面：側邊選單只有管理後台的 User、License、Threat Library、System Settings，使用者選單沒有切換至產品平台的選項', { caption: 'Group 介面 - 只能使用 Admin', static: true }), I('scope-org', 'Organization 介面：側邊選單只有產品平台的 Project、Asset Group、Attack Strategy、Protect Policy，使用者選單沒有切換至管理後台的選項', { caption: 'Organization 介面 - 只能使用 Platform', static: true })] },
        { kind: 'text', full: true, body: ['我依照服務商、公司與公司部門的工作分工，區分管理後台與產品平台的存取權限。公司負責管理後台；公司部門則依角色在產品平台進行編輯或檢視。服務商可跨兩個介面管理與查看，並在授權範圍內自由切換不同角色，進入對應的工作情境。', '這樣的安排，讓各層使用者專注於職責相關的功能，也保留服務商跨角色管理與支援的彈性。'] },
      ],
    },
    {
      id: 'onesleeve',
      chapter: true,
      headImg: { src: 'works/vulcan/onesleeve-logo.png', alt: 'OneSleeve Design System 標誌' },
      heading: 'OneSleeve Design System',
      intro: ['隨著 Vulcan 的資訊量與流程複雜度持續提升，Attack 與 Protect 在表格、篩選、表單、權限及系統狀態等企業級操作模式上反覆出現；同時，公司其他產品也面臨相似需求。若持續以單一頁面或功能為單位優化，不僅會增加重複設計與開發成本，也難以在客戶、功能與市場快速擴張時維持一致體驗。因此，我們決定在推進產品設計的同時，同步建立 OneSleeve Design System，將有效模式沉澱為可跨產品複用且具彈性的設計基礎。'],
      blocks: [
        { kind: 'text', heading: '1. Design Token：建立跨產品的共同語言', body: ['我們以 Global、Semantic 與 Component 三層 Token 架構，將原始樣式、使用語意與元件設定分離。這讓 Vulcan 與 Cymetrics 能共享一致的狀態語言與設計規則，同時保留各產品在品牌與業務情境上的調整彈性。'] },
        {
          kind: 'table',
          head: ['Token 層級', '說明', '範例'],
          rows: [
            ['全域層 Global', '儲存最原始的原始數值（Raw Value）', 'color-blue-500 = #0066FF'],
            ['語意層 Semantic', '賦予數值「在什麼情境下使用」的含意', 'sidebar-button-active = color-blue-500'],
            ['組件層 Component', '綁定特定 UI 組件，做最精細的控制', 'button-primary-bg = color-brand-primary'],
          ],
        },
        { kind: 'split', heading: '2. 規劃命名原則', body: ['為避免共用 Token 過度冗長，或特定業務情境被過度抽象，我建立了 Standard 與 Contextual 雙軌命名策略。高複用樣式採用精簡且可預測的通用命名；只有在產品範圍或業務語意不可省略時，才加入情境前綴。', '這套規則讓設計與工程能快速理解 Token 用途，同時控制命名複雜度，保留跨產品擴充的彈性。'], img: I('naming', 'Standard 與 Contextual 雙軌命名策略：Standard 為高複用、可預測的 {Component}-{Property}-{State}，例如 text-hover；Contextual 僅在業務語意不可省略時加入 Scope，例如 sidebar-text-active', { static: true, bare: true }) },
        { kind: 'text', full: true, heading: '3. Component Architecture：從基礎元件延伸至產品模式', body: ['OneSleeve 採用四層架構：Foundations、Basic Components、Composite Components 與 Product Patterns。基礎元件確保視覺與操作一致，複合元件及產品模式則承接表格、篩選、表單、側邊面板與複雜工作區等企業級情境。'] },
        {
          kind: 'stack',
          items: [
            { title: 'Foundations', list: ['Color', 'Typography', 'Spacing', 'Radius', 'Icon'] },
            { title: 'Basic Components', list: ['Button', 'Input', 'Checkbox', 'Dropdown', 'Tooltip'] },
            { title: 'Composite Components', list: ['Form', 'Table', 'Filter', 'Modal', 'Sidebar'] },
            { title: 'Product Patterns', list: ['Page', 'SidePanel', 'Workspace', 'Popup'] },
          ],
        },
      ],
    },
    {
      id: 'workspace',
      heading: '建立可組合的資料工作區',
      dark: true,
      blocks: [
        { kind: 'video', src: 'works/vulcan/workspace-flow.mp4?v=4', poster: 'works/vulcan/workspace-flow-poster.jpg', ratio: '960 / 600', label: '從基礎元件、表格到完整頁面，逐層組合成資料工作區' },
        { kind: 'text', heading: '同一組元件適應不同容器情境', body: [] },
        { kind: 'video', src: 'works/vulcan/container-flow.mp4?v=4', poster: 'works/vulcan/container-flow-poster.jpg', ratio: '960 / 600', label: '同一個 PageTable 依序放進 SidePanel、Popup 與 WorkspaceSection，依容器調整寬度與欄位' },
      ],
    },
    {
      id: 'states',
      wide: true,
      heading: '4. 以一致狀態協助風險判讀',
      intro: ['當大量資產與工具需要同時呈現，使用者不只需要辨識單一節點，也必須理解其上下游關聯與潛在風險。我們以 Asset Card 為核心，統一 Default、Hover、Selected、Connected 與 Non-Connect 等狀態，並透過邊框、連線與資訊層級建立一致回饋，協助使用者聚焦目標、辨識關聯路徑，進一步判斷影響範圍與處理優先順序。'],
      blocks: [{ kind: 'image', img: I('asset-states', 'Asset Card 五種狀態（Default、Hover、Selected、Connected、Non-Connect），由狀態形成 Overview、Focus、Trace Relationship 的判讀規則，並應用於完整 Topology：標示目前選擇、關聯路徑、風險提示與弱化無關節點', { static: true, bare: true }) }],
    },
    {
      id: 'rtl',
      wide: true,
      heading: '5. 為多語市場建立雙向介面',
      intro: ['以 LTR／RTL 元件支援跨語言與跨市場擴張，共用相同的 Token、層級與狀態規則，依閱讀方向調整排列、對齊與操作位置。'],
      blocks: [{ kind: 'pair', imgs: [I('ltr', '由左至右（LTR）的 Basic Information 頁面：導覽在左、操作按鈕在右', { caption: 'LTR', static: true, bare: true, square: true }), I('rtl', '由右至左（RTL）的同一頁面：導覽移到右側，標題、欄位與按鈕位置左右鏡像', { caption: 'RTL', static: true, bare: true, square: true })] }],
    },
    {
      id: 'cross',
      wide: true,
      heading: '6. 跨產品應用',
      intro: ['為確保公司旗下產品維持一致的操作體驗與品牌識別，我們將 OneSleeve 擴展並應用至其他產品。透過共用的設計語言、元件規則與互動模式，各產品能在保留業務差異的同時延續一致體驗，並提升設計與開發效率。'],
      blocks: [
        {
          kind: 'crossProduct',
          left: I('xp-vulcan', 'Vulcan Protect Policy 列表頁，深色主題', { caption: 'Vulcan' }),
          right: I('xp-cymetrics', 'Cymetrics Scan 列表頁，淺色主題，沿用相同的版面、表格與搜尋元件', { caption: 'Cymetrics' }),
          hub: 'OneSleeve Design System',
          items: ['Visual Language', 'Component', 'Interaction Patterns'],
        },
      ],
    },
    {
      id: 'impact',
      heading: '團隊影響力',
      blocks: [
        {
          kind: 'cards',
          cols: 2,
          items: [
            { title: '從元件庫到跨團隊協作系統', body: '建立一套可被設計、產品與工程共同採用的 Design System，減少約 25–40% 重複 UI 工作，提升設計一致性、交付效率與長期維護性。' },
            { title: '更快擴充產品功能與模組', body: '加快約 20–30% 新功能與模組從設計規劃到開發交付的速度，縮短產品推到市場的前置時間。' },
          ],
        },
      ],
    },
  ],
  goals: [
    { label: '企業客戶', from: '30', to: '100 家' },
    { label: '輸出市場', from: '6', to: '8 個' },
    { label: '策略夥伴', from: '10', to: '20 家' },
  ],
}
