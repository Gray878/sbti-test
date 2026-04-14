"use client";

import StructuredData from "@/components/StructuredData";
import { Link, Locale } from "@/i18n/routing";
import { getSbtiContent } from "@/lib/sbti-content";
import {
  AnswerMap,
  ComputedSbtiResult,
  SbtiQuestion,
  SbtiResultCopy,
  computeSbtiResult,
  createQuestionFlow,
  getVisibleQuestions,
  sbtiData,
} from "@/lib/sbti";
import { getSbtiTypeHref } from "@/lib/sbti-type-routes";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import SbtiHeroTypeWall from "./SbtiHeroTypeWall";
import styles from "./SbtiExperience.module.css";
import { buildSbtiSharePoster, type SbtiPosterCopy } from "./sharePoster";

type Screen = "intro" | "test" | "result";

const OPTION_CODES = ["A", "B", "C", "D"];

function buildPosterFileName(code: string) {
  const normalizedCode =
    code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
    "result";

  return `sbti-${normalizedCode}-poster.png`;
}

function canUseNativeShare(blob: Blob | null, fileName: string) {
  if (
    !blob ||
    typeof navigator === "undefined" ||
    typeof navigator.share !== "function"
  ) {
    return false;
  }

  const shareFile = new File([blob], fileName, {
    type: blob.type || "image/png",
  });

  if (typeof navigator.canShare !== "function") {
    return false;
  }

  try {
    return navigator.canShare({ files: [shareFile] });
  } catch {
    return false;
  }
}

