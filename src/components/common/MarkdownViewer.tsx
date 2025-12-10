import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { RADIUS, SPACING } from "../../constants/colors";
import { useTheme } from "../../contexts/ThemeContext";
import TableOfContents from "./TableOfContents";
import './MarkdownViewer.css';

// Function to load appropriate highlight.js theme based on current theme
const loadHighlightTheme = (isDark: boolean) => {
  const themeLink = document.getElementById('highlight-theme') as HTMLLinkElement;
  
  if (themeLink) {
    // Use a minimal theme and override with custom colors
    themeLink.href = isDark 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    
    // Add custom style tag after theme loads to ensure our overrides work
    setTimeout(() => {
      const customStyle = document.getElementById('custom-highlight-override');
      if (!customStyle) {
        const style = document.createElement('style');
        style.id = 'custom-highlight-override';
        style.textContent = `
          .markdown-viewer pre code.hljs.language-html .hljs-tag,
          .markdown-viewer pre code.hljs.language-html .hljs-name,
          .markdown-viewer pre code.hljs.language-xml .hljs-tag,
          .markdown-viewer pre code.hljs.language-xml .hljs-name,
          .aui-md-pre code.hljs.language-html .hljs-tag,
          .aui-md-pre code.hljs.language-html .hljs-name,
          .aui-md-pre code.hljs.language-xml .hljs-tag,
          .aui-md-pre code.hljs.language-xml .hljs-name {
            color: #9055A2 !important;
          }
          .markdown-viewer pre code.hljs.language-html .hljs-attr,
          .markdown-viewer pre code.hljs.language-xml .hljs-attr,
          .aui-md-pre code.hljs.language-html .hljs-attr,
          .aui-md-pre code.hljs.language-xml .hljs-attr {
            color: #0F7B0F !important;
          }
          .markdown-viewer pre code.hljs.language-html .hljs-string,
          .markdown-viewer pre code.hljs.language-xml .hljs-string,
          .aui-md-pre code.hljs.language-html .hljs-string,
          .aui-md-pre code.hljs.language-xml .hljs-string {
            color: #D97706 !important;
          }
          [data-theme="dark"] .markdown-viewer pre code.hljs.language-html .hljs-tag,
          [data-theme="dark"] .markdown-viewer pre code.hljs.language-html .hljs-name,
          [data-theme="dark"] .aui-md-pre code.hljs.language-html .hljs-tag,
          [data-theme="dark"] .aui-md-pre code.hljs.language-html .hljs-name {
            color: #B794C4 !important;
          }
          [data-theme="dark"] .markdown-viewer pre code.hljs.language-html .hljs-attr,
          [data-theme="dark"] .aui-md-pre code.hljs.language-html .hljs-attr {
            color: #4EC9B0 !important;
          }
          [data-theme="dark"] .markdown-viewer pre code.hljs.language-html .hljs-string,
          [data-theme="dark"] .aui-md-pre code.hljs.language-html .hljs-string {
            color: #F4A261 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }, 100);
  }
};

interface MarkdownViewerProps {
  content: string;
  className?: string;
  isPending?: boolean;
  selectedText?: string;
}

// Helper function to generate slug from text (for anchor links)
const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\-àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]+/g, '') // Remove special chars but keep Vietnamese
    .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')             // Remove leading hyphens
    .replace(/-+$/, '');              // Remove trailing hyphens
};

// Custom HTML highlighting function - works with HTML entities
const highlightHtml = (html: string): string => {
  let result = html;
  
  // Function to process attributes in a tag
  const processAttributes = (middle: string): string => {
    let processed = middle;
    
    // First, highlight attributes with values: attr="value" or attr='value'
    processed = processed.replace(/(\s+)([\w-]+)(\s*=\s*)(["'])([^"']*?)(\4)/g, 
      (attrMatch: string, space: string, attrName: string, equals: string, quote: string, value: string) => {
        if (attrMatch.includes('hljs-')) return attrMatch;
        return `${space}<span class="hljs-attr">${attrName}</span>${equals}${quote}<span class="hljs-string">${value}</span>${quote}`;
      }
    );
    
    // Then, highlight standalone attributes (without values)
    processed = processed.replace(/(\s+)([\w-]+)(?=\s|&gt;|\/&gt;)/g, 
      (attrMatch: string, space: string, attrName: string) => {
        if (attrMatch.includes('hljs-')) return attrMatch;
        // Check if this is part of an attribute value
        const pos = processed.indexOf(attrMatch);
        const before = processed.substring(0, pos);
        // If there's an unclosed quote before, this is likely part of a value
        const singleQuotes = (before.match(/'/g) || []).length;
        const doubleQuotes = (before.match(/"/g) || []).length;
        if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) return attrMatch;
        return `${space}<span class="hljs-attr">${attrName}</span>`;
      }
    );
    
    return processed;
  };
  
  // Step 1: Process closing tags: &lt;/tag&gt;
  result = result.replace(/(&lt;\/)([\w-]+)(&gt;)/g, 
    (match: string, open: string, tagName: string, close: string) => {
      return `${open}<span class="hljs-name hljs-tag">${tagName}</span>${close}`;
    }
  );
  
  // Step 2: Process self-closing tags: &lt;tag /&gt;
  result = result.replace(/(&lt;)([\w-]+)([\s\S]*?)(\/&gt;)/g, 
    (match: string, open: string, tagName: string, middle: string, close: string) => {
      if (match.includes('hljs-')) return match;
      const processedMiddle = processAttributes(middle);
      return `${open}<span class="hljs-name hljs-tag">${tagName}</span>${processedMiddle}${close}`;
    }
  );
  
  // Step 3: Process opening tags: &lt;tag ... &gt;
  result = result.replace(/(&lt;)([\w-]+)([\s\S]*?)(&gt;)/g, 
    (match: string, open: string, tagName: string, middle: string, close: string) => {
      if (match.includes('hljs-')) return match;
      const processedMiddle = processAttributes(middle);
      return `${open}<span class="hljs-name hljs-tag">${tagName}</span>${processedMiddle}${close}`;
    }
  );
  
  return result;
};

interface Heading {
  id: string;
  text: string;
  level: number;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  content, 
  className = "", 
  isPending = false, 
  selectedText 
}) => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  
  // Initialize theme on component load
  useEffect(() => {
    if (!document.getElementById('highlight-theme')) {
      const link = document.createElement('link');
      link.id = 'highlight-theme';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    loadHighlightTheme(isDark);
  }, [isDark]);

  // Extract headings from markdown content
  useEffect(() => {
    if (!content) {
      setHeadings([]);
      return;
    }

    const extractHeadings = (markdown: string): Heading[] => {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      const matches: Heading[] = [];
      let match;

      while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = generateSlug(text);
        matches.push({ id, text, level });
      }

      return matches;
    };

    const extractedHeadings = extractHeadings(content);
    setHeadings(extractedHeadings);
  }, [content]);

  // Handle anchor link clicks for smooth scrolling
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        const href = anchor.getAttribute('href');
        if (href) {
          e.preventDefault();
          const id = href.substring(1); // Remove the # symbol
          const element = document.getElementById(id);
          
          if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed header
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    // Add event listener to the markdown viewer container
    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleAnchorClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleAnchorClick);
      }
    };
  }, [content]);

  // Function to highlight selected text
  const highlightText = (text: string) => {
    if (!selectedText || typeof text !== 'string') return text;
    
    if (text.includes(selectedText)) {
      return (
        <span className="bg-yellow-200 text-black px-1 rounded">
          {text}
        </span>
      );
    }
    return text;
  };

  if (isPending) {
    return (
      <div className={`markdown-viewer ${className}`} style={styles.container}>
        <div className="markdown-loading">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-4">
              <div className="markdown-loading-line"></div>
              <div className="markdown-loading-line"></div>
              <div className="markdown-loading-line"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback: if content is empty or ReactMarkdown fails, show raw content
  if (!content || content.trim().length === 0) {
    return (
      <div className={`markdown-viewer ${className}`} style={styles.container}>
        <p style={{ color: '#666', fontStyle: 'italic' }}>No content to display</p>
      </div>
    );
  }

  try {
    return (
      <div style={styles.wrapper}>
        <div ref={containerRef} className={`markdown-viewer ${className}`} style={styles.container}>
          <ReactMarkdown
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => {
            const text = childrenToString(children);
            const id = generateSlug(text);
            return (
              <h1 id={id} className="aui-md-h1" {...props}>{children}</h1>
            );
          },
          h2: ({ children, ...props }) => {
            const text = childrenToString(children);
            const id = generateSlug(text);
            return (
              <h2 id={id} className="aui-md-h2" {...props}>{children}</h2>
            );
          },
          h3: ({ children, ...props }) => {
            const text = childrenToString(children);
            const id = generateSlug(text);
            return (
              <h3 id={id} className="aui-md-h3" {...props}>{children}</h3>
            );
          },
          h4: ({ children, ...props }) => {
            const text = childrenToString(children);
            const id = generateSlug(text);
            return (
              <h4 id={id} className="aui-md-h4" {...props}>{children}</h4>
            );
          },
          h5: ({ children, ...props }) => {
            const text = childrenToString(children);
            const id = generateSlug(text);
            return (
              <h5 id={id} className="aui-md-h5" {...props}>{children}</h5>
            );
          },
          h6: ({ children, ...props }) => {
            const text = childrenToString(children);
            const id = generateSlug(text);
            return (
              <h6 id={id} className="aui-md-h6" {...props}>{children}</h6>
            );
          },
          p: ({ children, ...props }) => {
            const childrenArray = React.Children.toArray(children);
            const hasImage = childrenArray.some(
              child => React.isValidElement(child) && child.type === 'img'
            );

            if (hasImage) {
              return (
                <div className="flex w-full justify-center">
                  <div className="flex w-2/3 max-w-full justify-center">
                    <p className="aui-md-p text-center" {...props}>
                      {children}
                    </p>
                  </div>
                </div>
              );
            }

            const highlightedText = selectedText
              ? childrenArray.map((child, index) =>
                  typeof child === 'string' && child.includes(selectedText) ? (
                    <span key={`highlight-${index}`} className="bg-yellow-200 text-black px-1 rounded">
                      {child}
                    </span>
                  ) : (
                    <React.Fragment key={`child-${index}`}>{child}</React.Fragment>
                  )
                )
              : childrenArray;

            return (
              <p className="aui-md-p" {...props}>
                {highlightedText}
              </p>
            );
          },
          code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            
            // Convert children to string safely
            const codeContent = childrenToString(children).replace(/\n$/, '');
            
            if (match && codeContent.trim()) {
              const language = match[1].toLowerCase();
              const isHtml = ['html', 'xml', 'htm'].includes(language);
              
              // Custom HTML highlighting for HTML/XML code
              if (isHtml) {
                const highlighted = highlightHtml(codeContent);
                return (
                  <div className="my-5 w-full">
                    <div className="aui-code-header-root">
                      <div className="aui-code-header-language">
                        <span>{match[1]}</span>
                      </div>
                    </div>
                    <pre className="aui-md-pre">
                      <code 
                        className={`${className} hljs language-${language}`} 
                        {...props}
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                      />
                    </pre>
                  </div>
                );
              }
              
              // For other languages, use default highlighting
              return (
                <div className="my-5 w-full">
                  <div className="aui-code-header-root">
                    <div className="aui-code-header-language">
                      <span>{match[1]}</span>
                    </div>
                  </div>
                  <pre className="aui-md-pre">
                    <code 
                      className={className} 
                      {...props}
                    >
                      {codeContent}
                    </code>
                  </pre>
                </div>
              );
            }
            
            return (
              <code className="aui-md-inline-code" {...props}>
                {codeContent || 'Empty code block'}
              </code>
            );
          },
          pre: ({ children, ...props }) => {
            // If pre contains code element, just return the children
            // The code element will handle the styling
            const hasCodeChild = React.Children.toArray(children).some(
              child => React.isValidElement(child) && child.type === 'code'
            );
            
            if (hasCodeChild) {
              return <>{children}</>;
            }
            
            // For plain pre blocks without code
            return (
              <pre className="aui-md-pre" {...props}>
                {childrenToString(children)}
              </pre>
            );
          },
          ul: ({ children, ...props }) => (
            <ul className="aui-md-ul" {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="aui-md-ol" {...props}>{children}</ol>
          ),
          li: ({ children, ...props }) => (
            <li {...props}>{children}</li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="aui-md-blockquote" {...props}>{children}</blockquote>
          ),
          a: ({ children, href, ...props }) => {
            // Handle anchor links (internal links starting with #)
            if (href?.startsWith('#')) {
              return (
                <a 
                  href={href} 
                  className="aui-md-a" 
                  onClick={(e) => {
                    e.preventDefault();
                    const id = href.substring(1); // Remove the # symbol
                    // Try to find element by exact id first
                    let element = document.getElementById(id);
                    
                    // If not found, try to find by matching slug (for cases where id format differs)
                    if (!element) {
                      // Try to find heading that matches the slug pattern
                      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                      headings.forEach((heading) => {
                        if (heading.id && heading.id.toLowerCase() === id.toLowerCase()) {
                          element = heading as HTMLElement;
                        }
                      });
                    }
                    
                    if (element) {
                      const offsetTop = element.offsetTop - 80; // Account for fixed header
                      window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                      });
                    } else {
                      // Fallback: try to scroll to any element with matching text content
                      console.warn(`Could not find element with id: ${id}`);
                    }
                  }}
                  {...props}
                >
                  {children}
                </a>
              );
            }
            // External links
            return (
              <a href={href} className="aui-md-a" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
            );
          },
          table: ({ children, ...props }) => (
            <div className="table-wrapper">
              <table className="aui-md-table" {...props}>{children}</table>
            </div>
          ),
          thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
          tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
          tr: ({ children, ...props }) => (
            <tr className="aui-md-tr" {...props}>{children}</tr>
          ),
          th: ({ children, ...props }) => (
            <th className="aui-md-th" {...props}>{children}</th>
          ),
          td: ({ children, ...props }) => (
            <td className="aui-md-td" {...props}>{children}</td>
          ),
          strong: ({ children, ...props }) => (
            <strong className="aui-md-strong" {...props}>{children}</strong>
          ),
          em: ({ children, ...props }) => (
            <em className="aui-md-em" {...props}>{children}</em>
          ),
          hr: ({ ...props }) => (
            <hr className="aui-md-hr" {...props} />
          ),
          sup: ({ children, ...props }) => (
            <sup className="aui-md-sup" {...props}>{children}</sup>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
        </div>
        <TableOfContents headings={headings} containerRef={containerRef} />
      </div>
  );
  } catch (error) {
    return (
      <div className={`markdown-viewer ${className}`} style={styles.container}>
        <div>
          <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>Error rendering markdown:</p>
          <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <details style={{ marginTop: '16px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Raw content:</summary>
            <pre style={{ background: '#f0f0f0', padding: '16px', borderRadius: '8px', overflow: 'auto', marginTop: '8px' }}>
              {content}
            </pre>
          </details>
        </div>
      </div>
    );
  }
};

const styles = {
  wrapper: {
    position: 'relative' as const,
    width: '100%' as const,
  },
  container: {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    lineHeight: 1.7,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    border: "1px solid var(--border-color)",
    position: 'relative' as const,
    width: '100%' as const,
    maxWidth: '100%' as const,
    marginRight: '220px' as const, // Space for TOC
  },
};

// Helper function to safely convert React children to string
const childrenToString = (children: React.ReactNode): string => {
  if (children === null || children === undefined) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (typeof children === 'boolean') return String(children);
  
  if (Array.isArray(children)) {
    return children.map(childrenToString).join('');
  }
  
  if (React.isValidElement(children)) {
    // For React elements, try to extract text content recursively
    const childProps = children.props as any;
    if (childProps?.children !== undefined) {
      return childrenToString(childProps.children);
    }
    
    // Handle specific element types
    if (children.type === 'br') return '\n';
    if (children.type === 'hr') return '---';
    
    return '';
  }
  
  // Handle objects (this is where [object Object] might appear)
  if (typeof children === 'object') {
    // If it's a React fragment
    if (children && typeof children === 'object' && 'type' in children && 
        (children as any).type === React.Fragment) {
      const fragmentProps = (children as any).props;
      if (fragmentProps?.children) {
        return childrenToString(fragmentProps.children);
      }
    }
    
    // Try to extract meaningful content from objects
    try {
      if (children && typeof children === 'object' && 'toString' in children) {
        const str = (children as any).toString();
        // Avoid "[object Object]" by checking if toString was overridden
        if (str !== '[object Object]') {
          return str;
        }
      }
      // Format as JSON for debugging
      return JSON.stringify(children, null, 2);
    } catch {
      return '[Invalid Object]';
    }
  }
  
  // Fallback
  const str = String(children);
  return str === '[object Object]' ? '[Complex Content]' : str;
};

// Helper functions for markdown processing
export const markdownHelpers = {
  /**
   * Kiểm tra xem text có chứa markdown bold format (**text**) không
   */
  hasBoldMarkdown: (text: string): boolean => {
    const boldRegex = /\*\*(.+?)\*\*/g;
    return boldRegex.test(text);
  },

  /**
   * Trích xuất tất cả bold text từ markdown
   */
  extractBoldText: (text: string): string[] => {
    const boldRegex = /\*\*(.+?)\*\*/g;
    const matches = [];
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      matches.push(match[1]); // match[1] chứa text bên trong **
    }
    
    return matches;
  },

  /**
   * Thay thế markdown bold với HTML bold tags
   */
  convertBoldMarkdownToHtml: (text: string): string => {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  },

  /**
   * Đếm số lượng bold text trong markdown
   */
  countBoldText: (text: string): number => {
    const boldRegex = /\*\*(.+?)\*\*/g;
    const matches = text.match(boldRegex);
    return matches ? matches.length : 0;
  },

  /**
   * Remove bold markdown syntax, keep only text
   */
  removeBoldMarkdown: (text: string): string => {
    return text.replace(/\*\*(.+?)\*\*/g, '$1');
  },

  /**
   * Hàm chuyển đổi mảng JSON thành bảng Markdown
   */
  arrayToMarkdownTable: (jsonArray: any[]): string => {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) return "";

    const headers = Object.keys(jsonArray[0]);
    let markdownTable = `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n`;

    jsonArray.forEach(item => {
      const row = headers.map(header => String(item[header] || "")).join(" | ");
      markdownTable += `| ${row} |\n`;
    });

    return markdownTable;
  },

  /**
   * Advanced function to parse markdown and extract info
   */
  parseMarkdownBold: (text: string) => {
    const boldTexts = markdownHelpers.extractBoldText(text);
    const hasBold = markdownHelpers.hasBoldMarkdown(text);
    const count = markdownHelpers.countBoldText(text);
    const plainText = markdownHelpers.removeBoldMarkdown(text);
    
    return {
      hasBold,
      boldTexts,
      count,
      plainText,
      originalText: text,
    };
  }
};

export default MarkdownViewer;