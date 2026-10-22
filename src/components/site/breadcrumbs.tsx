import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "./json-ld";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  /** Ana Sayfa hariç kırılım listesi (sırayla). */
  items: BreadcrumbItem[];
}

/**
 * Görsel breadcrumb + BreadcrumbList JSON-LD üretir.
 * İlk kırılım her zaman "Ana Sayfa"dır.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const all: BreadcrumbItem[] = [{ name: "Ana Sayfa", url: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/50">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <li className="flex items-center gap-1.5">
            <Link
              href="/"
              className="rounded-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
              aria-label="Ana Sayfa"
            >
              <Home className="size-4" aria-hidden="true" />
            </Link>
          </li>
          {all.slice(1).map((item, index) => {
            const isLast = index === all.length - 2;
            return (
              <li key={item.url} className="flex items-center gap-1.5">
                <ChevronRight
                  className="size-3.5 text-muted-foreground/60"
                  aria-hidden="true"
                />
                {isLast ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="rounded-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
