interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}

/** Tutarlı bölüm başlığı kalıbı (DESIGN.md §3) */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 md:mb-12 ${align === "center" ? "text-center mx-auto max-w-3xl" : "text-left max-w-2xl"}`}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-2xl md:text-4xl font-bold tracking-tight ${
          dark ? "text-zinc-50" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-3 text-base md:text-lg ${
            dark ? "text-zinc-300" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
