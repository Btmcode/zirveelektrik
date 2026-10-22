import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BlogCard } from "@/components/site/blog-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog - Elektrik Sorunları ve Çözümleri",
    description:
      "Sigorta atması, elektrik kaçağı, topraklama ve tesisat sorunları hakkında uzman rehberleri. Elektrik arızalarınızı anlamak ve çözmek için pratik bilgiler.",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Breadcrumbs items={[{ name: "Blog", url: "/blog" }]} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Blog"
          title="Elektrik Rehberi"
          description="Ev ve iş yerinizdeki elektrik sorunlarını anlamak için uzman ekibimizden pratik rehberler ve çözüm önerileri."
        />
        {posts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} priority={index < 3} />
            ))}
          </div>
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
