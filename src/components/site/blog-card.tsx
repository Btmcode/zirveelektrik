import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTr } from "@/lib/utils-format";
import { calcReadingTime } from "@/lib/content-utils";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    tags: string;
    publishedAt?: Date | null;
    updatedAt: Date;
  };
  priority?: boolean;
}

/** Blog yazısı kartı - liste sayfası ve ilgili yazılar için ortak kullanım. */
export function BlogCard({ post, priority = false }: BlogCardProps) {
  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 2);
  const date = formatDateTr(post.publishedAt ?? post.updatedAt);
  const readingTime = calcReadingTime(post.content);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-amber-100 via-amber-50 to-background">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={`${post.title} - yazı görseli`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Zap
            className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-primary/30"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-foreground">
          <Link
            href={`/blog/${post.slug}`}
            className="rounded-sm after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            {post.title}
            <span className="sr-only"> - yazıyı oku</span>
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            <time dateTime={(post.publishedAt ?? post.updatedAt).toISOString()}>
              {date}
            </time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            {readingTime} dk okuma
          </span>
        </p>
      </div>
    </article>
  );
}
