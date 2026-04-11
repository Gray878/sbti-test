import { DEFAULT_LOCALE, Locale } from "@/i18n/routing";
import { sbtiData } from "@/lib/sbti";

function slugifySbtiTypeCode(code: string) {
  return (
    code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
    "type"
  );
}

const typeSlugEntries = Object.keys(sbtiData.typeLibrary).map((code) => [
  code,
  slugifySbtiTypeCode(code),
] as const);

const duplicateSlug = typeSlugEntries.find(
  ([, slug], index) =>
    typeSlugEntries.findIndex(([, currentSlug]) => currentSlug === slug) !== index
);

if (duplicateSlug) {
  throw new Error(`Duplicate SBTI type slug detected: ${duplicateSlug[1]}`);
}

const SBTI_TYPE_SLUGS = Object.fromEntries(typeSlugEntries) as Record<string, string>;
const SBTI_TYPE_CODES_BY_SLUG = Object.fromEntries(
  typeSlugEntries.map(([code, slug]) => [slug, code])
) as Record<string, string>;

export function getSbtiTypeSlug(code: string) {
  return SBTI_TYPE_SLUGS[code] ?? null;
}

export function getSbtiTypeCodeFromSlug(slug: string) {
  return SBTI_TYPE_CODES_BY_SLUG[slug] ?? null;
}

export function getSbtiTypeHref(code: string) {
  const slug = getSbtiTypeSlug(code);

  if (!slug) {
    throw new Error(`Unknown SBTI type code: ${code}`);
  }

  return `/types/${slug}`;
}

export function getLocalizedSbtiTypeHref(locale: Locale, code: string) {
  return `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${getSbtiTypeHref(code)}`;
}

export function getSbtiTypeStaticParams() {
  return typeSlugEntries.map(([, type]) => ({ type }));
}
