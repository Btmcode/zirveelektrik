import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
  ListTree,
  User,
  Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import {
  MarkdownContent,
  createHeadingIdState,
} from "@/components/site/markdown";
import { BlogCard } from "@/components/site/blog-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { ArticleCtaCard } from "@/components/site/article-cta-card";
import { ReadingProgress } from "@/components/site/reading-progress";
import { BackToTop } from "@/components/site/back-to-top";
import { TocNav } from "@/components/site/toc-nav";
import { ShareRow } from "@/components/site/share-row";
import { articleSchema, faqSchema } from "@/lib/schema";
import { getPostBySlug, getPublishedPosts } from "@/lib/queries";
import { formatDateTr } from "@/lib/utils-format";
import {
  calcReadingTime,
  extractHeadings,
  parsePostFaq,
} from "@/lib/content-utils";

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
  const ogImages = post.coverImage ? [post.coverImage] : ["/og.jpg"];
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
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: ogImages,
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

  // İlgili yazılar: önce etiket eşleşmesi, eşleşme yoksa en yeni 3 yazı
  const tagMatches = allPosts.filter(
    (item) =>
      item.slug !== post.slug &&
      item.tags
        .split(",")
        .map((tag) => tag.trim())
        .some((tag) => tag && postTags.includes(tag))
  );
  const relatedPosts =
    tagMatches.length > 0
      ? tagMatches.slice(0, 3)
      : allPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  // Yazı geçişi: liste en yeni→en eski sıralıdır.
  // "Sonraki Yazı" = daha yeni yazı, "Önceki Yazı" = daha eski yazı.
  const currentIndex = allPosts.findIndex((item) => item.slug === post.slug);
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost =
    currentIndex >= 0 && currentIndex + 1 < allPosts.length
      ? allPosts[currentIndex + 1]
      : null;

  // AEO SSS: admin "Soru :: Yanıt" satırlarını görünür bölüm + FAQPage şemasına çevirir
  const postFaqs = parsePostFaq(post.faq);

  const publishDate = post.publishedAt ?? post.updatedAt;
  const readingTime = calcReadingTime(post.content);

  // Yayından sonra belirgin güncelleme varsa okuyucuya açıkça gösterilir
  // (tazelik sinyali: kullanıcılar + Google/E-E-A-T için).
  const isUpdated =
    post.publishedAt !== null &&
    post.updatedAt.getTime() - post.publishedAt.getTime() > 24 * 60 * 60 * 1000;

  // İçindekiler: 3+ H2 başlık varsa göster (mobilde satır içi, masaüstünde yapışkan yan panel)
  const toc = extractHeadings(post.content);
  const showToc = toc.length >= 3;

  // Yazıyı H2 sınırlarından ikiye böl: ortada dönüşüm CTA'sı gösterir
  const sections = post.content.split(/(?=\n## )/);
  const splitIndex = Math.ceil(sections.length / 2);
  const canSplit = sections.length >= 4;
  const firstHalf = canSplit ? sections.slice(0, splitIndex).join("") : null;
  const secondHalf = canSplit ? sections.slice(splitIndex).join("") : null;
  // İki parça aynı başlık id sayaç durumunu paylaşır (TOC eşleşmesi için)
  const headingIdState = createHeadingIdState();

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
          content: post.content,
          tags: post.tags,
          coverImage: post.coverImage,
        })}
      />
      {postFaqs.length > 0 ? <JsonLd data={faqSchema(postFaqs)} /> : null}
      <ReadingProgress />
      <BackToTop />
      <Breadcrumbs
        items={[
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <div
        className={
          showToc
            ? "mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8 xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-10"
            : "mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14 lg:px-8"
        }
      >
        <article className="min-w-0">
          <header>
            {postTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {postTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-ring"
                    aria-label={`${tag} etiketindeki yazıları filtrele`}
                  >
                    {tag}
                  </Link>
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
                <Clock className="size-4 text-primary" aria-hidden="true" />
                {readingTime} dakikalık okuma
              </span>
              <span className="flex items-center gap-1.5">
                <User className="size-4 text-primary" aria-hidden="true" />
                {post.author}
              </span>
            </div>
            {isUpdated ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Son güncelleme: <time dateTime={post.updatedAt.toISOString()}>{formatDateTr(post.updatedAt)}</time>
              </p>
            ) : null}
            <div className="mt-5 border-t border-dashed pt-4">
              <ShareRow path={`/blog/${post.slug}`} title={post.title} />
            </div>
          </header>

          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-amber-100 via-amber-50 to-background">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={`${post.title} - kapak görseli`}
                fill
                priority
                sizes="(min-width: 896px) 872px, 100vw"
                className="object-cover"
              />
            ) : (
              <Zap
                className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-primary/25"
                aria-hidden="true"
              />
            )}
          </div>

          {/* AEO "Kısa Yanıt": doğrudan cevap bloğu — arama/AI motorlarının
              alıntılayacağı hedef metin + okuyucuya TL;DR (#kisa-yanit =
              speakable cssSelector hedefi). */}
          <section
            id="kisa-yanit"
            aria-label="Kısa yanıt"
            className="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5"
          >
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Lightbulb className="size-4" aria-hidden="true" />
              Kısa Yanıt
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground">
              {post.excerpt}
            </p>
          </section>

          {showToc ? (
            <nav
              aria-label="İçindekiler"
              className="mt-8 rounded-xl border bg-accent/40 p-5 xl:hidden"
            >
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                <ListTree className="size-4 text-primary" aria-hidden="true" />
                Bu Yazıda Neler Var?
              </h2>
              <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {toc.map((heading, index) => (
                  <li key={heading.id} className="flex gap-2">
                    <span className="tabular-nums text-primary/70">
                      {index + 1}.
                    </span>
                    <a
                      href={`#${heading.id}`}
                      className="transition-colors hover:text-primary"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="mt-8">
            {canSplit && firstHalf && secondHalf ? (
              <>
                <MarkdownContent content={firstHalf} idState={headingIdState} />
                <ArticleCtaCard />
                <MarkdownContent content={secondHalf} idState={headingIdState} />
              </>
            ) : (
              <>
                <MarkdownContent content={post.content} idState={headingIdState} />
                <ArticleCtaCard />
              </>
            )}
          </div>

          {/* Yazı SSS (AEO): görünür soru-cevap + FAQPage yapısal verisi */}
          {postFaqs.length > 0 ? (
            <section
              aria-label="Yazı hakkında sık sorulan sorular"
              className="mt-10"
            >
              <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                Sık Sorulan Sorular
              </h2>
              <div className="mt-4 space-y-3">
                {postFaqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border bg-card p-4"
                  >
                    <h3 className="text-sm font-semibold text-foreground md:text-base">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Yazı geçişi: solda daha eski, sağda daha yeni yazı */}
          {olderPost || newerPost ? (
            <nav
              aria-label="Yazı geçişi"
              className="mt-12 grid gap-3 sm:grid-cols-2"
            >
              {olderPost ? (
                <Link
                  href={`/blog/${olderPost.slug}`}
                  className="group flex min-h-11 flex-col justify-center rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ChevronLeft
                      className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                    Önceki Yazı
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                    {olderPost.title}
                  </span>
                </Link>
              ) : (
                <div aria-hidden="true" className="hidden sm:block" />
              )}
              {newerPost ? (
                <Link
                  href={`/blog/${newerPost.slug}`}
                  className="group flex min-h-11 flex-col justify-center rounded-xl border bg-card p-4 text-right transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sonraki Yazı
                    <ChevronRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                    {newerPost.title}
                  </span>
                </Link>
              ) : (
                <div aria-hidden="true" className="hidden sm:block" />
              )}
            </nav>
          ) : null}
        </article>

        {/* Masaüstü yapışkan içindekiler (scroll-spy ile aktif başlık vurgulu) */}
        {showToc ? (
          <aside className="hidden self-start xl:block">
            <div className="sticky top-24">
              <TocNav items={toc} />
            </div>
          </aside>
        ) : null}
      </div>

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
            <p className="mt-8 text-sm text-muted-foreground">
              Tüm rehberler için{" "}
              <Link
                href="/blog"
                className="font-medium text-primary hover:underline"
              >
                blog sayfasına
              </Link>{" "}
              göz atabilirsiniz.
            </p>
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
