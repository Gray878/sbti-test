import { Locale } from "@/i18n/routing";
import {
  DimensionKey,
  ScoreLevel,
  SbtiDimensionMeta,
  SbtiRegularQuestion,
  SbtiSpecialQuestion,
  SbtiTypeProfile,
  sbtiData,
} from "@/lib/sbti";

interface QuestionCopy {
  text: string;
  options: string[];
}

export interface SbtiLocalizedContent {
  questions: SbtiRegularQuestion[];
  specialQuestions: SbtiSpecialQuestion[];
  typeLibrary: Record<string, SbtiTypeProfile>;
  dimensionMeta: Record<DimensionKey, SbtiDimensionMeta>;
  dimExplanations: Record<DimensionKey, Record<ScoreLevel, string>>;
  dimensionOrder: DimensionKey[];
}

function localizeQuestions<T extends SbtiRegularQuestion | SbtiSpecialQuestion>(
  questions: T[],
  copy: Record<string, QuestionCopy>
) {
  return questions.map((question) => {
    const localized = copy[question.id];

    if (!localized) {
      throw new Error(`Missing SBTI copy for question: ${question.id}`);
    }

    if (localized.options.length !== question.options.length) {
      throw new Error(`Option count mismatch for SBTI question: ${question.id}`);
    }

    return {
      ...question,
      text: localized.text,
      options: question.options.map((option, index) => ({
        ...option,
        label: localized.options[index],
      })),
    };
  });
}

function localizeTypeLibrary(copy: Record<string, Omit<SbtiTypeProfile, "code">>) {
  return Object.fromEntries(
    Object.keys(sbtiData.typeLibrary).map((code) => {
      const localized = copy[code];

      if (!localized) {
        throw new Error(`Missing SBTI type copy for type: ${code}`);
      }

      return [
        code,
        {
          code,
          ...localized,
        },
      ];
    })
  ) as Record<string, SbtiTypeProfile>;
}

