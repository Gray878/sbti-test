"use client";

import StructuredData from "@/components/StructuredData";
import {
  AnswerMap,
  ComputedSbtiResult,
  SbtiQuestion,
  computeSbtiResult,
  createQuestionFlow,
  getVisibleQuestions,
  sbtiData,
} from "@/lib/sbti";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styles from "./SbtiExperience.module.css";

type Screen = "intro" | "test" | "result";

const OPTION_CODES = ["A", "B", "C", "D"];

export default function SbtiExperience() {
  const t = useTranslations("SbtiTest");
  const [screen, setScreen] = useState<Screen>("intro");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [questionFlow, setQuestionFlow] = useState<SbtiQuestion[]>([]);
  const [result, setResult] = useState<ComputedSbtiResult | null>(null);

  const faqData = [
    {
      question: t("faq.q1.question"),
      answer: t("faq.q1.answer")
    },
    {
      question: t("faq.q2.question"),
      answer: t("faq.q2.answer")
    },
    {
      question: t("faq.q3.question"),
      answer: t("faq.q3.answer")
    },
    {
      question: t("faq.q4.question"),
      answer: t("faq.q4.answer")
    },
    {
      question: t("faq.q5.question"),
      answer: t("faq.q5.answer")
    }
  ];

  function getQuestionMetaLabel(question: SbtiQuestion) {
    if ("special" in question && question.special) {
      return t("test.specialQuestion");
    }
    return t("test.dimensionHidden");
  }

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
      {screen === "intro" && (
        <StructuredData type="FAQ" data={faqData} />
      )}
      <div className={styles.shell}>
        {screen === "intro" && (
          <>
            <section id="sbti-home">
              <div className={cn(styles.card, styles.hero, styles.heroMinimal)}>
                <h1>{t("hero.title")}</h1>
                <div className={cn(styles.heroActions, styles.heroActionsSingle)}>
                  <button
                    className={cn(styles.btn, styles.btnPrimary)}
                    onClick={startTest}
                    type="button"
                  >
                    {t("hero.startButton")}
                  </button>
                </div>
              </div>
            </section>

            <section className={styles.seoSection}>
              <div className={cn(styles.card, styles.contentCard)}>
                <h2>{t("intro.whatIs.title")}</h2>
                <p>{t("intro.whatIs.p1")}</p>
                <p>{t("intro.whatIs.p2")}</p>
              </div>

              <div className={cn(styles.card, styles.contentCard)}>
                <h2>{t("intro.features.title")}</h2>
                <ul className={styles.featureList}>
                  <li>
                    <strong>{t("intro.features.f1.title")}</strong>：{t("intro.features.f1.desc")}
                  </li>
                  <li>
                    <strong>{t("intro.features.f2.title")}</strong>：{t("intro.features.f2.desc")}
                  </li>
                  <li>
                    <strong>{t("intro.features.f3.title")}</strong>：{t("intro.features.f3.desc")}
                  </li>
                  <li>
                    <strong>{t("intro.features.f4.title")}</strong>：{t("intro.features.f4.desc")}
                  </li>
                  <li>
                    <strong>{t("intro.features.f5.title")}</strong>：{t("intro.features.f5.desc")}
                  </li>
                </ul>
              </div>

              <div className={cn(styles.card, styles.contentCard)}>
                <h2>{t("faq.title")}</h2>
                <div className={styles.faqList}>
                  <details className={styles.faqItem}>
                    <summary>{t("faq.q1.question")}</summary>
                    <p>{t("faq.q1.answer")}</p>
                  </details>

                  <details className={styles.faqItem}>
                    <summary>{t("faq.q2.question")}</summary>
                    <p>{t("faq.q2.answer")}</p>
                  </details>

                  <details className={styles.faqItem}>
                    <summary>{t("faq.q3.question")}</summary>
                    <p>{t("faq.q3.answer")}</p>
                  </details>

                  <details className={styles.faqItem}>
                    <summary>{t("faq.q4.question")}</summary>
                    <p>{t("faq.q4.answer")}</p>
                  </details>

                  <details className={styles.faqItem}>
                    <summary>{t("faq.q5.question")}</summary>
                    <p>{t("faq.q5.answer")}</p>
                  </details>

                  <details className={styles.faqItem}>
                    <summary>{t("faq.q6.question")}</summary>
                    <p>{t("faq.q6.answer")}</p>
                  </details>

                  <details className={styles.faqItem}>
                    <summary>{t("faq.q7.question")}</summary>
                    <p>{t("faq.q7.answer")}</p>
                  </details>
                </div>
              </div>
            </section>
          </>
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
                      <div className={styles.badge}>{t("test.questionNumber", { number: questionIndex + 1 })}</div>
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
                    ? t("test.hintComplete")
                    : t("test.hintIncomplete")}
                </div>

                <div className={styles.actionGroup}>
                  <button
                    className={cn(styles.btn, styles.btnSecondary)}
                    onClick={() => setScreen("intro")}
                    type="button"
                  >
                    {t("test.backButton")}
                  </button>
                  <button
                    className={cn(styles.btn, styles.btnPrimary)}
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    type="button"
                  >
                    {t("test.submitButton")}
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
                  <h3>{t("result.analysisTitle")}</h3>
                  <p>{result.finalType.desc}</p>
                </div>

                <div className={styles.dimBox}>
                  <h3>{t("result.dimensionsTitle")}</h3>
                  <div className={styles.dimList}>
                    {sbtiData.dimensionOrder.map((dimension) => (
                      <div className={styles.dimItem} key={dimension}>
                        <div className={styles.dimItemTop}>
                          <div className={styles.dimItemName}>
                            {sbtiData.dimensionMeta[dimension].name}
                          </div>
                          <div className={styles.dimItemScore}>
                            {result.levels[dimension]} / {result.rawScores[dimension]}{t("result.scoreUnit")}
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
                  <h3>{t("result.noteTitle")}</h3>
                  <p>{result.special ? t("result.specialNote") : t("result.funNote")}</p>
                </div>

                <details className={styles.authorBox}>
                  <summary>{t("result.authorTitle")}</summary>
                  <div className={styles.authorContent}>
                    {[1, 2, 3, 4].map((i) => (
                      <p key={i}>{t(`result.authorNote${i}`)}</p>
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
                    {t("result.retestButton")}
                  </button>
                  <button
                    className={cn(styles.btn, styles.btnPrimary)}
                    onClick={() => setScreen("intro")}
                    type="button"
                  >
                    {t("result.backButton")}
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
