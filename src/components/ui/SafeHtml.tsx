"use client";

import DOMPurify from "dompurify";
import { useMemo } from "react";

export function SafeHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const sanitized = useMemo(() => {
    if (typeof window === "undefined") return html;
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["p", "br", "em", "strong", "b", "i", "u", "sub", "sup", "ul", "ol", "li", "span"],
      ALLOWED_ATTR: [],
    });
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
