import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getApprovedTestimonials } from "@/lib/queries";
import { cn } from "@/lib/utils";

/**
 * Hizmet ve ilçe sayfaları için kompakt yorum şeridi.
 * Zengin sonuç eşiğiyle tutarlı: 3'ten az onaylı yorum varsa hiç
 * render edilmez (boş bölüm görünmez); panelden onay gelince
 * yıldızlarla birlikte otomatik görünür.
 */
export async function ReviewsStrip({
  heading = "Müşterilerimiz Ne Diyor?",
}: {
  heading?: string;
}) {
  const testimonials = await getApprovedTestimonials(3);
  if (testimonials.length < 3) return null;

  return (
    <section aria-label="Müşteri yorumları" className="mt-10">
      <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
        {heading}
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="flex h-full flex-col p-5">
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
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>
            <footer className="mt-4">
              <p className="text-sm font-semibold text-foreground">
                {testimonial.name}
              </p>
              {testimonial.district ? (
                <p className="text-xs text-muted-foreground">
                  {testimonial.district}
                </p>
              ) : null}
            </footer>
          </Card>
        ))}
      </div>
    </section>
  );
}
