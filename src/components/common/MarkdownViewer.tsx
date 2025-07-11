import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { COLORS, RADIUS, SPACING } from "../../constants/colors";

// Function to load appropriate highlight.js theme based on system preference
const loadHighlightTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeLink = document.getElementById('highlight-theme') as HTMLLinkElement;
  
  if (themeLink) {
    themeLink.href = prefersDark 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
  }
};

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = "" }) => {
  // Initialize theme on component load
  useEffect(() => {
    if (!document.getElementById('highlight-theme')) {
      const link = document.createElement('link');
      link.id = 'highlight-theme';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    loadHighlightTheme();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', loadHighlightTheme);
    
    return () => mediaQuery.removeEventListener('change', loadHighlightTheme);
  }, []);

  return (
    <div className={`markdown-viewer ${className}`} style={styles.container}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
          h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
          h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
          p: ({ children }) => <p style={styles.paragraph}>{children}</p>,
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            return isBlock ? (
              <code style={styles.codeBlock}>{children}</code>
            ) : (
              <code style={styles.inlineCode}>{children}</code>
            );
          },
          pre: ({ children }) => <pre style={styles.pre}>{children}</pre>,
          ul: ({ children }) => <ul style={styles.list}>{children}</ul>,
          ol: ({ children }) => <ol style={styles.list}>{children}</ol>,
          li: ({ children }) => <li style={styles.listItem}>{children}</li>,
          blockquote: ({ children }) => <blockquote style={styles.blockquote}>{children}</blockquote>,
          a: ({ children, href }) => <a href={href} style={styles.link}>{children}</a>,
          table: ({ children }) => <table style={styles.table}>{children}</table>,
          th: ({ children }) => <th style={styles.tableHeader}>{children}</th>,
          td: ({ children }) => <td style={styles.tableCell}>{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const styles = {
  container: {
    background: COLORS.background.primary,
    color: COLORS.text.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    lineHeight: 1.7,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    border: `1px solid ${COLORS.border.light}`,
  },
  h1: {
    color: COLORS.text.heading,
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: SPACING.lg,
    marginTop: 0,
    lineHeight: 1.2,
  },
  h2: {
    color: COLORS.text.heading,
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
    lineHeight: 1.3,
  },
  h3: {
    color: COLORS.text.heading,
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    lineHeight: 1.4,
  },
  paragraph: {
    color: COLORS.text.primary,
    fontSize: '1rem',
    marginBottom: SPACING.md,
    lineHeight: 1.7,
  },
  inlineCode: {
    background: COLORS.background.secondary,
    color: COLORS.primary[600],
    padding: '2px 6px',
    borderRadius: RADIUS.xs,
    fontSize: '0.9em',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    border: `1px solid ${COLORS.border.light}`,
  },
  codeBlock: {
    display: 'block',
    background: COLORS.background.secondary,
    color: COLORS.text.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    fontSize: '0.9em',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    overflow: 'auto',
    border: `1px solid ${COLORS.border.light}`,
  },
  pre: {
    background: COLORS.background.secondary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'auto',
    marginBottom: SPACING.md,
    border: `1px solid ${COLORS.border.light}`,
  },
  list: {
    marginBottom: SPACING.md,
    paddingLeft: SPACING.lg,
    color: COLORS.text.primary,
  },
  listItem: {
    marginBottom: SPACING.xs,
    color: COLORS.text.primary,
  },
  blockquote: {
    borderLeft: `4px solid ${COLORS.primary[500]}`,
    paddingLeft: SPACING.md,
    marginLeft: 0,
    marginBottom: SPACING.md,
    fontStyle: 'italic',
    color: COLORS.text.secondary,
    background: COLORS.background.secondary,
    padding: SPACING.md,
    borderRadius: `0 ${RADIUS.md} ${RADIUS.md} 0`,
  },
  link: {
    color: COLORS.primary[500],
    textDecoration: 'none',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: SPACING.md,
    border: `1px solid ${COLORS.border.light}`,
  },
  tableHeader: {
    background: COLORS.background.secondary,
    padding: `${SPACING.sm} ${SPACING.md}`,
    textAlign: 'left' as const,
    fontWeight: 600,
    color: COLORS.text.heading,
    border: `1px solid ${COLORS.border.light}`,
  },
  tableCell: {
    padding: `${SPACING.sm} ${SPACING.md}`,
    color: COLORS.text.primary,
    border: `1px solid ${COLORS.border.light}`,
  },
};

export default MarkdownViewer;