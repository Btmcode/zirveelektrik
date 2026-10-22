import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DistrictLinkProps {
  district: {
    slug: string;
    name: string;
  };
}

/** "X Elektrikçi" ilçe bağlantı kartı - ana sayfa ve bölgeler sayfasında ortak kullanım. */
export function DistrictLink({ district }: DistrictLinkProps) {
  return (
    <Link
      href={`/bolgeler/${district.slug}`}
      className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span>{district.name} Elektrikçi</span>
      <ArrowRight
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
        aria-hidden="true"
      />
    </Link>
  );
}
