import "github-markdown-css"; // Base markdown styling
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

// Function to load appropriate highlight.js theme based on system preference
const loadHighlightTheme = () => {
  // Remove any existing highlight.js stylesheets
  const existingStyles = document.querySelectorAll('link[href*="highlight.js"]');
  existingStyles.forEach(style => style.remove());
  
  // Check if user prefers dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Create and append the appropriate stylesheet
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = prefersDark 
    ? 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css'
    : 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css';
  document.head.appendChild(link);
};

const MarkdownViewer = ({ content }: { content: string }) => {
  useEffect(() => {
    // Load initial theme
    loadHighlightTheme();
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => loadHighlightTheme();
    
    mediaQuery.addEventListener('change', handleThemeChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  return (
    <div
      className="markdown-body markdown-viewer"
      style={{
        backgroundColor: "var(--markdown-bg, rgba(255, 255, 255, 0.95))",
        color: "var(--markdown-text, #24292f)",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid var(--markdown-border, rgba(78, 205, 196, 0.2))",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 16px var(--markdown-glow, rgba(78, 205, 196, 0.1))",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;