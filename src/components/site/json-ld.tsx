interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * JSON-LD yapısal veri bileşeni (schema.org).
 * Not: content yalnızca sunucuda üretilen güvenilir veridir;
 * kullanıcı girdisi zod ile sterilize edilmeden buraya geçmez.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
