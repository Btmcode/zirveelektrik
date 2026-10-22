import { Award, CheckCircle2, Clock, MapPin } from "lucide-react";

const STATS = [
  { icon: Award, value: "20+ Yıl", label: "Deneyim" },
  { icon: CheckCircle2, value: "5.000+", label: "Tamamlanan İş" },
  { icon: Clock, value: "7/24", label: "Hizmet" },
  { icon: MapPin, value: "39", label: "İlçede Servis" },
] as const;

/** Koyu istatistik şeridi - ana sayfa ve hakkımızda sayfasında kullanılır. */
export function StatsBand() {
  return (
    <section aria-label="Zirve Elektrik rakamlarla" className="bg-zinc-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:py-12 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 text-center"
          >
            <stat.icon className="size-8 text-primary" aria-hidden="true" />
            <p className="text-2xl font-bold tracking-tight text-zinc-50 md:text-3xl">
              {stat.value}
            </p>
            <p className="text-sm text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
