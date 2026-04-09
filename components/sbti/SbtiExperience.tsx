"use client";

import { cn } from "@/lib/utils";
import {
  AnswerMap,
  ComputedSbtiResult,
  SbtiQuestion,
  computeSbtiResult,
  createQuestionFlow,
  getVisibleQuestions,
  sbtiData,
} from "@/lib/sbti";
import { useEffect, useState } from "react";
import styles from "./SbtiExperience.module.css";

type Screen = "intro" | "test" | "result";

const OPTION_CODES = ["A", "B", "C", "D"];
const FUN_NOTE =
  "本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。";
const SPECIAL_FUN_NOTE =
  "本测试仅供娱乐。隐藏人格和强行兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。";

const AUTHOR_NOTES = [
  "本测试首发于 b 站 up 主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。",
  "由于作者的人格是 SHIT 愤世者，所以平等地攻击了各位，在此抱歉。不过我是一个绝世大美女，你们一定会原谅我，有 B 站的朋友们也可以关注我。",
  "关于这个测试，我没法很好地平衡娱乐和专业性，因此对于一些人格的阐释较为模糊或完全不准，如有冒犯非常抱歉。",
  "再鉴于时间精力有限，就先这样玩玩，后续会慢慢完善修改。总之好玩为主，还请不要用于盈利呀。",
];

function getQuestionMetaLabel(question: SbtiQuestion) {
  if ("special" in question && question.special) {
    return "补充题";
  }

  return "维度已隐藏";
}

