import React, { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useTheme } from "../../contexts/ThemeContext";
import TableOfContents from "./TableOfContents";
import "./MarkdownViewer.css";

interface MarkdownViewerProps {
  content: string;
  className?: string;
  isPending?: boolean;
  selectedText?: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

const markdownRehypePlugins = [
  [
    rehypeHighlight,
    {
      aliases: {
        javascript: ["react", "react-native"],
        python: ["py"],
      },
    },
  ],
  rehypeRaw,
] as any;

const loadHighlightTheme = (isDark: boolean) => {
  let link = document.getElementById("highlight-theme") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = "highlight-theme";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  link.href = isDark
    ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css"
    : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css";
};

const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(
      /[^\w\-àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+/g,
      "",
    )
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

function stripFencedCodeBlocks(markdown: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let inFence = false;
  for (const line of lines) {
    const t = line.trimStart();
    if (/^(```|~~~)/.test(t)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) out.push(line);
  }
  return out.join("\n");
}

function extractHeadingsFromMarkdown(markdown: string): Heading[] {
  const body = stripFencedCodeBlocks(markdown);
  const headingRegex = /^\s{0,3}(?:>\s*){0,2}(#{1,6})\s+(.+)$/gm;
  const slugCount = new Map<string, number>();
  const matches: Heading[] = [];
  let m: RegExpExecArray | null;

  while ((m = headingRegex.exec(body)) !== null) {
    const level = m[1].length;
    const text = m[2].trim().replace(/^>\s*/g, "").trim();
    const base = generateSlug(text);
    const n = (slugCount.get(base) ?? 0) + 1;
    slugCount.set(base, n);
    const id = n == 1 ? base : `${base}-${n}`;
    matches.push({ id, text, level });
  }

  return matches;
}

const childrenToString = (children: React.ReactNode): string => {
  if (children === null || children === undefined) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToString).join("");
  if (React.isValidElement(children)) {
    const props = children.props as any;
    if (props?.children !== undefined) return childrenToString(props.children);
    if (children.type === "br") return "\n";
    return "";
  }
  return "";
};

const highlightHtml = (html: string): string => {
  let result = html;

  const processAttributes = (middle: string): string => {
    let processed = middle;

    processed = processed.replace(
      /(\s+)([\w-]+)(\s*=\s*)(["'])([^"']*?)(\4)/g,
      (_attrMatch, space: string, attrName: string, equals: string, quote: string, value: string) =>
        `${space}<span class="hljs-attr">${attrName}</span>${equals}${quote}<span class="hljs-string">${value}</span>${quote}`,
    );

    processed = processed.replace(
      /(\s+)([\w-]+)(?=\s|&gt;|\/&gt;)/g,
      (_attrMatch, space: string, attrName: string) => `${space}<span class="hljs-attr">${attrName}</span>`,
    );

    return processed;
  };

  result = result.replace(/(&lt;\/)([\w-]+)(&gt;)/g, (_m, open: string, tagName: string, close: string) => {
    return `${open}<span class="hljs-name hljs-tag">${tagName}</span>${close}`;
  });

  result = result.replace(
    /(&lt;)([\w-]+)([\s\S]*?)(\/&gt;)/g,
    (_m, open: string, tagName: string, middle: string, close: string) => {
      const processedMiddle = processAttributes(middle);
      return `${open}<span class="hljs-name hljs-tag">${tagName}</span>${processedMiddle}${close}`;
    },
  );

  result = result.replace(
    /(&lt;)([\w-]+)([\s\S]*?)(&gt;)/g,
    (_m, open: string, tagName: string, middle: string, close: string) => {
      const processedMiddle = processAttributes(middle);
      return `${open}<span class="hljs-name hljs-tag">${tagName}</span>${processedMiddle}${close}`;
    },
  );

  return result;
};

const CodeBlockTitleBar = () => (
  <div className="aui-code-header-root">
    <div className="aui-code-window-dots" aria-hidden="true">
      <span className="aui-code-dot aui-code-dot--red" />
      <span className="aui-code-dot aui-code-dot--yellow" />
      <span className="aui-code-dot aui-code-dot--green" />
    </div>
  </div>
);

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  className = "",
  isPending = false,
  selectedText,
}) => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const headings = useMemo(() => (content ? extractHeadingsFromMarkdown(content) : []), [content]);
  const headingIdIndexRef = useRef(0);

  useEffect(() => {
    loadHighlightTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.getAttribute("href")?.startsWith("#")) {
        const href = anchor.getAttribute("href");
        if (!href) return;
        e.preventDefault();
        const id = href.substring(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const container = containerRef.current;
    if (container) container.addEventListener("click", handleAnchorClick);
    return () => {
      if (container) container.removeEventListener("click", handleAnchorClick);
    };
  }, [content]);

  if (isPending) {
    return (
      <div className={`markdown-viewer ${className}`}>
        <div className="markdown-loading">Loading…</div>
      </div>
    );
  }

  if (!content || content.trim().length === 0) {
    return (
      <div className={`markdown-viewer ${className}`}>
        <p style={{ color: "#666", fontStyle: "italic" }}>No content to display</p>
      </div>
    );
  }

  headingIdIndexRef.current = 0;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "100%" }}>
      {headings.length > 0 && <TableOfContents headings={headings} containerRef={containerRef} />}
      <div ref={containerRef} className={`markdown-viewer ${className}`}>
        <ReactMarkdown
          rehypePlugins={markdownRehypePlugins}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, ...props }) => {
              const text = childrenToString(children);
              const id = headings[headingIdIndexRef.current++]?.id ?? generateSlug(text);
              return (
                <h1 id={id} className="aui-md-h1" {...props}>
                  {children}
                </h1>
              );
            },
            h2: ({ children, ...props }) => {
              const text = childrenToString(children);
              const id = headings[headingIdIndexRef.current++]?.id ?? generateSlug(text);
              return (
                <h2 id={id} className="aui-md-h2" {...props}>
                  {children}
                </h2>
              );
            },
            h3: ({ children, ...props }) => {
              const text = childrenToString(children);
              const id = headings[headingIdIndexRef.current++]?.id ?? generateSlug(text);
              return (
                <h3 id={id} className="aui-md-h3" {...props}>
                  {children}
                </h3>
              );
            },
            h4: ({ children, ...props }) => {
              const text = childrenToString(children);
              const id = headings[headingIdIndexRef.current++]?.id ?? generateSlug(text);
              return (
                <h4 id={id} className="aui-md-h4" {...props}>
                  {children}
                </h4>
              );
            },
            h5: ({ children, ...props }) => {
              const text = childrenToString(children);
              const id = headings[headingIdIndexRef.current++]?.id ?? generateSlug(text);
              return (
                <h5 id={id} className="aui-md-h5" {...props}>
                  {children}
                </h5>
              );
            },
            h6: ({ children, ...props }) => {
              const text = childrenToString(children);
              const id = headings[headingIdIndexRef.current++]?.id ?? generateSlug(text);
              return (
                <h6 id={id} className="aui-md-h6" {...props}>
                  {children}
                </h6>
              );
            },
            p: ({ children, ...props }) => {
              const childrenArray = React.Children.toArray(children);
              const highlightedText = selectedText
                ? childrenArray.map((child, index) =>
                    typeof child === "string" && child.includes(selectedText) ? (
                      <span key={`highlight-${index}`} className="bg-yellow-200 text-black px-1 rounded">
                        {child}
                      </span>
                    ) : (
                      <React.Fragment key={`child-${index}`}>{child}</React.Fragment>
                    ),
                  )
                : childrenArray;

              return (
                <p className="aui-md-p" {...props}>
                  {highlightedText}
                </p>
              );
            },
            code: ({ children, className: codeClassName, ...props }) => {
              const match = /language-([\w+-]+)/.exec(codeClassName || "");
              const codeContent = childrenToString(children).replace(/\n$/, "");

              if (match && codeContent.trim()) {
                const language = match[1].toLowerCase();
                const isHtml = ["html", "xml", "htm"].includes(language);

                if (isHtml) {
                  const highlighted = highlightHtml(codeContent);
                  return (
                    <div className="my-5 w-full">
                      <CodeBlockTitleBar />
                      <pre className="aui-md-pre aui-md-pre--below-title">
                        <code
                          className={`${codeClassName} hljs language-${language}`}
                          {...props}
                          dangerouslySetInnerHTML={{ __html: highlighted }}
                        />
                      </pre>
                    </div>
                  );
                }

                return (
                  <div className="my-5 w-full">
                    <CodeBlockTitleBar />
                    <pre className="aui-md-pre aui-md-pre--below-title">
                      <code className={codeClassName} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              }

              return (
                <code className="aui-md-inline-code" {...props}>
                  {codeContent || "Empty code block"}
                </code>
              );
            },
            pre: ({ children, ...props }) => {
              const childList = React.Children.toArray(children);
              const hasRenderedElement = childList.some((child) => React.isValidElement(child));
              if (hasRenderedElement) return <>{children}</>;
              return (
                <pre className="aui-md-pre" {...props}>
                  {childrenToString(children)}
                </pre>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownViewer;
