import type { Lang } from './content'

// About page copy. Images live under public/about/; any file that is missing
// renders as a labelled placeholder, so photos can be dropped in later.

type Heading = [lead: string, accent: string]

type SkillGroup = { title: string; items: string[] }

type Job = { logo: string; mark: string; role: string; company: string; period: string }

type School = { degree: string; school: string; period: string }

type Event = { photo: string; title: string; period: string }

export type AboutContent = {
  photoPending: string
  intro: { photoAlt: string; body: string[] }
  skills: { heading: Heading; groups: SkillGroup[] }
  experience: { heading: Heading; jobs: Job[] }
  education: { heading: Heading; schools: School[] }
  practice: { heading: string; body: string }
  workshop: { heading: Heading; body: string; events: Event[] }
  uxtw: { title: string; body: string; period: string; photo: string }
  mentorship: { heading: string; body: string; photos: string[] }
}

const jobs = [
  { logo: 'aift', mark: 'AI', role: 'Senior Product Designer', company: 'AIFT', period: 'Jul 2021 – Jun 2026' },
  { logo: 'ctwant', mark: 'W', role: 'UIUX Designer', company: 'CTWANT', period: 'May 2019 – Jun 2021' },
  { logo: 'tripmoment', mark: 'TM', role: 'UIUX Designer', company: 'TripMoment', period: 'Mar 2018 – May 2019' },
  { logo: 'ichef', mark: 'iC', role: 'Visual Designer', company: 'iCHEF', period: 'Jul 2016 – Jul 2017' },
]

const schools = [
  { degree: 'M.A. in Design', school: 'National Taiwan Normal University', period: 'Sep 2015 – Jul 2018' },
  { degree: 'B.A. in Visual Communication Design', school: 'National Kaohsiung Normal University', period: 'Sep 2010 – Jul 2014' },
]

const workshopPhotos = ['ntust-emba', 'yzu', 'nccu', 'nthu-dtda', 'uxcx', 'app-contest']
const mentorshipPhotos = ['1', '2', '3', '4', '5']

