"use client";

import { useMemo, useState, useTransition } from "react";
import { FileSearch, LayoutGrid, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogCard } from "@/components/site/blog-card";
import { FeaturedBlogCard } from "@/components/site/featured-blog-card";

export interface ExplorerPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string | null;
  tags: string;
  publishedAt?: Date | string | null;
  updatedAt: Date | string;
  readingTime: number;
}

function tagList(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * Blog listesi deneyimi: konu arama + etiket filtreleri + öne çıkan yazı.
 * Filtreleme tamamen istemci tarafındadır; en yeni yazı, filtre temizken
 * büyük "Öne Çıkan Yazı" kartında gösterilir.
 */
export function BlogExplorer({ posts }: { posts: ExplorerPost[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of tagList(post.tags)) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(
      ([a, ca], [b, cb]) => cb - ca || a.localeCompare(b, "tr")
    );
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return posts.filter((post) => {
      const matchesTag = !activeTag || tagList(post.tags).includes(activeTag);
      const matchesQuery =
        !q ||
        post.title.toLocaleLowerCase("tr").includes(q) ||
        post.excerpt.toLocaleLowerCase("tr").includes(q);
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  const isFilterActive = query.trim() !== "" || activeTag !== null;
  const showFeatured = !isFilterActive && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  const chipClass = (active: boolean) =>
    [
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
      "focus-visible:outline-2 focus-visible:outline-ring",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
    ].join(" ");

  return (
    <div>
      {/* Araç çubuğu - arama + etiketler */}
      <div className="mt-8 rounded-xl border border-border bg-card p-4 md:p-5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) =>
              startTransition(() => setQuery(event.target.value))
            }
            placeholder="Konu ara: sigorta, kaçak, topraklama, şalter..."
            aria-label="Blog yazılarında ara"
            className="pl-9"
          />
        </div>
        {allTags.length > 0 ? (
          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Etikete göre filtrele"
          >
            <button
              type="button"
              aria-pressed={!activeTag}
              onClick={() => setActiveTag(null)}
              className={chipClass(!activeTag)}
            >
              <LayoutGrid className="size-3.5" aria-hidden="true" />
              Tümü ({posts.length})
            </button>
            {allTags.map(([tag, count]) => (
              <button
                key={tag}
                type="button"
                aria-pressed={activeTag === tag}
                onClick={() =>
                  setActiveTag((prev) => (prev === tag ? null : tag))
                }
                className={chipClass(activeTag === tag)}
              >
                {tag} ({count})
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} yazı listeleniyor
      </p>

      {featured ? (
        <div className="mt-6">
          <FeaturedBlogCard post={featured} />
        </div>
      ) : null}

      {rest.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : !featured ? (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <span
            className="flex size-12 items-center justify-center rounded-lg bg-muted"
            aria-hidden="true"
          >
            <FileSearch className="size-6 text-muted-foreground" />
          </span>
          <p className="mt-4 text-sm font-semibold text-foreground">
            Aramanızla eşleşen yazı bulunamadı
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Farklı bir kelime deneyin veya filtreleri temizleyin.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setQuery("");
              setActiveTag(null);
            }}
          >
            <X className="size-4" aria-hidden="true" />
            Filtreleri Temizle
          </Button>
        </div>
      ) : null}
    </div>
  );
}