const EN_QUESTION_COPY: Record<string, QuestionCopy> = {
  q1: {
    text:
      "Maybe I am not just a loser. Maybe I am the full tragic starter pack: clown, couch potato, terminally single, shy, insecure. My youth has basically been one long chain of delusional daydreams. Every day I imagine having a girl who would walk around with me, shop with me, hang out with me. Reality: I spent my parents' money, went to a mediocre school, drifted into a dead-end routine, and somehow became a three-nothing civilian with no dream, no goal, no ability. Every time I see people joking about losers online, I want to cry. I am like a rat underground, peeking at other people's good lives through a sewer crack. Every glimpse feels like psychic damage. Please leave a little oxygen for clowns like us. I really do not want to soak my pillow in tears in broad daylight.",
    options: ["That hurt...", "What did I just read...", "That is not me!"],
  },
  q2: {
    text: "I am not good enough. People around me are better than I am.",
    options: ["True", "Sometimes", "No"],
  },
  q3: {
    text: "I have a clear sense of who I really am.",
    options: ["Disagree", "Neutral", "Agree"],
  },
  q4: {
    text: "There is something I genuinely want in life.",
    options: ["Disagree", "Neutral", "Agree"],
  },
  q5: {
    text: "I have to keep climbing and become someone stronger.",
    options: ["Disagree", "Neutral", "Agree"],
  },
  q6: {
    text: "Other people's opinions are none of my damn business.",
    options: ["Disagree", "Neutral", "Agree"],
  },
  q7: {
    text:
      "Your partner has not replied for over five hours and says they had diarrhea. What is your first thought?",
    options: [
      "No way diarrhea takes five hours. Maybe they are hiding something from me.",
      "I swing between trust and suspicion.",
      "Maybe they really do feel awful today.",
    ],
  },
  q8: {
    text: "In relationships, I often worry that I will be abandoned.",
    options: ["Yes", "Sometimes", "No"],
  },
  q9: {
    text: "I swear to heaven: every relationship I enter, I take seriously.",
    options: [
      "Not really.",
      "Maybe?",
      "Yes. With a perfectly clear conscience.",
    ],
  },
  q10: {
    text:
      "Your romantic interest is respectful, gentle, disciplined, upright, eloquent, observant, worldly, talented, kind-hearted, radiant, and unfairly attractive. What happens next?",
    options: [
      "Even if they are amazing, I still will not fall in too deep.",
      "Somewhere between A and C.",
      "I would treasure them a lot and might become hopelessly love-brained.",
    ],
  },
  q11: {
    text: "Once you are dating, your partner becomes extremely clingy. How does that feel?",
    options: [
      "Honestly, kind of great.",
      "Either way is fine.",
      "I would rather keep some independent space.",
    ],
  },
  q12: {
    text: "In any relationship, personal space matters a lot to me.",
    options: [
      "I prefer dependence and being depended on.",
      "Depends.",
      "Yes. Absolutely.",
    ],
  },
  q13: {
    text: "Most people are good-hearted.",
    options: [
      "Honestly, rotten people feel way more common than saints.",
      "Maybe.",
      "Yes. I would rather believe there are more good people.",
    ],
  },
  q14: {
    text:
      "You are walking down the street when an absurdly cute little girl bounces over and offers you a lollipop. She is cute from every angle, on every phone camera, the full package. What is your reaction?",
    options: [
      "Aww, she is so sweet and adorable. She gave me a lollipop?!",
      "Total confusion. Head-scratch mode.",
      "This feels like some new kind of scam. Better walk away.",
    ],
  },
  q15: {
    text:
      "Exams are coming. School requires mandatory evening study, and asking for leave costs points. But tonight you already planned to play PUBG Mobile with your crush. What do you do?",
    options: [
      "Skip it. It is just this once.",
      "Fine, I will just ask for leave.",
      "Exams are around the corner. Why would I go?",
    ],
  },
  q16: {
    text: "I like breaking conventions and hate feeling restricted.",
    options: ["Agree", "Neutral", "Disagree"],
  },
  q17: {
    text: "I usually do things with a goal in mind.",
    options: ["Disagree", "Neutral", "Agree"],
  },
  q18: {
    text:
      "One day it suddenly hits me that life has no damn meaning. Humans are just animals driven by desire and hormones. Hungry, we eat. Tired, we sleep. Horny, we want sex. We are basically not that different from pigs and dogs.",
    options: [
      "That sounds about right.",
      "Maybe yes, maybe no.",
      "That is complete nonsense.",
    ],
  },
  q19: {
    text:
      "I usually act to get results and grow, not just to avoid trouble and risk.",
    options: ["Disagree", "Neutral", "Agree"],
  },
  q20: {
    text:
      "You have been constipated on the toilet for 30 minutes and still cannot go. Which are you more like?",
    options: [
      "Sit there another thirty minutes. Maybe something will happen.",
      "Slap my own butt and yell, 'Come on, useless ass, do your job!'",
      "Use a suppository. Let us solve this fast.",
    ],
  },
  q21: {
    text: "I make decisions fairly quickly and do not like dragging them out.",
    options: ["Disagree", "Neutral", "Agree"],
  },
  q22: {
    text: "There is no prompt for this question. Choose blindly.",
    options: [
      "After overthinking it, A feels right?",
      "Uh... maybe B?",
      "When in doubt, pick C?",
    ],
  },
  q23: {
    text:
      "When people say you 'have strong execution,' which line feels closest?",
    options: [
      "If I am pushed to the deadline, yeah, my execution suddenly becomes god-tier...",
      "Eh, sometimes.",
      "Yes. Things are supposed to move forward.",
    ],
  },
  q24: {
    text: "I often make plans, and...",
    options: [
      "plans rarely beat reality.",
      "sometimes I finish them, sometimes I do not.",
      "I hate it when my plans get disrupted.",
    ],
  },
  q25: {
    text:
      "You made a bunch of online friends through Identity V and they invite you to meet offline. What are you thinking?",
    options: [
      "Trash talk online is one thing. Meeting in person still feels a little nerve-racking.",
      "Meeting online friends sounds fine. If someone talks to me, I will chat a bit.",
      "I would dress up and chat enthusiastically. You never know. And I do mean never know.",
    ],
  },
  q26: {
    text: "A friend brings one of their friends to hang out. Which state are you most likely in?",
    options: [
      "I naturally keep a little distance from a 'friend of a friend' so I do not mess up the original dynamic.",
      "Depends on the person. If we vibe, we vibe.",
      "A friend's friend counts as my friend too. Time to chat warmly.",
    ],
  },
  q27: {
    text:
      "When I deal with people, I basically run on an invisible electric fence. Get too close and the alarm goes off.",
    options: ["Agree", "Neutral", "Disagree"],
  },
  q28: {
    text:
      "I want to be deeply close with people I trust, like long-lost family reunited.",
    options: ["Agree", "Neutral", "Disagree"],
  },
  q29: {
    text:
      "Sometimes you clearly have a different or negative opinion about something, but you keep it to yourself. Most of the time, why?",
    options: [
      "That does not happen to me often.",
      "Probably because of the mood or the relationship.",
      "I do not want people to realize I have a darker side.",
    ],
  },
  q30: {
    text: "I show different versions of myself around different people.",
    options: ["Disagree", "Neutral", "Agree"],
  },
  drink_gate_q1: {
    text: "What kind of hobbies do you usually have?",
    options: [
      "Eating, loafing around, surviving.",
      "Art and culture stuff.",
      "Drinking.",
      "Working out.",
    ],
  },
  drink_gate_q2: {
    text: "What is your relationship with alcohol like?",
    options: [
      "A little is nice. I cannot drink that much.",
      "I pour baijiu into a thermos and drink it like plain hot water. Alcohol has my respect.",
    ],
  },
};
const JA_QUESTION_COPY: Record<string, QuestionCopy> = {
  q1: {
    text:
      "自分はただの負け犬じゃない。ピエロで、干物で、今まで一度も恋愛したことがなくて、臆病で卑屈。青春はずっと妄想の連続だった。誰かと一緒に歩いて、買い物して、遊ぶ生活を毎日夢見ていた。でも現実は親の金を使い、微妙な学校に入り、なんとなく日々をやり過ごし、夢も目標も能力もない三無人間になった。ネットで弱者いじりを見るたび泣きたくなる。自分は下水の隙間から地上のキラキラをのぞいてるネズミみたいだ。こういう道化にも少しくらい生きる余地を残してくれ。昼間から枕を涙で濡らしたくない。",
    options: ["刺さった……", "何を読まされたんだ……", "いや、自分ではない"],
  },
  q2: {
    text: "自分はまだ足りない。周りの人のほうがみんな優秀だ。",
    options: ["その通り", "ときどきそう思う", "そうは思わない"],
  },
  q3: {
    text: "本当の自分がどんな人間か、かなり分かっている。",
    options: ["同意しない", "どちらでもない", "同意する"],
  },
  q4: {
    text: "自分の中には、本気で求めているものがある。",
    options: ["同意しない", "どちらでもない", "同意する"],
  },
  q5: {
    text: "もっと上に行きたいし、もっと強い人間になりたい。",
    options: ["同意しない", "どちらでもない", "同意する"],
  },
  q6: {
    text: "他人の評価なんて、わりとどうでもいい。",
    options: ["同意しない", "どちらでもない", "同意する"],
  },
  q7: {
    text:
      "恋人が5時間以上返信を返さず、『お腹を壊してた』と言ってきた。最初に何を思う？",
    options: [
      "下痢で5時間は長すぎる。何か隠しているかも。",
      "信じたいけど疑ってしまう。",
      "今日は本当に体調が悪かったのかも。",
    ],
  },
  q8: {
    text: "恋愛では、相手に捨てられるんじゃないかとよく不安になる。",
    options: ["はい", "たまに", "いいえ"],
  },
  q9: {
    text: "天に誓って言うけど、自分はどの恋愛にも本気だ。",
    options: ["いや別に", "たぶん？", "はい。本気です。"],
  },
  q10: {
    text:
      "あなたの恋人候補が、礼儀正しく、優しく、清潔で、堂々としていて、話もうまく、観察眼もあり、博識で、親切で、しかもめちゃくちゃ魅力的だったら、あなたはどうなる？",
    options: [
      "相手がどれだけ完璧でも、そこまで深くはハマらない。",
      "AとCの間くらい。",
      "すごく大切にするし、恋愛脳になるかもしれない。",
    ],
  },
  q11: {
    text: "付き合ったあと、相手がかなり甘えたでベタベタしてくる。どう思う？",
    options: [
      "むしろちょっと嬉しい。",
      "別にどっちでもいい。",
      "ある程度は一人の空間がほしい。",
    ],
  },
  q12: {
    text: "どんな関係でも、自分の個人スペースはかなり大事だ。",
    options: [
      "依存するのも、されるのもわりと好き。",
      "相手次第。",
      "はい。かなり大事。",
    ],
  },
  q13: {
    text: "大半の人は善良だと思う。",
    options: [
      "いや、ろくでもない人のほうがずっと多い気がする。",
      "たぶん。",
      "はい。善人のほうが多いと信じたい。",
    ],
  },
  q14: {
    text:
      "街を歩いていたら、どの角度から見てもやたら可愛い小さな女の子が、ぴょこぴょこ近寄ってきて棒付きキャンディを差し出してきた。何を思う？",
    options: [
      "うわ、可愛すぎるし優しすぎる。しかもキャンディまでくれるの！？",
      "え、何これ、と困って頭をかく。",
      "新手の詐欺では？ ここは離れたほうがいい。",
    ],
  },
  q15: {
    text:
      "試験前で、学校は夜の自習が必須。休むと減点される。でも今夜は好きな人と『PUBG MOBILE』で遊ぶ約束をしている。どうする？",
    options: [
      "サボる。こんなの一回くらいいいでしょ。",
      "もう欠席届を出す。",
      "試験前なのに行く意味ある？",
    ],
  },
  q16: {
    text: "自分は常識を壊すのが好きで、縛られるのが嫌いだ。",
    options: ["同意する", "どちらでもない", "同意しない"],
  },
  q17: {
    text: "何かをするときは、たいてい目的を持っている。",
    options: ["同意しない", "どちらでもない", "同意する"],
  },
  q18: {
    text:
      "ある日突然、人生に大した意味なんてないと気づく。人間は結局、欲望とホルモンに振り回される動物だ。腹が減れば食べ、眠ければ寝て、発情すれば交尾したくなる。豚や犬とそこまで変わらない。",
    options: [
      "まあ、そういう面はある。",
      "そうかもしれないし、違うかもしれない。",
      "さすがに暴論だ。",
    ],
  },
  q19: {
    text:
      "自分は面倒やリスクを避けるためより、成果や成長のために動くことが多い。",
    options: ["同意しない", "どちらでもない", "同意する"],
  },
  q20: {
    text:
      "便秘で30分も便座に座っているのに出なくてつらい。そんなときの自分に近いのは？",
    options: [
      "さらに30分座る。もしかしたら出るかもしれない。",
      "自分のお尻を叩いて『頼むから出てくれ！』と言う。",
      "浣腸なり何なり使って、さっさと解決する。",
    ],
  },
  q21: {
    text: "決断は比較的早く、ぐずぐず悩むのは好きじゃない。",
    options: ["同意しない", "どちらでもない", "同意する"],
  },
  q22: {
    text: "この問題には設問がありません。勘で選んでください。",
    options: ["考えた末にAっぽい？", "えっと、Bにする？", "迷ったらC？"],
  },
  q23: {
    text:
      "人から『実行力がある』と言われたとき、内心いちばん近いのはどれ？",
    options: [
      "追い込まれたときだけ異常に実行力が出る……",
      "まあ、たまには。",
      "はい。物事は前に進めるものだから。",
    ],
  },
  q24: {
    text: "自分はわりと計画を立てる。でも……",
    options: [
      "計画より変化のほうが速い。",
      "できるときもあれば、できないときもある。",
      "計画を乱されるのが嫌いだ。",
    ],
  },
  q25: {
    text:
      "『第五人格』で知り合ったネットの友達にオフ会へ誘われた。何を思う？",
    options: [
      "ネットで騒ぐのはいいけど、実際に会うのはちょっと緊張する。",
      "会っても別にいい。話しかけられたら少し話す。",
      "ちゃんと身なりを整えて、明るく話す。万が一ってあるし、ほんとに万が一ね。",
    ],
  },
  q26: {
    text:
      "友達がそのまた友達を連れて遊びに来た。自分の状態に近いのは？",
    options: [
      "『友達の友達』には少し距離を取る。元の関係を壊したくない。",
      "相手次第。合いそうなら普通に遊ぶ。",
      "友達の友達も、もう友達でしょ。ちゃんと話しに行く。",
    ],
  },
  q27: {
    text:
      "人付き合いには電子フェンスがある感じで、近づかれすぎると自動で警報が鳴る。",
    options: ["同意する", "どちらでもない", "同意しない"],
  },
  q28: {
    text:
      "信頼している人とは、離れ離れだった親戚みたいに濃い関係になりたい。",
    options: ["同意する", "どちらでもない", "同意しない"],
  },
  q29: {
    text:
      "本当は否定的な意見を持っているのに、最後まで言わないことがある。多くの場合、その理由は？",
    options: [
      "そういうこと自体あまりない。",
      "空気や関係性を気にしてしまう。",
      "自分の陰っぽい部分を知られたくない。",
    ],
  },
  q30: {
    text: "相手によって、見せる自分がかなり変わる。",
    options: ["同意しない", "どちらでもない", "同意する"],
  },
  drink_gate_q1: {
    text: "普段の趣味はどれに近い？",
    options: [
      "食って飲んでだらだらする",
      "芸術やカルチャー系",
      "飲酒",
      "筋トレ",
    ],
  },
  drink_gate_q2: {
    text: "飲酒に対する自分のスタンスは？",
    options: [
      "ほどほどに嗜む程度。そんなには飲めない。",
      "白酒を魔法瓶に入れて白湯みたいに飲む。アルコールこそ信仰だ。",
    ],
  },
};

