import { Link as I18nLink } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Home");

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 sm:px-10 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          {t("tagLine")}
        </p>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 dark:text-gray-100 sm:text-7xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
          {t("description")}
        </p>
        <div className="mt-10 flex items-center justify-center">
          <I18nLink
            href="/blog"
            prefetch={false}
            className="inline-flex items-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            {t("blogCta")}
          </I18nLink>
        </div>
      </div>
    </section>
  );
}
