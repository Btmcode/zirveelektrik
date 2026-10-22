/* eslint-disable react-hooks/static-components -- Lucide ikonu ICON_MAP allow-list'inden çözülür; bileşen tanımı değildir */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getIcon } from "./icon-map";

interface ServiceCardProps {
  service: {
    slug: string;
    title: string;
    excerpt: string;
    icon?: string | null;
  };
}

/** Hizmet kartı - ikon, başlık (stretch link), özet ve detay bağlantısı. */
export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = getIcon(service.icon);

  return (
    <Card className="group relative h-full p-6">
      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-6 text-primary" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
        <Link
          href={`/hizmetler/${service.slug}`}
          className="rounded-sm after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-ring"
        >
          {service.title}
          <span className="sr-only"> - detaylı bilgi</span>
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {service.excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Detaylı Bilgi
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Card>
  );
}