const EN_DIMENSION_META: Record<DimensionKey, SbtiDimensionMeta> = {
  S1: { name: "S1 Self-Esteem & Confidence", model: "Self Model" },
  S2: { name: "S2 Self-Clarity", model: "Self Model" },
  S3: { name: "S3 Core Values", model: "Self Model" },
  E1: { name: "E1 Attachment Security", model: "Emotion Model" },
  E2: { name: "E2 Emotional Investment", model: "Emotion Model" },
  E3: { name: "E3 Boundaries & Dependence", model: "Emotion Model" },
  A1: { name: "A1 Worldview Orientation", model: "Attitude Model" },
  A2: { name: "A2 Rules & Flexibility", model: "Attitude Model" },
  A3: { name: "A3 Sense of Meaning", model: "Attitude Model" },
  Ac1: { name: "Ac1 Motivation Direction", model: "Action Drive Model" },
  Ac2: { name: "Ac2 Decision Style", model: "Action Drive Model" },
  Ac3: { name: "Ac3 Execution Pattern", model: "Action Drive Model" },
  So1: { name: "So1 Social Initiative", model: "Social Model" },
  So2: { name: "So2 Interpersonal Boundaries", model: "Social Model" },
  So3: { name: "So3 Expression & Authenticity", model: "Social Model" },
};

