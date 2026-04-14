import { Callout } from "@/components/mdx/Callout";
import MDXComponents from "@/components/mdx/MDXComponents";
import { Locale, LOCALES } from "@/i18n/routing";
import { getPosts } from "@/lib/getBlogs";
import { constructMetadata } from "@/lib/metadata";
import { BlogPost } from "@/types/blog";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

type Params = Promise<{
  locale: string;
  slug: string;
}>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { posts }: { posts: BlogPost[] } = await getPosts(locale);
  const post = posts.find((entry) => entry.slug === `/${slug}`);
  const notFoundDescription =
    locale === "zh"
      ? "页面未找到"
      : locale === "ja"
        ? "ページが見つかりません"
        : locale === "es"
      ? "Pagina no encontrada"
      : locale === "de"
        ? "Seite nicht gefunden"
        : "Page not found";

  if (!post) {
    return constructMetadata({
      title: "404",
      description: notFoundDescription,
      noIndex: true,
      locale: locale as Locale,
      path: `/blog/${slug}`,
      canonicalUrl: `/blog/${slug}`,
    });
  }

  return constructMetadata({
    page: "blog",
    title: post.title,
    description: post.description,
    images: post.image ? [post.image] : [],
    locale: locale as Locale,
    path: `/blog/${slug}`,
    canonicalUrl: `/blog/${slug}`,
  });
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const { posts }: { posts: BlogPost[] } = await getPosts(locale);
  const post = posts.find((item) => item.slug === `/${slug}`);

  if (!post) {
    return notFound();
  }

  return (
    <div className="w-full px-2 md:w-3/5 md:px-12">
      <h1 className="mt-6 mb-4 break-words text-4xl font-bold">{post.title}</h1>
      {post.image && (
        <img alt={post.title} className="rounded-sm" src={post.image} />
      )}
      {post.tags && post.tags.split(",").length ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.split(",").map((tag) => {
            return (
              <div
                className="flex rounded-md bg-gray-200 px-2.5 py-1.5 text-sm font-medium text-gray-500 outline-none transition hover:!no-underline hover:text-black focus-visible:ring dark:bg-[#24272E] dark:text-[#7F818C] hover:dark:bg-[#15AFD04C] hover:dark:text-[#82E9FF]"
                key={tag}
              >
                {tag.trim()}
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      {post.description && <Callout>{post.description}</Callout>}
      <MDXRemote
        components={MDXComponents}
        options={mdxOptions}
        source={post.content || ""}
      />
    </div>
  );
}

export async function generateStaticParams() {
  const localizedPosts = await Promise.all(
    LOCALES.map(async (locale) => ({
      locale,
      posts: (await getPosts(locale)).posts.filter((post) => post.slug),
    }))
  );

  return localizedPosts.flatMap(({ locale, posts }) =>
    posts.map((post) => ({
      locale,
      slug: post.slug.replace(/^\//, "").replace(/^blog\//, ""),
    }))
  );
}
