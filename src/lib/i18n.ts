export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

type Dictionary = {
  nav: {
    home: string;
    oracle: string;
    tcm: string;
    history: string;
    admin: string;
    login: string;
    register: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaOracle: string;
    ctaTcm: string;
    ctaLogin: string;
  };
  feature: {
    title: string;
    desc: string;
  }[];
  ritual: {
    title: string;
    subtitle: string;
    steps: string[];
  };
  oracle: {
    title: string;
    subtitle: string;
    placeholder: string;
    systemHint: string;
  };
  tcm: {
    title: string;
    subtitle: string;
    placeholder: string;
    systemHint: string;
  };
  history: {
    title: string;
    empty: string;
    view: string;
  };
  auth: {
    titleLogin: string;
    titleRegister: string;
    email: string;
    password: string;
    submit: string;
    switchToRegister: string;
    switchToLogin: string;
  };
  admin: {
    title: string;
    users: string;
    audits: string;
    export: string;
    ban: string;
    unban: string;
  };
  common: {
    loading: string;
    send: string;
    back: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  zh: {
    nav: {
      home: "玄策之门",
      oracle: "道法算命",
      tcm: "中医问诊",
      history: "问诊纪要",
      admin: "神机内殿",
      login: "登堂",
      register: "入门",
    },
    hero: {
      title: "玄策神机 · 道法问天",
      subtitle:
        "东方道法与中医秘术合一，以神秘天机为引，推演命理，洞悉体质，拈金丝为印。",
      ctaOracle: "开启道法占验",
      ctaTcm: "开启问诊推演",
      ctaLogin: "登堂入殿",
    },
    feature: [
      {
        title: "玄星布阵",
        desc: "灵气星盘与符箓阵列交织，融合天象与五行能量。",
      },
      {
        title: "灵脉问诊",
        desc: "从脉象、气血与体质推导专属调养之法。",
      },
      {
        title: "秘语回响",
        desc: "对话式神机回应，逐层解读命理与身心。",
      },
    ],
    ritual: {
      title: "问道仪式",
      subtitle: "玄策三步，引你入阵，方得真言。",
      steps: [
        "点燃心灯，启程问道",
        "输入疑惑，唤醒神机",
        "聆听启示，收录灵箴",
      ],
    },
    oracle: {
      title: "道法算命",
      subtitle: "讲述你的问题，神机将以卦象回响。",
      placeholder: "例如：今年事业与感情如何走向？",
      systemHint: "请以道法符箓、星象卦辞语气回复。",
    },
    tcm: {
      title: "中医问诊",
      subtitle: "描述症状与体质，神机将给出调养建议。",
      placeholder: "例如：长期失眠、口干、易疲劳。",
      systemHint: "请以中医辨证论治语气回复。",
    },
    history: {
      title: "问诊纪要",
      empty: "尚无记录，先开启一次问道。",
      view: "查看详情",
    },
    auth: {
      titleLogin: "登堂入殿",
      titleRegister: "玄策入门",
      email: "邮箱",
      password: "密码",
      submit: "确认",
      switchToRegister: "尚未入门？前往注册",
      switchToLogin: "已有身份？返回登录",
    },
    admin: {
      title: "神机内殿",
      users: "门人管理",
      audits: "审计卷轴",
      export: "导出记录",
      ban: "封禁",
      unban: "解封",
    },
    common: {
      loading: "推演中…",
      send: "传达",
      back: "返回",
    },
  },
  en: {
    nav: {
      home: "Mystic Gate",
      oracle: "Dao Oracle",
      tcm: "TCM Consultation",
      history: "Consultation Logs",
      admin: "Inner Sanctum",
      login: "Enter",
      register: "Join",
    },
    hero: {
      title: "Mystic Dao · Oracle of Destiny",
      subtitle:
        "Daoist divination meets TCM insight. Enter the golden veil, uncover fate, and read the pulse of your body and spirit.",
      ctaOracle: "Start Dao Oracle",
      ctaTcm: "Start TCM Session",
      ctaLogin: "Enter the Sanctum",
    },
    feature: [
      {
        title: "Celestial Array",
        desc: "A fusion of talismanic geometry and the five elements map.",
      },
      {
        title: "Vital Meridian",
        desc: "Decode constitution through pulse, qi, and essence patterns.",
      },
      {
        title: "Living Dialogue",
        desc: "Conversational oracle responses with layered insights.",
      },
    ],
    ritual: {
      title: "Ritual Flow",
      subtitle: "Three steps to align the gate and receive insight.",
      steps: [
        "Light your intent, enter the gate",
        "Offer your question, awaken the oracle",
        "Receive the revelation, archive the scroll",
      ],
    },
    oracle: {
      title: "Dao Oracle",
      subtitle: "Share your question and receive a celestial reading.",
      placeholder: "Example: How will my career evolve this year?",
      systemHint: "Respond with Daoist symbolism and cosmic tone.",
    },
    tcm: {
      title: "TCM Consultation",
      subtitle: "Describe your symptoms and constitution for advice.",
      placeholder: "Example: insomnia, dry mouth, constant fatigue.",
      systemHint: "Respond with TCM differentiation and guidance.",
    },
    history: {
      title: "Consultation Logs",
      empty: "No records yet. Begin a session first.",
      view: "View details",
    },
    auth: {
      titleLogin: "Enter the Sanctum",
      titleRegister: "Join the Dao",
      email: "Email",
      password: "Password",
      submit: "Confirm",
      switchToRegister: "New here? Create an account",
      switchToLogin: "Already a member? Back to login",
    },
    admin: {
      title: "Inner Sanctum",
      users: "User Registry",
      audits: "Audit Scrolls",
      export: "Export records",
      ban: "Ban",
      unban: "Restore",
    },
    common: {
      loading: "Divining…",
      send: "Send",
      back: "Back",
    },
  },
};

export const getDictionary = (locale: Locale) => dictionaries[locale] ?? dictionaries[defaultLocale];
