import { Link, Locale, LOCALES } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { sbtiData } from "@/lib/sbti";
import { getSbtiContent } from "@/lib/sbti-content";
import {
  getLocalizedSbtiTypeHref,
  getSbtiTypeCodeFromSlug,
  getSbtiTypeHref,
  getSbtiTypeStaticParams,
} from "@/lib/sbti-type-routes";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; type: string }>;

const TYPE_PAGE_COPY: Record<
  Locale,
  {
    eyebrow: string;
    analysisTitle: string;
    noteTitle: string;
    noteBody: string;
    guideTitle: string;
    guideBody: string;
    startTestLabel: string;
    guideLabel: string;
    relatedTitle: string;
  }
> = {
  en: {
    eyebrow: "SBTI type page",
    analysisTitle: "What this type usually signals",
    noteTitle: "About this page",
    noteBody:
      "This is a permanent introduction page for this personality type, showing general characteristics. It's not your personal test result. Want to see yours? Take the test on the homepage.",
    guideTitle: "Reading path",
    guideBody:
      "Want a quick overview of this personality? This page has you covered. Want to dive deep into test mechanics, hidden personalities, and the full question bank? Check out the complete guide in the blog.",
    startTestLabel: "Start the test",
    guideLabel: "Read the full guide",
    relatedTitle: "Explore more types",
  },
  zh: {
    eyebrow: "SBTI 类型页",
    analysisTitle: "这个人格通常意味着什么",
    noteTitle: "关于这个页面",
    noteBody:
      "这是一个固定的人格介绍页面，展示的是这个人格类型的通用特征，不是你个人的测试结果。想看自己的结果？去首页做测试吧。",
    guideTitle: "推荐阅读路径",
    guideBody:
      "想快速了解这个人格？看这个页面就够了。想深入了解测试机制、隐藏人格和完整题库？去看博客里的完整指南。",
    startTestLabel: "开始测试",
    guideLabel: "查看完整指南",
    relatedTitle: "继续看其他人格",
  },
  ja: {
    eyebrow: "SBTI タイプページ",
    analysisTitle: "このタイプが示しやすい傾向",
    noteTitle: "このページについて",
    noteBody:
      "これはこの性格タイプの固定紹介ページで、一般的な特徴を示しています。あなた個人のテスト結果ではありません。自分の結果を見たい？ホームページでテストを受けてください。",
    guideTitle: "おすすめの読み方",
    guideBody:
      "この性格をざっくり知りたい？このページで十分です。テストの仕組み、隠し性格、全問題を深く知りたい？ブログの完全ガイドをチェックしてください。",
    startTestLabel: "テストを始める",
    guideLabel: "完全ガイドを読む",
    relatedTitle: "他のタイプも見る",
  },
  es: {
    eyebrow: "Página de tipo SBTI",
    analysisTitle: "Qué suele indicar este tipo",
    noteTitle: "Sobre esta página",
    noteBody:
      "Esta es una página de introducción permanente para este tipo de personalidad, mostrando características generales. No es tu resultado personal. ¿Quieres ver el tuyo? Haz el test en la página principal.",
    guideTitle: "Ruta de lectura",
    guideBody:
      "¿Quieres una visión rápida de esta personalidad? Esta página es suficiente. ¿Quieres profundizar en la mecánica del test, personalidades ocultas y el banco completo de preguntas? Consulta la guía completa en el blog.",
    startTestLabel: "Empezar el test",
    guideLabel: "Leer la guía completa",
    relatedTitle: "Explorar más tipos",
  },
};

function getRelatedTypeCodes(code: string, locale: Locale) {
  const codes = Object.keys(getSbtiContent(locale).typeLibrary);
  const currentIndex = codes.indexOf(code);

  if (currentIndex === -1) {
    return codes.slice(0, 4);
  }

  return codes
    .slice(currentIndex + 1)
    .concat(codes.slice(0, currentIndex))
    .slice(0, 4);
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getSbtiTypeStaticParams().map(({ type }) => ({
      locale,
      type,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, type } = await params;
  const resolvedLocale = locale as Locale;
  const code = getSbtiTypeCodeFromSlug(type);

  if (!code) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const profile = getSbtiContent(resolvedLocale).typeLibrary[code];
  const image = sbtiData.typeImages[code];

  return constructMetadata({
    page: "SbtiType",
    title: `${profile.code} (${profile.cn})`,
    description: `${profile.intro} ${profile.desc}`,
    locale: resolvedLocale,
    path: getSbtiTypeHref(code),
    canonicalUrl: getSbtiTypeHref(code),
    images: image ? [image] : [],
    keywords: [
      `SBTI ${profile.code}`,
      `${profile.code} personality`,
      `${profile.code} SBTI`,
      "SBTI personality type",
    ],
  });
}

export default async function SbtiTypePage({
  params,
}: {
  params: Params;
}) {
  const { locale, type } = await params;
  const resolvedLocale = locale as Locale;
  const code = getSbtiTypeCodeFromSlug(type);

  if (!code) {
    notFound();
  }

  const sbtiContent = getSbtiContent(resolvedLocale);
  const profile = sbtiContent.typeLibrary[code];
  const image = sbtiData.typeImages[code];
  const copy = TYPE_PAGE_COPY[resolvedLocale];
  const relatedCodes = getRelatedTypeCodes(code, resolvedLocale);

  return (
    <div className="w-full px-4 py-10 md:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="grid gap-6 rounded-[28px] border border-black/10 bg-white p-6 shadow-sm md:grid-cols-[minmax(280px,360px)_1fr] md:p-8">
          <div className="overflow-hidden rounded-[22px] border border-black/10 bg-neutral-100">
            <div className="relative aspect-[4/5]">
              {image ? (
                <Image
                  alt={`${profile.code} (${profile.cn})`}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 360px"
                  src={image}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-neutral-900 text-5xl font-semibold tracking-[0.18em] text-white">
                  {profile.code}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="text-sm uppercase tracking-[0.24em] text-neutral-500">
                {copy.eyebrow}
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
                  {profile.code}
                </h1>
                <p className="text-lg text-neutral-600">{profile.cn}</p>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-neutral-800">
                {profile.intro}
              </p>
            </div>

            <div className="rounded-[22px] border border-black/10 bg-neutral-50 p-5">
              <h2 className="text-base font-semibold text-neutral-950">
                {copy.analysisTitle}
              </h2>
              <p className="mt-3 text-base leading-8 text-neutral-700">
                {profile.desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                href="/"
              >
                {copy.startTestLabel}
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                href="/blog/sbti-personality-guide"
              >
                {copy.guideLabel}
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-950">
              {copy.noteTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-700">
              {copy.noteBody}
            </p>
          </article>

          <article className="rounded-[24px] border border-black/10 bg-neutral-950 p-6 text-neutral-100 shadow-sm">
            <h2 className="text-xl font-semibold text-white">{copy.guideTitle}</h2>
            <p className="mt-4 text-base leading-8 text-neutral-200">
              {copy.guideBody}
            </p>
          </article>
        </section>

        <section className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-950">
            {copy.relatedTitle}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedCodes.map((relatedCode) => {
              const relatedProfile = sbtiContent.typeLibrary[relatedCode];

              return (
                <a
                  key={relatedCode}
                  className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-4 no-underline transition hover:border-black/20 hover:bg-neutral-100"
                  href={getLocalizedSbtiTypeHref(resolvedLocale, relatedCode)}
                >
                  <div className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                    {relatedProfile.code}
                  </div>
                  <div className="mt-2 text-base font-semibold text-neutral-950">
                    {relatedProfile.cn}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-neutral-700">
                    {relatedProfile.intro}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