export default function SbtiExperience() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [questionFlow, setQuestionFlow] = useState<SbtiQuestion[]>([]);
  const [result, setResult] = useState<ComputedSbtiResult | null>(null);

  const visibleQuestions = getVisibleQuestions(questionFlow, answers);
  const answeredCount = visibleQuestions.filter(
    (question) => answers[question.id] !== undefined
  ).length;
  const totalQuestions = visibleQuestions.length;
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const canSubmit = totalQuestions > 0 && answeredCount === totalQuestions;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  function startTest() {
    setAnswers({});
    setResult(null);
    setQuestionFlow(createQuestionFlow());
    setScreen("test");
  }

  function handleSelect(questionId: string, value: number) {
    setAnswers((current) => {
      const next = { ...current, [questionId]: value };

      if (questionId === "drink_gate_q1" && value !== 3) {
        delete next.drink_gate_q2;
      }

      return next;
    });
  }

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    setResult(computeSbtiResult(answers));
    setScreen("result");
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {screen === "intro" && (
          <section id="sbti-home">
            <div className={cn(styles.card, styles.hero, styles.heroMinimal)}>
              <h1>MBTI已经过时，SBTI来了。</h1>
              <div className={cn(styles.heroActions, styles.heroActionsSingle)}>
                <button
                  className={cn(styles.btn, styles.btnPrimary)}
                  onClick={startTest}
                  type="button"
                >
                  开始测试
                </button>
              </div>
            </div>
          </section>
        )}

        {screen === "test" && (
          <section>
            <div className={cn(styles.card, styles.testWrap)}>
              <div className={styles.topbar}>
                <div className={styles.progress}>
                  <span
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className={styles.progressText}>
                  {answeredCount} / {totalQuestions}
                </div>
              </div>

              <div className={styles.questionList}>
                {visibleQuestions.map((question, questionIndex) => (
                  <article
                    key={question.id}
                    className={styles.question}
                    style={{
                      animationDelay: `${Math.min(questionIndex, 6) * 35}ms`,
                    }}
                  >
                    <div className={styles.questionMeta}>
                      <div className={styles.badge}>第 {questionIndex + 1} 题</div>
                      <div>{getQuestionMetaLabel(question)}</div>
                    </div>

                    <p className={styles.questionTitle}>{question.text}</p>

                    <div className={styles.options}>
                      {question.options.map((option, optionIndex) => {
                        const selected = answers[question.id] === option.value;

                        return (
                          <label
                            key={`${question.id}-${option.value}`}
                            className={cn(
                              styles.option,
                              selected && styles.optionSelected
                            )}
                          >
                            <input
                              checked={selected}
                              className={styles.optionInput}
                              name={question.id}
                              onChange={() =>
                                handleSelect(question.id, option.value)
                              }
                              type="radio"
                              value={option.value}
                            />
                            <span className={styles.optionCode}>
                              {OPTION_CODES[optionIndex] ?? optionIndex + 1}
                            </span>
                            <span className={styles.optionText}>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.actionsBottom}>
                <div className={styles.hint}>
                  {canSubmit
                    ? "都做完了。现在可以把你的电子魂魄交给结果页审判。"
                    : "全选完才会放行。世界已经够乱了，起码把题做完整。"}
                </div>

                <div className={styles.actionGroup}>
                  <button
                    className={cn(styles.btn, styles.btnSecondary)}
                    onClick={() => setScreen("intro")}
                    type="button"
                  >
                    返回首页
                  </button>
                  <button
                    className={cn(styles.btn, styles.btnPrimary)}
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    type="button"
                  >
                    提交并查看结果
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {screen === "result" && result && (
          <section>
            <div className={cn(styles.card, styles.resultWrap)}>
              <div className={styles.resultLayout}>
                <div className={styles.resultTop}>
                  <div
                    className={cn(
                      styles.posterBox,
                      !sbtiData.typeImages[result.finalType.code] &&
                        styles.posterBoxNoImage
                    )}
                  >
                    {sbtiData.typeImages[result.finalType.code] && (
                      <img
                        alt={`${result.finalType.code}（${result.finalType.cn}）`}
                        className={styles.posterImage}
                        loading="lazy"
                        src={sbtiData.typeImages[result.finalType.code]}
                      />
                    )}
                    <div className={styles.posterCaption}>
                      {result.finalType.intro}
                    </div>
                  </div>

                  <div className={styles.typeBox}>
                    <div className={styles.typeKicker}>{result.modeKicker}</div>
                    <h2 className={styles.typeName}>
                      {result.finalType.code}（{result.finalType.cn}）
                    </h2>
                    <div className={styles.match}>{result.badge}</div>
                    <div className={styles.typeSubname}>{result.sub}</div>
                  </div>
                </div>

                <div className={styles.analysisBox}>
                  <h3>该人格的简单解读</h3>
                  <p>{result.finalType.desc}</p>
                </div>

                <div className={styles.dimBox}>
                  <h3>十五维度评分</h3>
                  <div className={styles.dimList}>
                    {sbtiData.dimensionOrder.map((dimension) => (
                      <div className={styles.dimItem} key={dimension}>
                        <div className={styles.dimItemTop}>
                          <div className={styles.dimItemName}>
                            {sbtiData.dimensionMeta[dimension].name}
                          </div>
                          <div className={styles.dimItemScore}>
                            {result.levels[dimension]} / {result.rawScores[dimension]}分
                          </div>
                        </div>
                        <p>
                          {
                            sbtiData.dimExplanations[dimension][
                              result.levels[dimension]
                            ]
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.noteBox}>
                  <h3>友情提示</h3>
                  <p>{result.special ? SPECIAL_FUN_NOTE : FUN_NOTE}</p>
                </div>

                <details className={styles.authorBox}>
                  <summary>作者的话</summary>
                  <div className={styles.authorContent}>
                    {AUTHOR_NOTES.map((note) => (
                      <p key={note}>{note}</p>
                    ))}
                  </div>
                </details>
              </div>

              <div className={styles.resultActions}>
                <div className={styles.actionGroup}>
                  <button
                    className={cn(styles.btn, styles.btnSecondary)}
                    onClick={startTest}
                    type="button"
                  >
                    重新测试
                  </button>
                  <button
                    className={cn(styles.btn, styles.btnPrimary)}
                    onClick={() => setScreen("intro")}
                    type="button"
                  >
                    回到首页
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