export const about: Record<Lang, AboutContent> = {
  en: {
    photoPending: 'Photo pending',
    intro: {
      photoAlt: 'Portrait of Jess Hsu',
      body: [
        'Hi, I’m Jess,',
        'a product designer with strong craft and a solid understanding of technology. I use structured analysis to find the real problem, then turn user needs into products that are easy to use and worth using. I care about what users need, and just as much about what engineering can build and how the product creates value for the business.',
      ],
    },
    skills: {
      heading: ['', 'Skills'],
      groups: [
        {
          title: 'Product Design',
          items: ['UX/UI Design', 'Design System', 'Information Architecture', 'Interaction Design', 'Prototyping (Figma)', 'Coding fundamentals'],
        },
        {
          title: 'UX Research',
          items: ['User interviews', 'Stakeholder interviews', 'Usability testing', 'Competitive analysis', 'User journey mapping', 'Data analysis'],
        },
        {
          title: 'Product Strategy',
          items: ['Business acumen', 'Cross-functional collaboration', 'Independent thinking', 'Ownership & leadership', 'Problem solving & decision-making', 'Project & risk management'],
        },
      ],
    },
    experience: { heading: ['Work ', 'Experience'], jobs },
    education: { heading: ['', 'Education'], schools },
    practice: {
      heading: 'Doing what I love, and making it count',
      body: 'Outside work, I keep learning through courses and workshops. I like passing on what I learn, so I started writing, ran a design page on Facebook, and now teach UI/UX as a tutor and instructor. I also volunteer with industry associations to help run their events, in the hope of making Taiwan’s UX community a little stronger.',
    },
    workshop: {
      heading: ['UXUI ', 'Workshop'],
      body: 'I design UI/UX courses around what each group of students needs. The classes are hands-on: students learn the concepts by designing, and build their problem-solving skills one exercise at a time.',
      events: [
        { title: 'National Taiwan University of Science and Technology – EMBA', period: '2021/04 – 2021/06' },
        { title: 'Yuan Ze University – Continuing Education', period: '2022/06 – 2023/08' },
        { title: 'National Chengchi University – New Media Creative Action (general education)', period: '2022/06 – 2023/08' },
        { title: 'National Tsing Hua University – DTDA', period: '2024/10' },
        { title: 'UXCX Annual Trends Joint Workshop', period: '2023, 2024' },
        { title: 'Mobile App Innovation Contest – UI/UX Design', period: '2026/04' },
      ].map((e, i) => ({ ...e, photo: workshopPhotos[i] })),
    },
    uxtw: {
      title: 'UXTW Taiwan User Experience Design Association',
      body: 'I volunteered on UXTW’s education team, helping plan the annual course programme, review instructor proposals and coordinate events, to get more design knowledge shared across the community.',
      period: '2020 – 2021',
      photo: 'uxtw',
    },
    mentorship: {
      heading: 'The MentorShip',
      body: 'I was selected as a navigator (team lead) for the 4th MentorShip programme, and led my group through the workshop sessions, keeping the discussion open and the team working together.',
      photos: mentorshipPhotos,
    },
  },
  zh: {
    photoPending: '照片待補',
    intro: {
      photoAlt: 'Jess Hsu 的照片',
      body: [
        'Hi 我是 Jess，',
        '一名具備扎實設計能力與技術理解力的產品設計師，擅長透過理性分析釐清問題，將使用者需求轉化為易用且有價值的產品體驗。我重視使用者的需求，也關心技術可行性以及產品如何為公司創造價值。',
      ],
    },
    skills: {
      heading: ['', 'Skills'],
      groups: [
        {
          title: '產品設計',
          items: ['UX/UI Design', 'Design System', '資訊架構', '互動設計', 'Prototype（Figma）', '基礎程式認知'],
        },
        {
          title: '使用者體驗研究',
          items: ['使用者訪談', '利害關係人訪談', '易用性測試', '競品分析', '使用者旅程圖', '數據分析'],
        },
        {
          title: '產品策略',
          items: ['商業思維', '跨部門協作', '獨立思考力', '當責領導力', '問題解決與決策', '專案與風險管理'],
        },
      ],
    },
    experience: { heading: ['Work ', 'Experience'], jobs },
    education: { heading: ['', 'Education'], schools },
    practice: {
      heading: '實踐熱情與快樂，創造自己的價值',
      body: '除了工作外，我很樂於學習，常參與外部的課程、工作坊來提升自我。我喜歡分享學習到的知識，於是開始寫作、成立粉專及擔任 UIUX 家教、講師，以及參與志工去協助協會舉辦活動，希望能以一己之力，讓台灣的 UX 環境更好。',
    },
    workshop: {
      heading: ['UXUI ', 'Workshop'],
      body: '我根據學生的學習需求規劃一系列 UI/UX 課程，以實作與互動為核心，引導學生在動手設計的過程中理解觀念，逐步累積解決問題的能力。',
      events: [
        { title: '臺灣科技大學 - EMBA', period: '2021/04 – 2021/06' },
        { title: '元智大學 - 終身教育部', period: '2022/06 – 2023/08' },
        { title: '政治大學 - 新媒體創藝行動家通識課', period: '2022/06 – 2023/08' },
        { title: '清華大學 - DTDA', period: '2024/10' },
        { title: 'UXCX 年度趨勢聯合工作坊', period: '2023, 2024' },
        { title: '行動應用創新賽 - UI/UX 設計', period: '2026/04' },
      ].map((e, i) => ({ ...e, photo: workshopPhotos[i] })),
    },
    uxtw: {
      title: 'UXTW 台灣使用者經驗設計協會',
      body: '我在 UXTW 台灣使用者經驗設計協會擔任教學組志工，參與年度課程規劃、講師提案與籌備協調，推動設計知識分享與社群交流。',
      period: '2020 – 2021',
      photo: 'uxtw',
    },
    mentorship: {
      heading: 'The MentorShip 曼陀號領航計畫',
      body: '通過主辦單位遴選，擔任第四屆曼陀號領航計畫航海士（小組組長），帶領組員參與工作坊討論，促進觀點交流與團隊協作。',
      photos: mentorshipPhotos,
    },
  },
}
