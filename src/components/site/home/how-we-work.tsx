import { FileText, Info, Phone, SearchCheck, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";

const STEPS = [
  {
    icon: Phone,
    title: "Bize Ulaşın",
    text: "Telefonla arayın veya WhatsApp'tan yazın. Arızanızı kısaca anlatın, adresinizi paylaşın.",
  },
  {
    icon: SearchCheck,
    title: "Yerinde Tespit",
    text: "Ustalarımız en kısa sürede adresinize gelir ve arızayı profesyonel ekipmanla yerinde tespit eder.",
  },
  {
    icon: FileText,
    title: "Net Teklif",
    text: "Tespit sonucunda yapılacak işler için şeffaf bir fiyat teklifi sunarız; sürpriz maliyet çıkmaz.",
  },
  {
    icon: Wrench,
    title: "Çözüm",
    text: "Teklifi onaylarsanız işi aynı gün, garantili işçilikle tamamlar ve teslim ederiz.",
  },
] as const;

/** "Nasıl Çalışıyoruz" - iş modelinin 4 adımı. */
export function HowWeWork() {
  return (
    <section aria-label="Nasıl çalışıyoruz" className="bg-muted/60 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nasıl Çalışıyoruz"
          title="4 Adımda Net ve Şeffaf Süreç"
          description="Arızadan çözüme kadar her adımda ne olacağını önceden bilirsiniz. Sürpriz yok, güven var."
        />
        <ol className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full p-6">
                <div className="flex items-center justify-between">
                  <span
                    className="flex size-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <step.icon className="size-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-accent p-4 md:mt-10">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-foreground">
            <strong className="font-semibold">Tespit hizmet bedeli şeffaftır:</strong>{" "}
            Yaptırsanız da yaptırmasanız da yerinde arıza tespiti için belirlenen
            keşif bedeli, ustalar yola çıkmadan önce tarafınıza net olarak
            bildirilir. Onay vermeden hiçbir ücret tahsil edilmez.
          </p>
        </div>
      </div>
    </section>
  );
}
