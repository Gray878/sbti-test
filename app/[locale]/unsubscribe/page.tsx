import { unsubscribeFromNewsletter } from "@/actions/newsletter";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Params = Promise<{ locale: string }>;

function mapUnsubscribeError(
  message: string,
  t: Awaited<ReturnType<typeof getTranslations>>
) {
  switch (message) {
    case "No unsubscribe token provided":
      return t("missingToken");
    case "Invalid email address":
      return t("invalidEmail");
    case "This email is not subscribed to our notifications":
      return t("notSubscribed");
    case "Too many submissions, please try again later":
      return t("tooManyRequests");
    default:
      return t("genericError");
  }
}

export default async function UnsubscribePage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Unsubscribe",
  });
  let status: "error" | "success" = "error";
  let email = "";
  let errorMessage = t("genericError");

  const searchParams = await props.searchParams;
  const token = searchParams.token as string;

  if (!token) {
    errorMessage = t("missingToken");
  } else {
    try {
      const result = await unsubscribeFromNewsletter(token);
      if (result.success) {
        status = "success";
        email = result.email;
      }
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? mapUnsubscribeError(error.message, t)
          : t("genericError");
    }
  }

  return (
    <div className="max-w-md mx-auto my-16 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {status === "success" ? (
        <div>
          <p className="mb-4">{t("successMessage")}</p>
          <p className="text-sm text-gray-600">
            {t("emailLabel")} {email}
          </p>
          <p className="mt-6">{t("resubscribeHint")}</p>
        </div>
      ) : (
        <div>
          <p className="text-red-600 mb-4">{errorMessage}</p>
          <p>{t("supportHint")}</p>
        </div>
      )}
    </div>
  );
}
