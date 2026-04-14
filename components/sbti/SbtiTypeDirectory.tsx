import { Locale } from "@/i18n/routing";
import { getSbtiContent } from "@/lib/sbti-content";
import { getLocalizedSbtiTypeHref } from "@/lib/sbti-type-routes";

const DIRECTORY_COPY: Record<
  Locale,
  { title: string; description: string }
> = {
  en: {
    title: "Browse all SBTI types",
    description:
      "Use these direct links to open each personality's dedicated introduction page.",
  },
  zh: {
    title: "浏览全部 SBTI 人格类型",
    description: "下面这些入口会直接带你进入每一种人格的独立介绍页面。",
  },
  ja: {
    title: "SBTI の全タイプを見る",
    description: "各リンクから、その人格タイプ専用の紹介ページへ直接移動できます。",
  },
  es: {
    title: "Explora todos los tipos SBTI",
    description:
      "Estos enlaces te llevan directamente a la pagina de introduccion de cada personalidad.",
  },
  de: {
    title: "Alle SBTI-Typen durchsuchen",
    description:
      "Mit diesen Direktlinks oeffnest du die jeweilige Einfuehrungsseite jeder Persoenlichkeit.",
  },
};

export function SbtiTypeDirectory({ locale }: { locale: Locale }) {
  const sbtiContent = getSbtiContent(locale);
  const copy = DIRECTORY_COPY[locale];
  const profiles = Object.values(sbtiContent.typeLibrary);

  return (
    <section className="my-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
      <h2 className="mt-0 mb-3 border-b-0 pb-0 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {copy.title}
      </h2>
      <p className="mt-0 mb-6 text-gray-700 dark:text-gray-300">
        {copy.description}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <a
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 no-underline transition hover:border-gray-300 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 dark:hover:bg-gray-900"
            href={getLocalizedSbtiTypeHref(locale, profile.code)}
            key={profile.code}
          >
            <div className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              {profile.code}
            </div>
            <div className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              {profile.cn}
            </div>
            <div className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {profile.intro}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
