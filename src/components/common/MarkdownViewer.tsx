import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { RADIUS, SPACING } from "../../constants/colors";
import { useTheme } from "../../contexts/ThemeContext";
import './MarkdownViewer.css';

// Function to load appropriate highlight.js theme based on current theme
const loadHighlightTheme = (isDark: boolean) => {
  const themeLink = document.getElementById('highlight-theme') as HTMLLinkElement;
  
  if (themeLink) {
    themeLink.href = isDark 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
  }
};

interface MarkdownViewerProps {
  content: string;
  className?: string;
  isPending?: boolean;
  selectedText?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  content, 
  className = "", 
  isPending = false, 
  selectedText 
}) => {
  const { isDark } = useTheme();
  
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

  return (
    <div className={`markdown-viewer ${className}`} style={styles.container}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="aui-md-h1" {...props}>{children}</h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="aui-md-h2" {...props}>{children}</h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="aui-md-h3" {...props}>{children}</h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="aui-md-h4" {...props}>{children}</h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="aui-md-h5" {...props}>{children}</h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="aui-md-h6" {...props}>{children}</h6>
          ),
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
              return (
                <div className="my-5 w-full">
                  <div className="aui-code-header-root">
                    <div className="aui-code-header-language">
                      <span>{match[1]}</span>
                    </div>
                  </div>
                  <pre className="aui-md-pre">
                    <code className={className} {...props}>
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
          a: ({ children, href, ...props }) => (
            <a href={href} className="aui-md-a" {...props}>{children}</a>
          ),
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
  );
};

const styles = {
  container: {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    lineHeight: 1.7,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    border: "1px solid var(--border-color)",
    position: 'relative' as const,
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