import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTr } from "@/lib/utils-format";

interface FeaturedPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string | null;
  tags: string;
  publishedAt?: Date | string | null;
  updatedAt: Date | string;
  readingTime: number;
}

/**
 * Blog listesinin en üstünde yer alan büyük "öne çıkan yazı" kartı.
 * Sunucu ve istemci bileşenlerinde kullanılabilir (yalnızca sunucuya özel
 * API kullanmaz); tarih string olarak da gelebilir (RSC serileştirme).
 */
export function FeaturedBlogCard({ post }: { post: FeaturedPost }) {
  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3);
  const date = formatDateTr(post.publishedAt ?? post.updatedAt);
  const publishedAtIso = post.publishedAt ?? post.updatedAt;

  return (
    <article className="group grid overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md lg:grid-cols-2">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-amber-100 via-amber-50 to-background lg:aspect-auto lg:min-h-[280px]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={`${post.title} - yazı görseli`}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Zap
            className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-primary/30"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex flex-col justify-center p-5 md:p-8">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Öne Çıkan Yazı
        </span>
        {tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-foreground md:text-2xl">
          <Link
            href={`/blog/${post.slug}`}
            className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            {post.title}
            <span className="sr-only"> - yazıyı oku</span>
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            <time dateTime={new Date(publishedAtIso).toISOString()}>{date}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            {post.readingTime} dk okuma
          </span>
        </p>
        <p className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary">
          Yazıyı Oku
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </p>
      </div>
    </article>
  );
}
