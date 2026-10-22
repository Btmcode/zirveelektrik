import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { MarkdownContent } from "@/components/site/markdown";
import { BlogCard } from "@/components/site/blog-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { articleSchema } from "@/lib/schema";
import { getPostBySlug, getPublishedPosts } from "@/lib/queries";
import { formatDateTr } from "@/lib/utils-format";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Yazı Bulunamadı", robots: { index: false, follow: false } };
  }
  return {
    // Admin metaTitle marka içeriyorsa şablonla çiftlenmesin → absolute
    title: post.metaTitle ? { absolute: post.metaTitle } : post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      publishedTime: (post.publishedAt ?? post.updatedAt).toISOString(),
      authors: [post.author],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getPublishedPosts(),
  ]);

  if (!post) notFound();

  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const relatedPosts = allPosts
    .filter(
      (item) =>
        item.slug !== post.slug &&
        item.tags
          .split(",")
          .map((tag) => tag.trim())
          .some((tag) => tag && postTags.includes(tag))
    )
    .slice(0, 3);

  const publishDate = post.publishedAt ?? post.updatedAt;

  return (
    <>
      <JsonLd
        data={articleSchema({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          author: post.author,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <header>
          {postTags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {postTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              <time dateTime={publishDate.toISOString()}>
                {formatDateTr(publishDate)}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="size-4 text-primary" aria-hidden="true" />
              {post.author}
            </span>
            {postTags.length > 0 ? (
              <span className="flex items-center gap-1.5">
                <Tag className="size-4 text-primary" aria-hidden="true" />
                {postTags.join(", ")}
              </span>
            ) : null}
          </div>
        </header>

        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-amber-100 via-amber-50 to-background">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={`${post.title} - kapak görseli`}
              fill
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="mt-8">
          <MarkdownContent content={post.content} />
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section aria-label="İlgili yazılar" className="bg-muted/60 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              İlgili Yazılar
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {relatedPosts.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner
        title="Bu Sorun Sizin Evinizde mi Var?"
        description="Teori işin yarısı; diğer yarısı için ustalarımızı adresinize gönderin. Yerinde tespit ve net fiyat teklifi."
      />
    </>
  );
}
