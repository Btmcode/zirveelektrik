import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { getApprovedTestimonials } from "@/lib/queries";
import { cn } from "@/lib/utils";

/** Ana sayfa - onaylı müşteri yorumları bölümü. */
export async function TestimonialsSection() {
  const testimonials = await getApprovedTestimonials(6);
  if (testimonials.length === 0) return null;

  return (
    <section aria-label="Müşteri yorumları" className="bg-muted/60 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Referanslar"
          title="Müşterilerimiz Ne Diyor?"
          description="İstanbul'un dört yanında binlerce mutlu müşteri. Yorumlar müşterilerimiz tarafından gönderilir ve onay sonrası yayınlanır."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex h-full flex-col p-6">
              <div
                className="flex gap-1"
                role="img"
                aria-label={`Değerlendirme: 5 üzerinden ${testimonial.rating} yıldız`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "size-4",
                      index < testimonial.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              <footer className="mt-5 flex items-center gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                  aria-hidden="true"
                >
                  {testimonial.name.charAt(0).toLocaleUpperCase("tr-TR")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  {testimonial.district ? (
                    <p className="text-xs text-muted-foreground">
                      {testimonial.district}
                    </p>
                  ) : null}
                </div>
              </footer>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