const JA_DIMENSION_META: Record<DimensionKey, SbtiDimensionMeta> = {
  S1: { name: "S1 自尊心と自信", model: "自己モデル" },
  S2: { name: "S2 自己明確性", model: "自己モデル" },
  S3: { name: "S3 コア価値観", model: "自己モデル" },
  E1: { name: "E1 愛着の安心感", model: "感情モデル" },
  E2: { name: "E2 感情の投入度", model: "感情モデル" },
  E3: { name: "E3 境界と依存", model: "感情モデル" },
  A1: { name: "A1 世界観の傾向", model: "態度モデル" },
  A2: { name: "A2 規則と柔軟性", model: "態度モデル" },
  A3: { name: "A3 人生の意味感", model: "態度モデル" },
  Ac1: { name: "Ac1 動機の向き", model: "行動ドライブモデル" },
  Ac2: { name: "Ac2 意思決定スタイル", model: "行動ドライブモデル" },
  Ac3: { name: "Ac3 実行パターン", model: "行動ドライブモデル" },
  So1: { name: "So1 社交の積極性", model: "社交モデル" },
  So2: { name: "So2 対人境界感", model: "社交モデル" },
  So3: { name: "So3 表現と本音度", model: "社交モデル" },
};

const EN_DIM_EXPLANATIONS: Record<DimensionKey, Record<ScoreLevel, string>> = {
  S1: {
    L: "You criticize yourself harder than other people do. Even compliments get sent to verification first.",
    M: "Your confidence changes with the weather. Tailwind and you soar; headwind and you duck.",
    H: "You have a fairly steady sense of self and do not get wrecked by one random opinion.",
  },
  S2: {
    L: "The channel inside your head has a lot of static. 'Who am I?' keeps buffering.",
    M: "Most days you recognize yourself fine, but strong feelings can temporarily hijack the account.",
    H: "You know your temper, your desires, and your limits pretty well.",
  },
  S3: {
    L: "Comfort and safety rank high. Life does not need to be a daily sprint.",
    M: "You want growth, but you also want to lie down a little. Your values hold internal meetings all the time.",
    H: "Goals, growth, or a strong belief easily push you forward.",
  },
  E1: {
    L: "Your relationship alarm system is hyper-sensitive. Even a delayed reply can turn into apocalypse fanfic.",
    M: "Half trust, half testing. Relationships often feel like an internal tug-of-war.",
    H: "You would rather trust the relationship itself and do not get blown apart by every small sign.",
  },
  E2: {
    L: "You invest in love cautiously. The heart is not closed; the security gate is just strict.",
    M: "You can give a lot, but you still keep a backup plan.",
    H: "Once you decide someone matters, you go in seriously with full feelings and energy.",
  },
  E3: {
    L: "You can be clingy and attract clinginess. Warmth matters a lot in relationships.",
    M: "You need both closeness and independence. Your attachment style is adjustable.",
    H: "Space matters. No matter how much you care, you still need a piece of ground that is yours.",
  },
  A1: {
    L: "You look at the world through a defensive filter: doubt first, approach second.",
    M: "You are neither naive nor fully conspiratorial. Watching from the side is your instinct.",
    H: "You are more willing to believe in human decency and do not rush to sentence the world.",
  },
  A2: {
    L: "If rules can be bent, you will bend them. Comfort and freedom usually come first.",
    M: "You follow rules when they make sense and flex when they do not.",
    H: "You like order. If a process exists, you would rather use it than freestyle a disaster.",
  },
  A3: {
    L: "Your sense of meaning runs low, so many things feel like going through the motions.",
    M: "Sometimes you have direction, sometimes you want to rot in bed. Your worldview is half-booted.",
    H: "You move with more direction and usually know roughly where you are headed.",
  },
  Ac1: {
    L: "Before ambition boots up, your anti-crash system does.",
    M: "Sometimes you want to win; sometimes you just want less trouble. Motivation is mixed.",
    H: "Results, growth, and forward motion light you up easily.",
  },
  Ac2: {
    L: "Before deciding, your brain likes a few extra laps. Internal meetings often run overtime.",
    M: "You think it through, but not to the point of system failure.",
    H: "You decide fast. Once the board is set, you hate circling back to overtalk it.",
  },
  Ac3: {
    L: "Your execution has a deep emotional bond with deadlines. The later it gets, the more awakened you become.",
    M: "You can do it, but timing matters. Sometimes steady, sometimes completely limp.",
    H: "You have strong drive to push things forward. Unfinished tasks feel like a splinter in the brain.",
  },
  So1: {
    L: "You warm up to socializing slowly. Starting contact usually takes a while to charge.",
    M: "If someone comes over, you respond. If nobody does, you do not force it.",
    H: "You are more willing to open the room yourself and do not mind being visible in a crowd.",
  },
  So2: {
    L: "In relationships, you lean toward closeness and merging. Once people feel safe, they get pulled into the inner circle.",
    M: "You want intimacy and breathing room at the same time. Boundaries change by person.",
    H: "Your boundaries are strong. If someone gets too close, your body takes half a step back on instinct.",
  },
  So3: {
    L: "You speak more directly. If something is on your mind, you usually do not wrap it in much ribbon.",
    M: "You read the room. Honesty and social grace both get a little share.",
    H: "You are skilled at switching selves across contexts. Authenticity gets released in layers.",
  },
};

