import { Link as I18nLink } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto w-full border-t border-[#dbe8dd]"
      style={{
        background:
          "radial-gradient(circle at top left, #f8fff8 0, #f6faf6 36%, #f2f7f3 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[980px] flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-[#4d5c52] md:flex-row">
        <p>{t("Copyright", { year, name: siteConfig.name })}</p>

        <div className="flex items-center gap-5">
          <I18nLink
            href="/privacy-policy"
            title={t("PrivacyPolicy")}
            prefetch={false}
            className="transition-colors hover:text-[#1e2a22]"
          >
            {t("PrivacyPolicy")}
          </I18nLink>
          <I18nLink
            href="/terms-of-service"
            title={t("TermsOfService")}
            prefetch={false}
            className="transition-colors hover:text-[#1e2a22]"
          >
            {t("TermsOfService")}
          </I18nLink>
        </div>
      </div>
    </footer>
  );
}
