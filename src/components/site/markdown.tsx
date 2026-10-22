import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { slugifyHeading } from "@/lib/content-utils";

interface MarkdownProps {
  content: string;
  className?: string;
  /**
   * Başlık id sayaç durumu. Bir yazı birden fazla MarkdownContent ile
   * (ör. yazı ortası CTA bölmesi) render ediliyorsa AYNI state nesnesi
   * geçilmelidir; aksi hâlde aynı slug iki kez üretilir.
   * content-utils.extractHeadings ile aynı dedupe şemasını kullanır.
   */
  idState?: HeadingIdState;
}

export interface HeadingIdState {
  h2: Map<string, number>;
  h3: Map<string, number>;
}

export function createHeadingIdState(): HeadingIdState {
  return { h2: new Map(), h3: new Map() };
}

/** React children'ı düz metne indirger (başlık slug'ı için). */
function nodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return nodeToText(props?.children ?? "");
  }
  return "";
}

/** extractHeadings ile birebir aynı deterministik id üretir. */
function headingId(
  base: string,
  seen: Map<string, number>
): string {
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

/**
 * Markdown içeriği güvenli biçimde render eder.
 * - react-markdown varsayılan olarak HTML'i kaçırır (XSS koruması).
 * - H2/H3 başlıklara TOC ile eşleşen deterministik id ekler.
 */
export function MarkdownContent({ content, className, idState }: MarkdownProps) {
  const state = idState ?? createHeadingIdState();

  return (
    <div className={`article-content ${className ?? ""}`}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => (
            <a href={href ?? "#"} rel="noopener noreferrer">
              {children}
            </a>
          ),
          h2: ({ children }) => {
            const base = slugifyHeading(nodeToText(children));
            return (
              <h2
                id={headingId(base, state.h2)}
                className="scroll-mt-28"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const base = slugifyHeading(nodeToText(children));
            return (
              <h3
                id={headingId(base, state.h3)}
                className="scroll-mt-28"
              >
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