const JA_DIM_EXPLANATIONS: Record<DimensionKey, Record<ScoreLevel, string>> = {
  S1: {
    L: "自分への当たりが人より厳しい。褒め言葉すらまず真偽確認したくなる。",
    M: "自信は天気予報みたいに変わる。追い風なら飛べるが、向かい風だとすぐ縮こまる。",
    H: "自分の輪郭はだいたい掴めていて、通りすがりの一言で崩れにくい。",
  },
  S2: {
    L: "頭の中のチャンネルにノイズが多く、『自分って何者？』がずっと読み込み中。",
    M: "普段は自分を見失わないが、感情にアカウントを乗っ取られる日もある。",
    H: "自分の気質、欲望、限界線をかなり分かっている。",
  },
  S3: {
    L: "快適さと安全が優先。人生を毎日全力ダッシュにする必要はない。",
    M: "上に行きたい気持ちも、ちょっと寝ていたい気持ちもある。価値観はしょっちゅう会議中。",
    H: "目標や成長、強い信念があるとかなり前へ進める。",
  },
  E1: {
    L: "恋愛の警報機が敏感すぎる。既読無視だけで最悪の結末まで想像できる。",
    M: "半分信じて半分探る。恋愛は心の中で綱引きになりがち。",
    H: "関係そのものを信じやすく、少しの揺れで崩れにくい。",
  },
  E2: {
    L: "感情の投資は慎重。心を閉じているというより、入館審査が厳しい。",
    M: "ちゃんと投入はするが、全部は賭けずに保険も残す。",
    H: "いったん本気になると感情もエネルギーもかなり注ぐ。",
  },
  E3: {
    L: "くっつくのもくっつかれるのも起きやすい。関係の温度感が大事。",
    M: "親密さも自立も欲しい。依存の量を調整できるタイプ。",
    H: "自分の空間はかなり重要。どれだけ好きでも全部は明け渡さない。",
  },
  A1: {
    L: "世界を見るとき、まず防御フィルターが入る。信じる前に疑う。",
    M: "無邪気でも陰謀論でもない。まず様子を見るのが本能。",
    H: "人の善意や人間性を比較的信じやすく、すぐ世界に死刑宣告しない。",
  },
  A2: {
    L: "抜け道があれば使いたい。快適さと自由がだいたい先に来る。",
    M: "守るべきときは守るし、変えるべきときは柔軟に変える。",
    H: "秩序感が強め。手順があるなら、即興で爆発するよりそちらを選ぶ。",
  },
  A3: {
    L: "意味感が低めで、多くのことがただの通過儀礼に見えやすい。",
    M: "目標がある日もあれば、全部投げたい日もある。人生観は半起動状態。",
    H: "動く方向が比較的はっきりしていて、自分がどこへ向かうか分かっている。",
  },
  Ac1: {
    L: "野心が起動する前に、事故回避システムのほうが先に立ち上がる。",
    M: "勝ちたい時もあれば、ただ面倒を避けたい時もある。動機は混ざり気味。",
    H: "成果、成長、前進の感覚に火が付きやすい。",
  },
  Ac2: {
    L: "決める前に何周も考える。頭の中の会議はたいてい延長戦。",
    M: "ちゃんと考えるけれど、フリーズするほどではない。普通の迷い方。",
    H: "決断は速い。一度決めたら何度も蒸し返すのが嫌い。",
  },
  Ac3: {
    L: "実行力は締切と深い縁がある。遅くなるほど覚醒しやすい。",
    M: "やれるけれど、タイミングと調子に左右される。安定の日もあればだらける日もある。",
    H: "前に進めたい欲が強い。未完了のままだと頭に刺が刺さった感じになる。",
  },
  So1: {
    L: "社交はスロースタート。自分から動くにはだいぶ充電がいる。",
    M: "来られたら応じるし、誰も来なければ無理には行かない。",
    H: "自分から場を開きやすく、人前で目立つこともそこまで怖くない。",
  },
  So2: {
    L: "関係では近さと一体感を求めやすい。安心すると内側に入れやすい。",
    M: "近づきたい気持ちと隙間を残したい気持ちが両方ある。",
    H: "境界線は強め。近づかれすぎると反射で半歩引く。",
  },
  So3: {
    L: "表現は比較的ストレート。思っていることをあまり包まない。",
    M: "空気を見て話す。正直さと体面をどちらも少し残す。",
    H: "場面ごとの自分の切り替えがうまい。本音は層を分けて出す。",
  },
};

