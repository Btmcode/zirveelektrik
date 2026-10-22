import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Markdown içeriği güvenli biçimde render eder.
 * react-markdown varsayılan olarak HTML'i kaçırır (XSS koruması);
 * raw HTML decode edilmez, harici bileşen enjekte edilmez.
 */
export function MarkdownContent({ content, className }: MarkdownProps) {
  return (
    <div className={`article-content ${className ?? ""}`}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => (
            <a href={href ?? "#"} rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
