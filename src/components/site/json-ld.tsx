interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * JSON-LD yapısal veri bileşeni (schema.org).
 * Güvenlik: "<" karakterleri "\u003c" olarak kaçışlanır; aksi halde admin
 * panellerinden girilen serbest metin (başlık, özet vb.) içindeki
 * "</script>" dizisi script etiketini kırarak XSS'e yol açabilir.
 */
function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }}
    />
  );
}