const EN_TYPE_LIBRARY = localizeTypeLibrary({
  CTRL: {
    cn: "Controller",
    intro: "You take the wheel before anyone asks.",
    desc: "CTRL types naturally take over messy situations and turn chaos into process. They tend to behave like a human reset button for disorganized lives.",
  },
  "ATM-er": {
    cn: "The Giver",
    intro: "You keep paying in time, energy, and patience.",
    desc: "ATM-er does not just pay in money. This type often pays with time, energy, patience, and emotional labor, which makes them dependable but also easy to overuse.",
  },
  "Dior-s": {
    cn: "The Loser-Sage",
    intro: "You can smell fake ambition from miles away.",
    desc: "Dior-s rejects empty ambition theater. This type often sees through status games early and would rather stay comfortable and clear-eyed than perform fake self-improvement.",
  },
  BOSS: {
    cn: "Leader",
    intro: "Hand me the wheel. I will drive.",
    desc: "BOSS personalities like to hold the wheel. They care about results, pace, and order, and often move through life as if everything is a project that needs a stronger operator.",
  },
  "THAN-K": {
    cn: "The Thankful One",
    intro: "You can still find something worth thanking.",
    desc: "THAN-K tends to salvage meaning from bad situations. They are not naive so much as naturally oriented toward gratitude, softness, and emotional renewal.",
  },
  "OH-NO": {
    cn: "Disaster Preventer",
    intro: "Your brain runs disaster drills for fun.",
    desc: "OH-NO types mentally run failure scenarios before others even notice danger. They often look cautious, but their caution is exactly what keeps systems from collapsing.",
  },
  GOGO: {
    cn: "The Doer",
    intro: "Thinking is nice. Moving is better.",
    desc: "GOGO prefers momentum over reflection. This type hates leaving things in planning limbo and usually feels best when tasks are moving, closing, and disappearing.",
  },
  SEXY: {
    cn: "The Magnetic One",
    intro: "Attention finds you on its own.",
    desc: "SEXY is less about literal beauty and more about undeniable presence. They tend to pull focus without trying very hard.",
  },
  "LOVE-R": {
    cn: "Romantic Maximalist",
    intro: "Your feelings never come in half sizes.",
    desc: "LOVE-R experiences feelings at full volume. Ordinary moments easily become emotionally symbolic, and relationships are often treated with unusual seriousness.",
  },
  MUM: {
    cn: "The Mother",
    intro: "You take care of everyone a little too well.",
    desc: "MUM is good at noticing what others need and stepping in gently. The weakness is that this kindness often gets distributed outward long before it reaches the self.",
  },
  FAKE: {
    cn: "Mask Shifter",
    intro: "You switch masks so smoothly it gets complicated.",
    desc: "FAKE can switch modes quickly depending on context. That flexibility is socially powerful, but it can also blur where performance ends and the real self begins.",
  },
  OJBK: {
    cn: "Whatever Person",
    intro: "When you say whatever, you actually mean it.",
    desc: "OJBK is not necessarily empty of preference. They simply refuse to waste dramatic energy on choices that do not matter much.",
  },
  MALO: {
    cn: "Monkey Brain Trickster",
    intro: "Life is a side quest, and you refuse to play it straight.",
    desc: "MALO treats life like a side quest full of jumps, detours, and jokes. This type dislikes total behavioral domestication and often finds fun where structure fails.",
  },
  "JOKE-R": {
    cn: "Clown",
    intro: "You turn pain into punchlines.",
    desc: "JOKE-R keeps rooms alive by turning pain into performance. Their jokes can be both social talent and emotional armor.",
  },
  "WOC!": {
    cn: 'The "Whoa" Person',
    intro: "One dramatic 'whoa' says it all.",
    desc: "WOC! may look exaggerated on the surface, but the inside is often more measured than it seems. The dramatic outburst is usually their final comment, not the start of intervention.",
  },
  "THIN-K": {
    cn: "Thinker",
    intro: "Your brain is already fact-checking the room.",
    desc: "THIN-K likes to check claims, motives, evidence, and hidden bias. Their silence often means internal review, not absence.",
  },
  SHIT: {
    cn: "Bitter World-Saver",
    intro: "You roast the world and still clean up after it.",
    desc: "SHIT complains about everything yet still cleans up disasters. The contradiction is the point: irritation does not stop them from carrying weight.",
  },
  ZZZZ: {
    cn: "The Deadliner",
    intro: "You awaken when the deadline is breathing on your neck.",
    desc: "ZZZZ may look absent until the deadline becomes real. Once pressure spikes, they often wake up all at once.",
  },
  POOR: {
    cn: "The Narrow Beam",
    intro: "Everything gets cut except the one thing that matters.",
    desc: "POOR is poor only in the sense that attention gets concentrated instead of spread. This type can ignore almost everything except the one target they truly care about.",
  },
  MONK: {
    cn: "Monk",
    intro: "Closeness is fine. Losing your space is not.",
    desc: "MONK values separation and calm. They are not cold by accident; they simply believe intimacy must never erase independence.",
  },
  IMSB: {
    cn: "The Self-Defeating Fool",
    intro: "Your inner hype man and inner hater are at war.",
    desc: "IMSB often swings between go for it and you will embarrass yourself. What looks like hesitation is usually an internal civil war.",
  },
  SOLO: {
    cn: "The Isolated One",
    intro: "You step back first so nobody rejects you first.",
    desc: "SOLO protects the self by backing away first. Their harsh shell often covers a strong fear of rejection and abandonment.",
  },
  FUCK: {
    cn: "Wild Force",
    intro: "You choose raw life over polite containment.",
    desc: "FUCK rejects polite containment. This type values intensity, freedom, and living force more than socially approved behavior.",
  },
  DEAD: {
    cn: "The Exhausted Sage",
    intro: "You look at the game like you already finished it.",
    desc: "DEAD feels like someone who has already emotionally finished the game. They often move with a detached sense that many ordinary goals are no longer worth much.",
  },
  IMFW: {
    cn: "Fragile Believer",
    intro: "You trust too deeply once you feel safe.",
    desc: "IMFW tends to trust deeply once safety is felt. Their vulnerability often comes not from incompetence but from being too sincere and too easy to reach.",
  },
  HHHH: {
    cn: "Fallback Laugher",
    intro: "The system looked at you and gave up laughing.",
    desc: "HHHH is less a normal type than a sign that the answer pattern resisted clean classification. It is the test admitting that the standard library ran out of confidence.",
  },
  DRUNK: {
    cn: "Drunkard",
    intro: "Alcohol has seized control of the dashboard.",
    desc: "DRUNK is the test's hidden joke result. It is activated through the special drinking path and exists more as a dramatic easter egg than a standard personality profile.",
  },
});
const JA_TYPE_LIBRARY = localizeTypeLibrary({
  CTRL: {
    cn: "支配者",
    intro: "気づけば場のハンドルを握っている。",
    desc: "CTRL は混乱した状況で自然に主導権を握り、物事をルールと手順へ戻していくタイプです。カオスを再配置する力が強い人格です。",
  },
  "ATM-er": {
    cn: "差し出す人",
    intro: "気づくと自分の時間も体力も差し出している。",
    desc: "ATM-er はお金だけでなく、時間、体力、感情的コストまで払ってしまいやすいタイプです。頼れる一方で、消耗もしやすいです。",
  },
  "Dior-s": {
    cn: "負け犬賢者",
    intro: "見せかけの向上心にはもう乗らない。",
    desc: "Dior-s は成功演出や見せかけの向上心に乗りません。楽さ、現実、騙されないことを優先する冷静な人格です。",
  },
  BOSS: {
    cn: "リーダー",
    intro: "ハンドルは自分が握る。",
    desc: "BOSS は『自分が舵を取る』ことを好みます。効率、結果、秩序への要求が強く、流れを作る側に回りやすいタイプです。",
  },
  "THAN-K": {
    cn: "感謝する人",
    intro: "悪い日でも拾えるものを探してしまう。",
    desc: "THAN-K は悪い出来事の中からも意味や救いを見つけやすい人格です。鈍感なのではなく、再生に向いた視点を持っています。",
  },
  "OH-NO": {
    cn: "災害予防人",
    intro: "最悪の展開を先に想像して塞ぎにいく。",
    desc: "OH-NO は問題が起きる前に最悪の展開を想定し、先回りして塞ぐタイプです。慎重さがそのまま防御力になっています。",
  },
  GOGO: {
    cn: "突進者",
    intro: "考えるより先に進めたい。",
    desc: "GOGO は考え続けるより先に動きます。計画を寝かせるより、目の前の作業をどんどん片付ける方が得意です。",
  },
  SEXY: {
    cn: "魔性の人",
    intro: "目立とうとしなくても目立ってしまう。",
    desc: "SEXY は見た目だけではなく、場の空気を引き寄せる雰囲気を持つ人格です。特別な演出がなくても目立ちやすいです。",
  },
  "LOVE-R": {
    cn: "多情家",
    intro: "感情のボリュームがいつも大きい。",
    desc: "LOVE-R は普通の出来事を濃い感情体験として受け取りやすいタイプです。恋愛や関係性をとても重く、深く扱います。",
  },
  MUM: {
    cn: "母性タイプ",
    intro: "人を包み込むのがうますぎる。",
    desc: "MUM は人の感情変化に敏感で、自然に寄り添うことができます。ただし、その優しさは自分より他人に先に向かいがちです。",
  },
  FAKE: {
    cn: "擬態者",
    intro: "場に合わせて人格を切り替えるのがうまい。",
    desc: "FAKE は相手や場に応じて振る舞いを変えるのが非常に上手いタイプです。その強みの反面、『本当の自分』が曖昧になることもあります。",
  },
  OJBK: {
    cn: "どうでもいい人",
    intro: "どうでもいいことは本当にどうでもいい。",
    desc: "OJBK は何も考えていないのではなく、些細な選択にドラマを持ち込みません。重要でないことは本当にどうでもいいのです。",
  },
  MALO: {
    cn: "いたずら猿",
    intro: "人生をまともに一本線でやる気がない。",
    desc: "MALO は人生を真面目な直線ではなく、寄り道とひらめきのある副本のように扱います。規範に完全には馴染みません。",
  },
  "JOKE-R": {
    cn: "道化師",
    intro: "本音はたいてい冗談の裏に隠れている。",
    desc: "JOKE-R は笑いで空気を支える一方、本音を冗談の裏に隠しやすい人格です。武器でもあり、防具でもあります。",
  },
  "WOC!": {
    cn: "うわっ人間",
    intro: "『うわっ』でだいたい全部言っている。",
    desc: "WOC! は表向きには驚いたり騒いだりしますが、内面では意外と冷静です。大きな反応が、そのまま結論だったりします。",
  },
  "THIN-K": {
    cn: "思考者",
    intro: "頭の中ではもう検証会議が始まっている。",
    desc: "THIN-K は情報をそのまま受け取らず、根拠・偏見・構造まで確認したくなるタイプです。無言の時間もたいてい思考中です。",
  },
  SHIT: {
    cn: "厭世救助者",
    intro: "文句を言いながら結局片付ける。",
    desc: "SHIT は世界にも人にも文句を言いますが、最終的には自分で片付けてしまうことが多いです。嫌悪と責任感が同居しています。",
  },
  ZZZZ: {
    cn: "擬死者",
    intro: "締切が近づいてから本気を出す。",
    desc: "ZZZZ は普段は寝ているように見えて、期限が迫った瞬間に急に起動するタイプです。切羽詰まるほど力が出ます。",
  },
  POOR: {
    cn: "一点集中者",
    intro: "一点に全部注いで他を切る。",
    desc: "POOR は資源が少ないというより、重要な一点に全てを注ぎ込むタイプです。その分、他のことには極端に無関心になります。",
  },
  MONK: {
    cn: "僧",
    intro: "近すぎる関係は少し息苦しい。",
    desc: "MONK は自分だけの空間をとても大切にします。親しさがあっても、独立性まで失うことは望みません。",
  },
  IMSB: {
    cn: "自滅型バカ",
    intro: "『行け』と『やめろ』が同時に鳴る。",
    desc: "IMSB は『行け』と『やめろ』が同時に鳴る人格です。外から見ると優柔不断でも、内側では激しい対立が起きています。",
  },
  SOLO: {
    cn: "孤立者",
    intro: "傷つく前に先に距離を取る。",
    desc: "SOLO は拒絶される前に先に距離を取ることで自分を守ろうとします。冷たさの下には繊細さがあります。",
  },
  FUCK: {
    cn: "野生力",
    intro: "整った生き方より生の勢いを選ぶ。",
    desc: "FUCK は社会的に整った人間像よりも、荒々しい生命感を重視します。ルールより感覚を優先しがちな人格です。",
  },
  DEAD: {
    cn: "燃え尽きた賢者",
    intro: "もう一通り見たような顔で世界を見ている。",
    desc: "DEAD は多くの一般的な目標にすでに疲れているような感覚を持つタイプです。無気力というより、距離を置いています。",
  },
  IMFW: {
    cn: "むき出しの人",
    intro: "安心した相手には無防備すぎる。",
    desc: "IMFW は安全だと思えた相手に深く寄りかかりやすい人格です。弱点は能力不足より、無防備な誠実さにあります。",
  },
  HHHH: {
    cn: "強制割当型",
    intro: "分類不能のまま笑うしかなくなった。",
    desc: "HHHH は通常人格というより、標準ライブラリがうまく当てはめられなかった時の保険枠です。分類の限界がそのまま結果になります。",
  },
  DRUNK: {
    cn: "酒鬼",
    intro: "もう酒がシステムを乗っ取っている。",
    desc: "DRUNK はテスト内のイースターエッグ的な人格です。通常タイプというより、飲酒選択肢がシステムを乗っ取る演出結果です。",
  },
});

