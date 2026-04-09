import rawData from "@/sbti_unun_dev_dump/output/data/sbti_data.json";

export type ScoreLevel = "L" | "M" | "H";
export type DimensionKey = keyof typeof rawData.dimensionMeta;

export interface SbtiDimensionMeta {
  name: string;
  model: string;
}

export interface SbtiOption {
  label: string;
  value: number;
}

export interface SbtiRegularQuestion {
  id: string;
  dim: DimensionKey;
  text: string;
  options: SbtiOption[];
  special?: false;
}

export interface SbtiSpecialQuestion {
  id: string;
  special: true;
  kind: string;
  text: string;
  options: SbtiOption[];
}

export type SbtiQuestion = SbtiRegularQuestion | SbtiSpecialQuestion;

export interface SbtiTypeProfile {
  code: string;
  cn: string;
  intro: string;
  desc: string;
}

export interface SbtiPatternType {
  code: string;
  pattern: string;
}

export interface RankedSbtiType extends SbtiTypeProfile, SbtiPatternType {
  distance: number;
  exact: number;
  similarity: number;
}

export interface ComputedSbtiResult {
  rawScores: Record<DimensionKey, number>;
  levels: Record<DimensionKey, ScoreLevel>;
  ranked: RankedSbtiType[];
  bestNormal: RankedSbtiType;
  finalType: SbtiTypeProfile;
  modeKicker: string;
  badge: string;
  sub: string;
  special: boolean;
  secondaryType: RankedSbtiType | null;
}

export type AnswerMap = Record<string, number>;

const typeImages = Object.fromEntries(
  Object.entries(rawData.TYPE_IMAGES).map(([code, src]) => [
    code,
    String(src).replace("./image/", "/sbti/images/"),
  ])
) as Record<string, string>;

export const sbtiData = {
  dimensionMeta: rawData.dimensionMeta as Record<DimensionKey, SbtiDimensionMeta>,
  questions: rawData.questions as SbtiRegularQuestion[],
  specialQuestions: rawData.specialQuestions as SbtiSpecialQuestion[],
  typeLibrary: rawData.TYPE_LIBRARY as Record<string, SbtiTypeProfile>,
  typeImages,
  normalTypes: rawData.NORMAL_TYPES as SbtiPatternType[],
  dimExplanations: rawData.DIM_EXPLANATIONS as Record<
    DimensionKey,
    Record<ScoreLevel, string>
  >,
  dimensionOrder: rawData.dimensionOrder as DimensionKey[],
};

export const DRINK_GATE_QUESTION_ID = "drink_gate_q1";
export const DRUNK_TRIGGER_QUESTION_ID = "drink_gate_q2";

export function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export function createQuestionFlow(): SbtiQuestion[] {
  const shuffledRegular = shuffleArray(sbtiData.questions);
  const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;

  return [
    ...shuffledRegular.slice(0, insertIndex),
    sbtiData.specialQuestions[0],
    ...shuffledRegular.slice(insertIndex),
  ];
}

export function getVisibleQuestions(
  flow: SbtiQuestion[],
  answers: AnswerMap
): SbtiQuestion[] {
  const visible = [...flow];
  const gateIndex = visible.findIndex((question) => question.id === DRINK_GATE_QUESTION_ID);

  if (gateIndex !== -1 && answers[DRINK_GATE_QUESTION_ID] === 3) {
    visible.splice(gateIndex + 1, 0, sbtiData.specialQuestions[1]);
  }

  return visible;
}

function sumToLevel(score: number): ScoreLevel {
  if (score <= 3) {
    return "L";
  }

  if (score === 4) {
    return "M";
  }

  return "H";
}

function levelNum(level: ScoreLevel): number {
  return { L: 1, M: 2, H: 3 }[level];
}

function parsePattern(pattern: string): ScoreLevel[] {
  return pattern.replace(/-/g, "").split("") as ScoreLevel[];
}

export function computeSbtiResult(answers: AnswerMap): ComputedSbtiResult {
  const rawScores = Object.fromEntries(
    sbtiData.dimensionOrder.map((dimension) => [dimension, 0])
  ) as Record<DimensionKey, number>;

  for (const question of sbtiData.questions) {
    rawScores[question.dim] += Number(answers[question.id] || 0);
  }

  const levels = Object.fromEntries(
    sbtiData.dimensionOrder.map((dimension) => [
      dimension,
      sumToLevel(rawScores[dimension]),
    ])
  ) as Record<DimensionKey, ScoreLevel>;

  const userVector = sbtiData.dimensionOrder.map((dimension) =>
    levelNum(levels[dimension])
  );

  const ranked = sbtiData.normalTypes
    .map((type) => {
      const vector = parsePattern(type.pattern).map(levelNum);
      let distance = 0;
      let exact = 0;

      for (let index = 0; index < vector.length; index += 1) {
        const diff = Math.abs(userVector[index] - vector[index]);
        distance += diff;

        if (diff === 0) {
          exact += 1;
        }
      }

      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));

      return {
        ...type,
        ...sbtiData.typeLibrary[type.code],
        distance,
        exact,
        similarity,
      };
    })
    .sort((left, right) => {
      if (left.distance !== right.distance) {
        return left.distance - right.distance;
      }

      if (right.exact !== left.exact) {
        return right.exact - left.exact;
      }

      return right.similarity - left.similarity;
    });

  const bestNormal = ranked[0];
  const drunkTriggered = answers[DRUNK_TRIGGER_QUESTION_ID] === 2;

  let finalType: SbtiTypeProfile = bestNormal;
  let modeKicker = "你的主类型";
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
  let sub = "维度命中度较高，当前结果可视为你的第一人格画像。";
  let special = false;
  let secondaryType: RankedSbtiType | null = null;

  if (drunkTriggered) {
    finalType = sbtiData.typeLibrary.DRUNK;
    secondaryType = bestNormal;
    modeKicker = "隐藏人格已激活";
    badge = "匹配度 100% · 酒精异常因子已接管";
    sub = "乙醇亲和性过强，系统已直接跳过常规人格审判。";
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = sbtiData.typeLibrary.HHHH;
    modeKicker = "系统强制兜底";
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
    sub = "标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。";
    special = true;
  }

  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType,
  };
}
