import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BlogExplorer, type ExplorerPost } from "@/components/site/blog-explorer";
import { CtaBanner } from "@/components/site/cta-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { calcReadingTime } from "@/lib/content-utils";
import { getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog - Elektrik Rehberleri: Sigorta, Kaçak ve Tesisat",
    description:
      "Sigorta neden atar, elektrik kaçağı nasıl tespit edilir, topraklama zorunlu mu? Elektrik arızaları hakkında uzman rehberleri ve pratik çözüm önerileri.",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  // İçeriği istemciye taşımamak için okuma süresi sunucuda hesaplanır
  const explorerPosts: ExplorerPost[] = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    tags: post.tags,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTime: calcReadingTime(post.content),
  }));

  return (
    <>
      <Breadcrumbs items={[{ name: "Blog", url: "/blog" }]} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Blog"
          title="Elektrik Rehberi"
          description="Ev ve iş yerinizdeki elektrik sorunlarını anlamak için uzman ekibimizden pratik rehberler ve çözüm önerileri. Aradığınız konuyu aramak veya etiketle filtrelemek için araç çubuğunu kullanabilirsiniz."
        />
        {explorerPosts.length > 0 ? (
          <BlogExplorer posts={explorerPosts} />
        ) : (
          <p className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            Yakında yeni yazılar eklenecek.
          </p>
        )}
      </div>
      <CtaBanner
        title="Okumakla Uğraşmayın, Direkt Çözelim"
        description="Rehberler faydalı ama arıza acilse telefon daha hızlıdır. Ustalarımız 7/24 görev başında."
      />
    </>
  );
}