const ZH_CONTENT: SbtiLocalizedContent = {
  questions: sbtiData.questions,
  specialQuestions: sbtiData.specialQuestions,
  typeLibrary: sbtiData.typeLibrary,
  dimensionMeta: sbtiData.dimensionMeta,
  dimExplanations: sbtiData.dimExplanations,
  dimensionOrder: sbtiData.dimensionOrder,
};

const EN_CONTENT: SbtiLocalizedContent = {
  questions: localizeQuestions(sbtiData.questions, EN_QUESTION_COPY),
  specialQuestions: localizeQuestions(sbtiData.specialQuestions, EN_QUESTION_COPY),
  typeLibrary: EN_TYPE_LIBRARY,
  dimensionMeta: EN_DIMENSION_META,
  dimExplanations: EN_DIM_EXPLANATIONS,
  dimensionOrder: sbtiData.dimensionOrder,
};

const JA_CONTENT: SbtiLocalizedContent = {
  questions: localizeQuestions(sbtiData.questions, JA_QUESTION_COPY),
  specialQuestions: localizeQuestions(sbtiData.specialQuestions, JA_QUESTION_COPY),
  typeLibrary: JA_TYPE_LIBRARY,
  dimensionMeta: JA_DIMENSION_META,
  dimExplanations: JA_DIM_EXPLANATIONS,
  dimensionOrder: sbtiData.dimensionOrder,
};

export function getSbtiContent(locale: Locale): SbtiLocalizedContent {
  switch (locale) {
    case "en":
      return EN_CONTENT;
    case "ja":
      return JA_CONTENT;
    default:
      return ZH_CONTENT;
  }
}
