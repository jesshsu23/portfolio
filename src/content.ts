export type Lang = 'en' | 'zh'

export const langNames: Record<Lang, string> = { en: 'English', zh: '中文' }

// Plain text, or a phrase set apart for emphasis.
type Segment = string | { em: string }

// A heading split into its plain lead and the word set in the italic serif.
type Heading = [lead: string, accent: string]

type Strength = { title: string; body: string }

type Work = {
  id: string
  href?: string
  name: string
  domain: string
  summary: string
}

type Pending = { label: string }

type Content = {
  nav: { work: string; about: string; resume: string }
  langLabel: string
  hero: {
    greeting: Heading
    experience: string
    role: string
    tagline: Segment[]
  }
  about: {
    heading: Heading
    body: string
    more: string
  }
  works: {
    heading: Heading
    imageAlt: string
    open: string
    back: string
    status: string
    items: Work[]
  }
  different: {
    heading: Heading
    items: Strength[]
  }
  record: {
    heading: Heading
    note: string
    withheld: string
    items: Pending[]
  }
  close: {
    heading: Heading
    body: string
    pending: string
  }
}

export const content: Record<Lang, Content> = {
  en: {
    nav: { work: 'Work', about: 'About', resume: 'Resume' },
    langLabel: 'Language',
    hero: {
      greeting: ['Hello, I’m ', 'Jess Hsu'],
      experience: '8 yrs experience',
      role: 'Sr. Product Designer',
      tagline: [
        'I break down ',
        { em: 'complex situations' },
        ' and turn them into ',
        { em: 'design people can actually use.' },
      ],
    },
    about: {
      heading: ['About ', 'me'],
      body: 'Senior Product Designer with eight years of experience. My recent work sits in domains most people find opaque: safety and compliance for generative AI, crypto yield, and security testing. I learn the system first, then design the version a person can operate.',
      more: 'More about me',
    },
    works: {
      heading: ['Selected ', 'Works'],
      imageAlt: 'product interface on laptop and phone',
      open: 'View case study',
      back: 'Back to work',
      status: 'Case study in preparation',
      items: [
        { id: 'vulcan', href: '#/work/vulcan', name: 'Vulcan', domain: 'GenAI safety', summary: 'A tool for the safety, security, and compliance of generative AI.' },
        { id: 'lazyotter', href: '#/work/lazyotter', name: 'LazyOtter', domain: 'Crypto', summary: 'A crypto yield aggregator.' },
        { id: 'cymetrics', name: 'Cymetrics', domain: 'Security SaaS', summary: 'A SaaS platform for security testing.' },
      ],
    },
    different: {
      heading: ['What makes me ', 'different'],
      items: [
        {
          title: 'I get fluent in hard domains',
          body: 'Security testing, AI compliance, DeFi yield. I learn the vocabulary and the constraints until I can design from the system up, not from screenshots of competitors.',
        },
        {
          title: 'Complexity in, decisions out',
          body: 'I map everything the system can do, then cut it down to the few decisions a user actually has to make, in the order they have to make them.',
        },
        {
          title: 'Usable for the expert and the newcomer',
          body: 'The same screen has to hold up for a specialist on their hundredth session and someone on their first. I design for both without dumbing anything down.',
        },
      ],
    },
    record: {
      heading: ['Kind ', 'words'],
      note: 'Testimonials, talks, and writing are on their way.',
      withheld: 'Content coming soon',
      items: [{ label: 'Testimonial' }, { label: 'Testimonial' }],
    },
    close: {
      heading: ['Let’s ', 'talk.'],
      body: 'Hiring for a senior product role at a remote-first team? I’d like to hear about it.',
      pending: 'Contact details pending',
    },
  },
  zh: {
    nav: { work: 'Work', about: 'About', resume: 'Resume' },
    langLabel: '語言',
    hero: {
      greeting: ['Hello, I’m ', 'Jess Hsu'],
      experience: '8 年經驗',
      role: 'Sr. Product Designer',
      tagline: ['擅長拆解', { em: '複雜情境' }, '，轉化為', { em: '易用的設計' }, '。'],
    },
    about: {
      heading: ['關於', '我'],
      body: '資深產品設計師，八年經驗。近期的作品都落在多數人覺得難以理解的領域：生成式 AI 的安全與合規、加密貨幣收益、資訊安全檢測。我先弄懂系統，再設計出人能操作的版本。',
      more: '瞭解更多',
    },
    works: {
      heading: ['Selected ', 'Works'],
      imageAlt: '產品介面展示',
      open: '查看案例',
      back: 'Back to work',
      status: '案例整理中',
      items: [
        { id: 'vulcan', href: '#/work/vulcan', name: 'Vulcan', domain: 'GenAI 安全', summary: 'GenAI 安全、保障和合規工具。' },
        { id: 'lazyotter', href: '#/work/lazyotter', name: 'LazyOtter', domain: '加密貨幣', summary: '加密貨幣收益聚合器。' },
        { id: 'cymetrics', name: 'Cymetrics', domain: '資安 SaaS', summary: 'SaaS 資訊安全檢測平台。' },
      ],
    },
    different: {
      heading: ['我的', '不同之處'],
      items: [
        {
          title: '能快速吃透硬領域',
          body: '資安檢測、AI 合規、DeFi 收益。我會學到能掌握術語與限制，從系統本身出發設計，而不是參考競品截圖。',
        },
        {
          title: '複雜進來，決策出去',
          body: '我先把系統能做的事全部攤開，再刪減成使用者真正需要做的幾個決定，並排出它們的順序。',
        },
        {
          title: '專家與新手都好用',
          body: '同一個畫面，要讓第一百次使用的專家順手，也要讓第一次使用的人看懂。兩者兼顧，而不把內容簡化掉。',
        },
      ],
    },
    record: {
      heading: ['夥伴', '回饋'],
      note: '推薦、演講與文章即將補上。',
      withheld: '內容即將補上',
      items: [{ label: '推薦' }, { label: '推薦' }],
    },
    close: {
      heading: ['聊', '聊吧。'],
      body: '正在為遠端團隊招募資深產品設計師嗎？很想聽聽你們的故事。',
      pending: '聯絡方式待補',
    },
  },
}
