// LazyOtter case study, transcribed from the designer's draft (2026-10-12).
// Copy is the designer's own; English lives in lazyotter.en.ts.

import type { CaseData, Img } from './vulcan'

const I = (name: string, alt: string, extra: Partial<Img> = {}): Img => ({
  src: `works/lazyotter/${name}.jpg`,
  alt,
  static: true,
  ...extra,
})

export const lazyotter: CaseData = {
  id: 'lazyotter',
  name: 'LazyOtter',
  lede: 'Secure Your DeFi Portfolio with Ease',
  tags: ['DeFi 收益聚合器', '0 到 1 新創產品', '品牌與產品設計'],
  cover: 'works/lazyotter.jpg',
  coverAlt: 'LazyOtter 產品介面展示',
  coverStage: { src: 'works/lazyotter/devices.png', alt: 'LazyOtter 在 MacBook 與 iPhone 上的介面：Vaults 頁與 How LazyOtter Work' },
  context: { src: 'works/lazyotter/context.jpg', alt: '一位使用者在筆電前思考，螢幕上是收益策略的比較畫面，手邊做著筆記' },
  meta: [
    { label: '專案期間', value: '2022 - 2024' },
    { label: '合作對象', value: '產品經理 ×1、工程師 ×3' },
    { label: '我的角色', value: '資深產品設計師' },
    { label: '負責範圍', value: '優化產品體驗、規劃操作流程、設計策略、品牌視覺' },
  ],
  background: [
    '對想參與 DeFi 的一般使用者而言，收益來源、資金運用與平台可信度往往難以判斷，加上專業術語與複雜操作，更難選擇適合自己的產品。',
    '我參與了 LazyOtter 從 0 到 1 的打造過程，協助建立 DeFi 平台，透過風險分級與透明資訊，讓使用者理解收益策略，並依風險承受程度做出選擇。',
    '作為團隊中唯一的設計師，我負責品牌識別、官網與產品介面，串連品牌接觸、策略比較與資產管理，打造親切、一致且支持決策的體驗。',
  ],
  proofHeading: '專案成果',
  proof: [
    { icon: 'users', label: '日活躍使用者', figure: '1K', unit: '', caption: '' },
    { icon: 'check', label: '上線一個月內', figure: 'US$876K', unit: '', caption: '平台 TVL' },
    { icon: 'award', label: '鏈上創新賽區', figure: '2nd', unit: '', caption: '2023 ETH Hong Kong Hackathon' },
    { icon: 'award', label: 'Demo Day', figure: '2nd', unit: '', caption: 'Bybit x MoleDAO' },
  ],
  sections: [
    {
      id: 'goal',
      divider: true,
      wide: true,
      heading: '商業目標',
      blocks: [
        {
          kind: 'text',
          full: true,
          heading: '如何讓複雜的 DeFi 投資變得更簡單、透明且值得信任？',
          body: [
            'LazyOtter 希望降低 DeFi 的理解與操作門檻，成為使用者進行收益優化與風險管理的首選平台，以易用性與風險管理建立市場差異，推動使用者從認識品牌走向實際存入與持續使用。',
            '為了吸引更多用戶，我們上線初期推出總值 US$5,000、100 個獲獎名額的代幣獎勵活動，透過社群參與與好友推薦吸引潛在使用者；後續則以存款金額與持有時間連動的積分機制，鼓勵資金存入與持續參與。',
            '設計的商業任務，是銜接這段從社群到產品的旅程：以一致的品牌體驗建立熟悉感，以清楚的收益與風險資訊協助比較，並降低首次存入的操作障礙，支持使用者採用與資金留存。',
          ],
        },
        { kind: 'image', img: I('banner', 'LazyOtter 品牌橫幅：Make DeFi Easy & Safe for You，水獺吉祥物躺在泳圈上，周圍環繞代幣', { bare: true }) },
      ],
    },
    {
      id: 'challenge',
      heading: '設計挑戰',
      blocks: [
        {
          kind: 'cards',
          note: true,
          cols: 3,
          items: [
            { title: '複雜的 DeFi 操作流程', body: 'DeFi 涉及收益策略、資產配置與錢包操作，對新手而言較為複雜。設計上需要整理資訊，將專業內容轉化為清楚、易懂的操作流程。' },
            { title: '公開透明的風險警示', body: 'DeFi 產品常強調收益，卻未充分說明市場波動、資產損失、智能合約與流動性等風險。設計上需要以透明、易比較的方式呈現收益與風險，幫助使用者評估是否適合投入。' },
            { title: '凌亂的品牌與產品體驗', body: '使用者可能在官網與產品操作頁面看到不同的資訊與語言，進而降低信任感。設計上需要整合官網與產品端的內容、語言與視覺風格，提供一致且可靠的體驗。' },
          ],
        },
      ],
    },
    {
      id: 'research',
      chapter: true,
      pill: true,
      left: true,
      wide: true,
      roomy: true,
      heading: '使用者研究',
      blocks: [
        {
          kind: 'text',
          full: true,
          heading: '用訪談建立目標用戶輪廓',
          body: [
            '為了釐清 LazyOtter 應優先服務哪些使用者，我透過訪談了解了 8 位使用者參與 DeFi 的動機、選擇產品的依據，以及從理解策略到實際操作之間的障礙，再依據訪談中的行為、需求與決策差異整理 Persona，作為討論目標族群與產品方向的基礎。',
            '研究聚焦三個問題：',
          ],
          list: ['選擇產品的動機', '理解與操作障礙', '建立信任的條件'],
          accentList: true,
        },
        {
          kind: 'splitQuestions',
          heading: '訪談問題規劃',
          body: [
            '訪談將先從使用者的背景、接觸 Web3 的歷程與整體使用情境開始，再逐步聚焦至具體產品、操作流程、資訊需求與痛點，最後延伸了解信任、持續使用與放棄的關鍵因素，確保後續問題能建立在受訪者真實經驗之上。訪談過程將以開放、中立與尊重為原則，避免預設答案或引導受訪者朝特定方向回答。',
          ],
          groups: [
            {
              title: '大範圍（對產業的想法）',
              items: [
                '當初開始進入 Web3 的契機？',
                '開始研究 Web3 多久了呢？',
                'Web2 產品與 Web3 對你來說差在哪裡？為什麼／什麼時候會選擇 Web3？',
                '哪樣的產品會更吸引你使用？選擇 Web3 產品時注重的關鍵點是什麼？',
                '常使用的產品有哪些？為什麼？',
                '哪樣的產品你會推薦給朋友？',
                '曾經使用最久的產品是什麼？曾換掉某個產品嗎？為什麼？',
                '曾經體驗過最好／差的產品分別有哪些？原因是什麼？',
                '通常都從哪些管道得知 Web3 的知識？',
                '你身邊 Web3 的同好，大多是什麼樣的人？你們都如何參與交流？',
                '以你對 Web3 的了解，你認為市場接受度如何？未來的趨勢和需求在何處？',
                '你認為目前 Web3 要大眾化、普及化的困難及考驗會是什麼？',
              ],
            },
            {
              title: '小範圍（針對使用產品的操作）',
              items: [
                '使用相關產品的原因？',
                '使用相關產品的頻率？',
                '在使用產品時最關注的資訊是哪些？',
                '有沒有遇過看不懂的、不必要的或缺少的資訊呢？',
                '在剛開始使用相關產品時，哪個流程是你覺得最困難的？',
                '在操作上遇到困難時，你會如何解決？',
                '產品做哪些事可以增加你的安全感／信任感？',
                '你如何分配資金在多個產品之間？考量的點？',
                '如果在使用產品賠錢後會不會影響使用意願？為什麼？',
                '你認為目前的產品還有哪些地方沒有滿足你的需要？',
              ],
            },
          ],
        },
        {
          kind: 'flow',
          items: [
            { icon: 'route', title: '先理解選擇，再深入操作', body: '從進入 Web3 的契機、常用產品與選擇條件開始，再深入關注的資訊、困難流程與求助方式，連結使用動機與實際體驗。' },
            { icon: 'users', title: '以具體經驗理解需求', body: '透過曾經長期使用、放棄或遇到困難的產品，了解影響行為的原因，讓需求有實際情境可追溯。' },
            { icon: 'search', title: '同時探索採用與退出的原因', body: '除了了解什麼會吸引使用者，也詢問哪些經驗會降低信任、導致放棄，以及發生虧損後是否仍願意使用，辨識產品採用的條件與界線。' },
          ],
        },
        { kind: 'text', heading: '用卡片分類法（親和圖）整理觀察洞見', body: [] },
        { kind: 'image', img: I('affinity', '使用者訪談親和圖：8 份訪談紀錄、32 張逐字資料卡，歸納為 10 個需求群組，並附上資料歸納與分析者推測', { bare: true, static: false }) },
        {
          kind: 'text',
          full: true,
          heading: '從使用者差異，找到 MVP 優先服務的對象',
          body: [
            '透過八份訪談，我比較使用者選擇產品的動機、管理資產的方式，以及建立信任所需的資訊，初步分類了三種類型的使用者。研究顯示，DeFi 的熟悉程度、資金規模與風險偏好並不完全一致：有人希望減少操作，也有人偏好自行掌握策略；有人因不理解機制而猶豫，也有人理解機制，卻認為回報不值得投入。',
          ],
          list: [
            '大戶使用者：關注較大額資金投入時的安全性、流動性與操作穩定性，希望有效掌握資產，減少不必要的重複操作。',
            '小資使用者：已有投資或部分加密貨幣操作經驗，希望找到值得投入的收益機會，但比較策略、理解機制與管理資金仍有負擔。',
            '小白使用者：可能已有傳統投資、換幣或 NFT 經驗，但對 DeFi 的機制與流程仍不熟悉，需要理解用途、準備事項與如何開始。',
          ],
        },
        { kind: 'image', img: { ...I('personas', '三種使用者 Persona：大戶使用者 Kelly（35 歲精算師）、小資使用者 Matt（32 歲全端工程師，主要對象）、小白使用者 Zet（28 歲工程師）的目標、痛點與需求', { bare: true, square: true }), src: 'works/lazyotter/personas.png' } },
        {
          kind: 'split',
          heading: '第一階段：優先服務已有基礎、但仍需要決策協助的小資使用者',
          body: [
            '小資使用者已有參與動機與部分操作基礎，卻仍會遇到「不知道收益從哪裡來」「不同策略難以比較」「不清楚每一步在做什麼」等問題。這些需求與 LazyOtter 的收益整合、風險資訊與流程設計最直接相關，適合作為第一階段聚焦的方向。',
          ],
          img: I('matt', '主要 Persona Matt：32 歲全端工程師，懂投資但沒有時間每天研究 DeFi', { bare: true, static: false }),
        },
        {
          kind: 'split',
          heading: '將訪談回饋把主要 TA 的痛點整理為使用者旅程圖',
          body: ['透過旅程圖，我將主要痛點和設計機會串連起來，並找出影響使用者決策的關鍵時刻。'],
          img: I('journey', '使用者旅程圖：Aware、Explore & Learn、Compare、Test、Adoption 五個階段的行為、需求與痛點、接觸點、感受與機會', { bare: true, static: false }),
        },
        {
          kind: 'text',
          full: true,
          heading: '理解、信任與操作，是參與 DeFi 的三道門檻',
          body: [
            '訪談發現，即使具備技術或投資經驗，受訪者仍需要花時間理解收益機制、查證平台資訊，並在操作遇到困難時尋求他人協助。收益雖然能吸引關注，但是否願意投入，還取決於能否理解風險、信任平台，以及順利完成操作。這些發現讓 LazyOtter 的設計方向聚焦於透明的資訊、清楚的引導與一致的品牌體驗，協助使用者做出有依據的選擇。',
          ],
        },
        {
          kind: 'insight',
          eyebrow: '研究洞察',
          title: '儘管有技術背景，還是很難完全理解',
          points: [
            'DeFi 使用者表示，需要查很多資料才能放心投資，甚至許多項目方的資訊根本不透明。',
            '除了害怕項目方跑路、擔心遇到詐騙，也擔心被駭客入侵。',
            '雖然我有技術背景，但是一開始還是需要懂的朋友來帶，因為入金流程太難、太複雜，遇到問題時，也不容易搜尋到解法。',
          ],
          quote: '安全穩定、簡單操作、有利潤空間的平台將會很吸引我',
        },
        {
          kind: 'text',
          full: true,
          rule: true,
          heading: 'MVP 範圍：聚焦理解、比較與基本操作',
          body: [
            '訪談顯示，使用者的需求涵蓋入門教學、策略比較，以及資產自動化等不同面向。不過，以目前的團隊規模來看，第一階段應先聚焦於 LazyOtter 的核心價值：讓使用者看懂收益與風險、快速比較不同選項，並完成基本操作。',
          ],
        },
        {
          kind: 'lists',
          cols: [
            { title: '優先處理', tone: 'yes', items: ['清楚呈現收益來源、風險與必要條件', '讓不同策略可以被比較', '在核心流程中提供必要說明與回饋', '提供基本資產狀況與風險資訊'] },
            { title: '暫不作為第一階段主軸', tone: 'later', items: ['從零開始的完整加密貨幣教育', '滿足所有鏈、所有收益產品的完整比較', '高度客製的策略操作', '完整的模擬交易功能'] },
          ],
        },
      ],
    },
    {
      id: 'brand',
      chapter: true,
      flat: true,
      pill: true,
      left: true,
      wide: true,
      roomy: true,
      heading: '品牌策略',
      blocks: [
        {
          kind: 'split',
          heading: '用親切感拉近距離，以透明資訊支持信任',
          wideText: true,
          body: [
            '研究顯示，使用者會從介面品質、資訊完整度與操作體驗判斷平台是否可靠。過度遊戲化的設計、誇大的收益宣傳，以及不清楚的機制說明，都可能降低信任。因此，LazyOtter 需要兼顧親切與專業：以水獺角色降低距離感，並透過清楚資訊與一致視覺，協助使用者理解產品。輕鬆的品牌感受，也必須搭配透明的風險溝通。',
            'LazyOtter 象徵使用者像慵懶的水獺一樣，透過自動化機制輕鬆參與並管理資產。但這不代表無須理解風險，而是以簡單、透明且可靠的工具，減少繁複操作，讓使用者在了解投入條件與可能風險後，更從容地做出決策。',
            '為建立一致的品牌視覺，我與行銷團隊花費一個月反覆討論品牌定位、溝通語氣與視覺方向，在親切感、專業度與信任感之間取得平衡。',
          ],
          img: { ...I('otters', '標語 Earn Yields Lazy & Safe，兩隻 LazyOtter 水獺吉祥物手牽手漂浮在水面上', { bare: true, max: 280, alignEnd: true }), src: 'works/lazyotter/otters.png' },
        },
        {
          kind: 'cards',
          stacked: true,
          items: [
            { title: 'Simple', body: '我們的目標是保持操作的直觀性、簡單性和一致性，同時確保重要內容能夠明確突顯。' },
            { title: 'Transparent', body: '為了讓使用者更相信我們，我們加強了介面中的資訊透明度，並經由專業的技術團隊研究後，清楚標示風險。' },
            { title: 'Leisure', body: '我們希望通過視覺設計傳達出一種輕鬆和寧靜的感覺，以減輕用戶在操作時可能產生的不安和焦慮情緒。' },
          ],
        },
        {
          kind: 'palette',
          heading: '以藍色系傳達平靜與安定感',
          body: [
            '我選擇藍色系作為品牌主色調，希望營造平靜、安心的視覺感受，並廣泛應用於行銷素材與 UI 設計中。以深藍色呈現沉穩與專業，適合用於品牌識別、標題、重點資訊與主要操作介面；搭配明亮的湖水藍增添親切感，可應用於按鈕、互動元件、插圖及行銷視覺，並呼應水獺悠游水面的意象，讓整體品牌在輕鬆與可靠之間取得平衡。',
          ],
          items: [
            { hex: '#0C0912', name: 'Night', role: '背景' },
            { hex: '#00ABD1', name: 'Lake Blue', role: '按鈕、互動元件、插圖' },
            { hex: '#1E364E', name: 'Deep Navy', role: '品牌識別、主要介面' },
            { hex: '#FFFFFF', name: 'White', role: '文字、對比' },
          ],
        },
        { kind: 'uikit', label: 'LazyOtter UI 元件：日期選擇器、輸入框各狀態、按鈕各狀態與側邊選單，各欄交錯上下循環捲動' },
        {
          kind: 'text',
          full: true,
          heading: '品牌官網',
          body: [
            '我負責 LazyOtter 官網的平面視覺、動畫與 UI 設計，考量 DeFi 的理解門檻與風險疑慮，以水獺角色、藍色系、幾何圖形與清楚的資訊層級，營造親切且有秩序的品牌體驗，並將風險評估、監控機制與收益風險優化拆分呈現，搭配曲線、儀表與管線等動態視覺，協助使用者逐步理解產品。官網同時提供「Launch App」、「Learn more」與「Join Our Community」三種入口，分別銜接產品體驗、文件閱讀與社群參與，讓不同準備程度的使用者依照自己的步調探索 LazyOtter。',
          ],
        },
        { kind: 'site', label: 'LazyOtter 官網各區塊：首頁、How LazyOtter Works 三個步驟、Roadmap、Join Our Community、願景與 Investors & Partners，以傾斜拼貼左右交錯緩慢捲動' },
      ],
    },
    {
      id: 'designs',
      chapter: true,
      pill: true,
      left: true,
      bandHead: true,
      heading: '設計項目',
      blocks: [],
    },
    {
      id: 'p1',
      kicker: '平台入口',
      bandCont: true,
      wide: true,
      roomy: true,
      heading: '從持有的資產與投資偏好，找到適合的 Vault',
      intro: ['訪談顯示，使用者需要花時間研究策略、比較收益與風險，才能決定是否投入。我以情境插畫呈現不同風險類型，並重新安排卡片資訊，建立從初步選擇、比較到深入了解的路徑。'],
      blocks: [
        {
          kind: 'annotated',
          items: [
            { title: '辨識風險偏好', body: '透過插畫區分不同風險類型，引導使用者選擇符合自身偏好的方向。' },
            { title: '比較關鍵資訊', body: '以一致的資訊結構呈現 APY、風險評級與 TVL，方便比較不同 Vault。' },
            { title: '了解決策依據', body: '進入 Vault 詳情查看策略內容與風險評估，作為是否投入的判斷依據。' },
          ],
          img: I('vaults', 'Vaults 頁：三種風險類型的儲蓄方案卡片與全部 Vault 列表', { bare: true, soft: true }),
        },
      ],
    },
    {
      id: 'p2',
      kicker: '官網詳情頁',
      bandCont: true,
      bandRule: true,
      wide: true,
      roomy: true,
      heading: '提供清楚的收益來源與風險依據，支持投入前的判斷',
      intro: ['使用者需要了解資金如何運用、收益從何而來，以及可能承擔的風險。我將 Vault 詳情分成收益摘要、策略說明與風險評估，讓使用者先掌握重點，再依需求深入查證。'],
      blocks: [
        {
          kind: 'annotated',
          items: [{ title: '掌握整體評估', body: '透過風險等級、整體分數、評估者與日期，呈現評估結果及其背景。' }],
          img: { ...I('overall', 'Overall Score 卡片：整體分數 80% 與評估者、評估日期', { bare: true, square: true }), src: 'works/lazyotter/overall.png' },
        },
        {
          kind: 'annotated',
          start: 2,
          items: [
            { title: '比較不同風險面向', body: '以經濟、營運與技術三個面向的分數與雷達圖，搭配正面因素和風險提示，呈現各面向的差異。' },
            { title: '深入查看評估因素', body: '在各面向提供「See all factors」入口，讓使用者進一步查看細節，了解評分依據。' },
          ],
          img: { ...I('radars', 'Economic、Operational、Technical 三個面向的分數、雷達圖與評估因素', { bare: true, square: true }), src: 'works/lazyotter/radars.png' },
        },
      ],
    },
    {
      id: 'p3',
      kicker: 'Vault 詳情頁',
      bandCont: true,
      bandRule: true,
      wide: true,
      roomy: true,
      heading: '策略評估、資金操作與風險追蹤',
      intro: ['根據訪談中使用者對策略理解與資金安全的需求，我將頁面資訊依照「投入前的評估、投入時的操作、持有期間的追蹤」安排，讓風險資訊貫穿整個使用歷程。'],
      blocks: [
        {
          kind: 'annotated',
          items: [
            { title: '依決策需求安排資訊', body: '訪談中，使用者需要先研究策略、比較收益與風險。因此我優先呈現 APY 組成、風險評級與 TVL，並保留深入查看評估內容的入口。' },
            { title: '提供歷史變化，補足當下數字的脈絡', body: '提供 APY、Token Value 與 TVL 的歷史圖表，讓使用者切換指標與時間範圍，了解過去的波動與變化，作為投入前的參考。' },
            { title: '讓判斷銜接投入金額', body: '在存入區呈現錢包餘額與既有投入，搭配金額輸入及比例調整，讓使用者參照可用資產設定本次投入。' },
            { title: '讓風險從評分延伸到事件', body: '回應使用者對資金安全的疑慮，以嚴重程度、事件描述、處理資訊與日期整理監控結果，協助使用者了解發生了什麼事，以及哪些變化值得關注。' },
            { title: '銜接持有期間的追蹤', body: '在監控結果提供事件篩選與通知入口，讓使用者依需求查看事件，並延續存入後的追蹤。' },
          ],
          img: { ...I('detail', 'GMX v2 Vault 詳情頁：收益摘要、Vault Performance 圖表、存入與提領、監控結果', { bare: true, square: true }), src: 'works/lazyotter/detail.png' },
        },
      ],
    },
    {
      id: 'p4',
      kicker: 'Dashboard',
      bandCont: true,
      bandRule: true,
      wide: true,
      roomy: true,
      heading: '存入後體驗：從看到警報，到知道如何回應',
      intro: ['使用者對資金安全的關注，不會在完成存入後結束。我將交易成功、通知訂閱與資產總覽銜接起來，讓使用者確認操作結果後，能設定後續追蹤方式，並在再次使用時掌握自己的投入狀況。'],
      headAlerts: '存入成功後的通知訂閱流程：輸入 email 送出、輸入驗證碼送出，完成 Sign up successful，循環播放',
      blocks: [
        {
          kind: 'pair',
          imgs: [
            I('dash-empty', '尚未持有 Vault 的 Dashboard：探索入口與產品介紹', { caption: '尚未持有 Vault：提供探索入口與產品介紹，協助使用者理解後再決定', bare: true, soft: true }),
            I('dash-full', '已有持倉的 Dashboard：資產摘要、監控事件與配置資訊', { caption: '已有持倉：整合資產摘要、監控事件與配置資訊，支援持續追蹤', bare: true, soft: true }),
          ],
        },
        {
          kind: 'annotated',
          items: [
            { title: '將資產概況放在最上方，提供回訪時的閱讀起點', body: '使用者回到 Dashboard 時，最需要先掌握的是目前整體投入狀況。因此，我將總投入金額、收益資訊與投資組合風險集中於頁面最上方，讓使用者一進入頁面就能快速了解資產表現與風險概況，再依需求查看下方的事件與配置資訊。這樣的安排也能降低使用者重新理解頁面的成本，建立清楚且一致的閱讀順序。' },
            { title: '彙整持倉相關事件，協助辨識需要關注的變化', body: '回應訪談中對資金安全的疑慮，我將不同協議的監控事件集中於 My Alerts，並列出協議名稱、嚴重程度、事件描述、處理資訊與日期，協助使用者了解「哪個協議發生了什麼事，以及有什麼處理資訊」。搭配搜尋、篩選與詳情入口，讓使用者能從事件列表中聚焦需要關注的內容，進一步查閱。' },
            { title: '將資金與風險配置視覺化，補足總額之外的理解', body: '總投入金額無法完整說明資產如何分配，因此我透過 Portfolio 與 Risk 圖表，分別呈現各 Vault 的資金配置，以及不同風險等級的分布。搭配金額與占比，協助使用者了解資金是否集中於特定 Vault 或風險類型，作為檢視現有配置與後續投入的參考。' },
          ],
          img: { ...I('dash-annotated', '已有持倉的 Dashboard：資產概況、My Alerts 事件列表、Portfolio 與 Risk 圖表', { bare: true, square: true }), src: 'works/lazyotter/dash-annotated.png' },
        },
      ],
    },
    {
      id: 'validate',
      chapter: true,
      flat: true,
      pill: true,
      left: true,
      wide: true,
      heading: '驗證與反思',
      blocks: [
        {
          kind: 'text',
          full: true,
          heading: '易用性測試：確認使用者能否理解並完成核心操作',
          body: [
            '為確認介面是否支持使用者完成核心任務，我以自由探索、任務操作與測後訪談，觀察使用者在選擇 Vault、存入資金、查看資產及提領時的操作與理解情況，並追問卡關原因，作為後續調整資訊與流程的依據。',
          ],
          list: ['目標：確認用戶能否理解專有名詞，並完成存入、查看資產與提領。', '對象：第一次使用 LazyOtter 的目標用戶', '核心任務：選擇 Vault 並存入、查看資金、提領，並理解風險'],
        },
        {
          kind: 'flow',
          items: [
            { title: '自由探索', body: '前 10 分鐘不提供操作提示，觀察第一步、瀏覽順序與疑惑。' },
            { title: '核心任務測試', list: ['選擇 Vault 並存入', '查看自己的資金狀況', '提領資金'] },
            { title: '測後訪談', list: ['回顧卡關位置', '追問理解與判斷原因'] },
            { title: '易用性評估', body: 'SUS：評估整體易用性分數。' },
          ],
        },
        {
          kind: 'text',
          full: true,
          body: ['後續將整理測試中使用者的停頓、誤解與求助情況，搭配任務結果及測後訪談釐清原因，優先處理阻礙任務完成的問題，再調整專有名詞、資訊呈現與操作引導。完成修改後，將以相同任務進行複測，確認卡點是否改善，作為下一輪設計優化的依據。'],
        },
        {
          kind: 'split',
          rule: true,
          bodyAlign: true,
          heading: '設計反思：先理解複雜機制，才能設計容易理解的體驗',
          body: [
            '專案初期，我花了許多時間理解 DeFi 的收益策略、資金流向、錢包授權與風險來源。感謝團隊成員協助我釐清技術與產品邏輯，讓我能將複雜機制轉化為介面設計，也更體會使用者面對陌生領域時的理解負擔。',
            '這次經驗讓我學會依使用階段安排資訊：投入前協助理解與比較，操作時提供必要確認，持有期間支援追蹤。同時，以親切的品牌視覺搭配透明的風險說明，避免讓「容易使用」被誤解為「沒有風險」。',
            '後續，我將透過易用性測試與上線後的行為數據，觀察錢包連接、存入與贖回流程的完成及流失情況，搭配使用者回饋找出卡點，持續調整設計。',
          ],
          img: I('meetup', 'LazyOtter 團隊參加 Scroll Community Meetup（Web3 Security）活動合照', { bare: true, soft: true }),
        },
      ],
    },
  ],
}