export default function SbtiExperience() {
  const locale = useLocale() as Locale;
  const t = useTranslations("SbtiTest");
  const sbtiContent = getSbtiContent(locale);
  const [screen, setScreen] = useState<Screen>("intro");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [questionFlow, setQuestionFlow] = useState<SbtiQuestion[]>([]);
  const [result, setResult] = useState<ComputedSbtiResult | null>(null);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [sharePosterUrl, setSharePosterUrl] = useState<string | null>(null);
  const [sharePosterBlob, setSharePosterBlob] = useState<Blob | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const sharePosterUrlRef = useRef<string | null>(null);

  const faqData = [
    {
      question: t("faq.q1.question"),
      answer: t("faq.q1.answer"),
    },
    {
      question: t("faq.q2.question"),
      answer: t("faq.q2.answer"),
    },
    {
      question: t("faq.q3.question"),
      answer: t("faq.q3.answer"),
    },
    {
      question: t("faq.q4.question"),
      answer: t("faq.q4.answer"),
    },
    {
      question: t("faq.q5.question"),
      answer: t("faq.q5.answer"),
    },
  ];

  function getQuestionMetaLabel(question: SbtiQuestion) {
    if ("special" in question && question.special) {
      return t("test.specialQuestion");
    }

    return t("test.dimensionHidden");
  }

  const resultCopy: SbtiResultCopy = {
    defaultModeKicker: t("result.mode.defaultKicker"),
    defaultBadge: (bestNormal) =>
      t("result.mode.defaultBadge", {
        similarity: bestNormal.similarity,
        exact: bestNormal.exact,
      }),
    defaultSub: t("result.mode.defaultSub"),
    drunkModeKicker: t("result.mode.drunkKicker"),
    drunkBadge: t("result.mode.drunkBadge"),
    drunkSub: t("result.mode.drunkSub"),
    fallbackModeKicker: t("result.mode.fallbackKicker"),
    fallbackBadge: (bestNormal) =>
      t("result.mode.fallbackBadge", {
        similarity: bestNormal.similarity,
      }),
    fallbackSub: t("result.mode.fallbackSub"),
  };

  const visibleQuestions = getVisibleQuestions(
    questionFlow,
    answers,
    sbtiContent.specialQuestions
  );
  const answeredCount = visibleQuestions.filter(
    (question) => answers[question.id] !== undefined
  ).length;
  const totalQuestions = visibleQuestions.length;
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const canSubmit = totalQuestions > 0 && answeredCount === totalQuestions;
  const sharePosterCopy: SbtiPosterCopy = {
    posterTitle: t("result.posterTitle"),
    posterSummaryTitle: t("result.posterSummaryTitle"),
    posterDimensionsTitle: t("result.posterDimensionsTitle"),
    posterFooter: t("result.posterFooter"),
    scoreUnit: t("result.scoreUnit"),
  };
  const posterFileName = buildPosterFileName(result?.finalType.code ?? "result");
  const nativeShareAvailable = canUseNativeShare(sharePosterBlob, posterFileName);
  const typePageHref = result ? getSbtiTypeHref(result.finalType.code) : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  useEffect(() => {
    return () => {
      if (sharePosterUrlRef.current) {
        URL.revokeObjectURL(sharePosterUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showShareSheet) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowShareSheet(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showShareSheet]);

  function clearSharePoster() {
    if (sharePosterUrlRef.current) {
      URL.revokeObjectURL(sharePosterUrlRef.current);
      sharePosterUrlRef.current = null;
    }

    setShowShareSheet(false);
    setSharePosterUrl(null);
    setSharePosterBlob(null);
    setShareError(null);
    setIsGeneratingPoster(false);
  }

  function storeSharePoster(blob: Blob) {
    if (sharePosterUrlRef.current) {
      URL.revokeObjectURL(sharePosterUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(blob);
    sharePosterUrlRef.current = objectUrl;
    setSharePosterBlob(blob);
    setSharePosterUrl(objectUrl);
  }

  function startTest() {
    clearSharePoster();
    setAnswers({});
    setResult(null);
    setQuestionFlow(
      createQuestionFlow(sbtiContent.questions, sbtiContent.specialQuestions)
    );
    setScreen("test");
  }

  function goHome() {
    clearSharePoster();
    setScreen("intro");
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

    clearSharePoster();
    setResult(
      computeSbtiResult(answers, {
        typeLibrary: sbtiContent.typeLibrary,
        copy: resultCopy,
      })
    );
    setScreen("result");
  }

  async function handleOpenShareSheet() {
    if (!result || isGeneratingPoster) {
      return;
    }

    setShowShareSheet(true);
    setShareError(null);

    if (sharePosterBlob) {
      return;
    }

    setIsGeneratingPoster(true);

    try {
      const posterBlob = await buildSbtiSharePoster(result, sharePosterCopy);
      storeSharePoster(posterBlob);
    } catch (error) {
      console.error(error);
      setShareError(t("result.shareError"));
    } finally {
      setIsGeneratingPoster(false);
    }
  }

  function handleSavePoster() {
    if (!sharePosterUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = sharePosterUrl;
    link.download = posterFileName;
    link.rel = "noopener";
    link.click();
  }

  async function handleNativeShare() {
    if (!result || !sharePosterBlob || typeof navigator.share !== "function") {
      return;
    }

    const shareFile = new File([sharePosterBlob], posterFileName, {
      type: sharePosterBlob.type || "image/png",
    });

    if (typeof navigator.canShare === "function") {
      try {
        if (!navigator.canShare({ files: [shareFile] })) {
          return;
        }
      } catch {
        return;
      }
    }

    try {
      await navigator.share({
        files: [shareFile],
        title: `${result.finalType.code} | SBTI`,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error(error);
      setShareError(t("result.nativeShareError"));
    }
  }

  return (
    <div className={styles.page}>
      {screen === "intro" && <StructuredData data={faqData} type="FAQ" />}

      <div className={styles.shell}>
        {screen === "intro" && (
          <>
            <section id="sbti-home">
              <div className={cn(styles.card, styles.hero, styles.heroMinimal)}>
                <SbtiHeroTypeWall />
                <div className={styles.heroContent}>
                  <div className={styles.heroCopyPanel}>
                    <h1>{t("hero.title")}</h1>
                    <div
                      className={cn(
                        styles.heroActions,
                        styles.heroActionsSingle
                      )}
                    >
                      <button
                        className={cn(styles.btn, styles.btnPrimary)}
                        onClick={startTest}
                        type="button"
                      >
                        {t("hero.startButton")}
                      </button>
                    </div>
                  </div>
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
                    <strong>{t("intro.features.f1.title")}</strong>：
                    {t("intro.features.f1.desc")}
                  </li>
                  <li>
                    <strong>{t("intro.features.f2.title")}</strong>：
                    {t("intro.features.f2.desc")}
                  </li>
                  <li>
                    <strong>{t("intro.features.f3.title")}</strong>：
                    {t("intro.features.f3.desc")}
                  </li>
                  <li>
                    <strong>{t("intro.features.f4.title")}</strong>：
                    {t("intro.features.f4.desc")}
                  </li>
                  <li>
                    <strong>{t("intro.features.f5.title")}</strong>：
                    {t("intro.features.f5.desc")}
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
                      <div className={styles.badge}>
                        {t("test.questionNumber", {
                          number: questionIndex + 1,
                        })}
                      </div>
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
                            <span className={styles.optionText}>
                              {option.label}
                            </span>
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
                    onClick={goHome}
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
                    <div className={styles.posterFrame}>
                      {sbtiData.typeImages[result.finalType.code] ? (
                        <img
                          alt={`${result.finalType.code}（${result.finalType.cn}）`}
                          className={styles.posterImage}
                          loading="lazy"
                          src={sbtiData.typeImages[result.finalType.code]}
                        />
                      ) : (
                        <div className={styles.posterFallback}>
                          {result.finalType.code}
                        </div>
                      )}
                    </div>
                    <div className={styles.posterCaption}>
                      {result.finalType.intro}
                    </div>
                  </div>

                  <div className={styles.typeBox}>
                    <div className={styles.typeKicker}>{result.modeKicker}</div>
                    <h2 className={styles.typeName}>
                      <span className={styles.typeCode}>
                        {result.finalType.code}
                      </span>
                      <span className={styles.typeCn}>
                        （{result.finalType.cn}）
                      </span>
                    </h2>
                    <div className={styles.match}>{result.badge}</div>
                    <div className={styles.typeSubname}>{result.sub}</div>
                    <div className={styles.typeActions}>
                      <button
                        className={cn(
                          styles.btn,
                          styles.btnPrimary,
                          styles.shareTrigger
                        )}
                        disabled={isGeneratingPoster}
                        onClick={handleOpenShareSheet}
                        type="button"
                      >
                        {isGeneratingPoster
                          ? t("result.shareButtonLoading")
                          : t("result.shareButton")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.analysisBox}>
                  <h3>{t("result.analysisTitle")}</h3>
                  <p>{result.finalType.desc}</p>
                </div>

                <div className={styles.dimBox}>
                  <h3>{t("result.dimensionsTitle")}</h3>
                  <div className={styles.dimList}>
                    {sbtiContent.dimensionOrder.map((dimension) => (
                      <div className={styles.dimItem} key={dimension}>
                        <div className={styles.dimItemTop}>
                          <div className={styles.dimItemName}>
                            {sbtiContent.dimensionMeta[dimension].name}
                          </div>
                          <div className={styles.dimItemScore}>
                            {result.levels[dimension]} /{" "}
                            {result.rawScores[dimension]}
                            {t("result.scoreUnit")}
                          </div>
                        </div>
                        <p>
                          {
                            sbtiContent.dimExplanations[dimension][
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
                  <p>
                    {result.special
                      ? t("result.specialNote")
                      : t("result.funNote")}
                  </p>
                </div>

              </div>

              <div className={styles.resultActions}>
                <div className={styles.actionGroup}>
                  {typePageHref && (
                    <Link
                      className={cn(styles.btn, styles.btnSecondary)}
                      href={typePageHref}
                    >
                      {t("result.typePageButton")}
                    </Link>
                  )}
                  <button
                    className={cn(styles.btn, styles.btnSecondary)}
                    onClick={startTest}
                    type="button"
                  >
                    {t("result.retestButton")}
                  </button>
                  <button
                    className={cn(styles.btn, styles.btnSecondary)}
                    onClick={goHome}
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

      {showShareSheet && result && (
        <div
          className={styles.shareOverlay}
          onClick={() => setShowShareSheet(false)}
        >
          <div
            aria-labelledby="sbti-share-sheet-title"
            aria-modal="true"
            className={styles.shareSheet}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className={styles.shareSheetHeader}>
              <div className={styles.shareSheetHeaderText}>
                <h3 id="sbti-share-sheet-title">{t("result.shareSheetTitle")}</h3>
                <p>{t("result.shareSheetHint")}</p>
              </div>

              <button
                aria-label={t("result.closeShareButton")}
                className={styles.shareSheetClose}
                onClick={() => setShowShareSheet(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className={styles.sharePreviewFrame}>
              <div className={styles.sharePreview}>
                {sharePosterUrl ? (
                  <img
                    alt={`${result.finalType.code} ${t("result.shareSheetTitle")}`}
                    className={styles.sharePreviewImage}
                    src={sharePosterUrl}
                  />
                ) : (
                  <div className={styles.sharePlaceholder}>
                    {isGeneratingPoster
                      ? t("result.shareButtonLoading")
                      : shareError ?? t("result.shareError")}
                  </div>
                )}
              </div>
            </div>

            <p className={styles.shareHint}>
              {t("result.shareSheetLongPressHint")}
            </p>

            {shareError && <p className={styles.shareError}>{shareError}</p>}

            <div className={styles.shareActions}>
              <button
                className={cn(styles.btn, styles.btnPrimary)}
                disabled={!sharePosterUrl}
                onClick={handleSavePoster}
                type="button"
              >
                {t("result.savePosterButton")}
              </button>

              {nativeShareAvailable && (
                <button
                  className={cn(styles.btn, styles.btnSecondary)}
                  onClick={handleNativeShare}
                  type="button"
                >
                  {t("result.systemShareButton")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
