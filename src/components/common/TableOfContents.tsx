import React, { useEffect, useState, useRef } from 'react';
import './TableOfContents.css';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function getScrollParent(el: HTMLElement | null): HTMLElement | Window | null {
  let p: HTMLElement | null = el?.parentElement ?? null;
  while (p) {
    const { overflowY } = window.getComputedStyle(p);
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      return p;
    }
    p = p.parentElement;
  }
  return typeof window !== "undefined" ? window : null;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, containerRef }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [headingPositions, setHeadingPositions] = useState<Map<string, number>>(new Map());
  const tocRef = useRef<HTMLDivElement>(null);

  // Calculate heading positions relative to document
  useEffect(() => {
    if (headings.length === 0) return;

    const calculatePositions = () => {
      const positions = new Map<string, number>();
      const container = containerRef.current;
      
      if (!container) return;

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          // Get absolute position relative to document
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const absoluteTop = rect.top + scrollTop;
          positions.set(heading.id, absoluteTop);
        }
      });

      setHeadingPositions(positions);
    };

    // Calculate positions after a short delay to ensure DOM is ready
    const timer = setTimeout(calculatePositions, 100);
    const scrollRoot = getScrollParent(containerRef.current);
    window.addEventListener("resize", calculatePositions);
    scrollRoot?.addEventListener("scroll", calculatePositions, { passive: true });
    window.addEventListener("scroll", calculatePositions, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculatePositions);
      scrollRoot?.removeEventListener("scroll", calculatePositions);
      window.removeEventListener("scroll", calculatePositions);
    };
  }, [headings, containerRef]);

  // Scroll spy - highlight current section
  useEffect(() => {
    if (headings.length === 0) return;

    const scrollRoot = getScrollParent(containerRef.current);

    const handleScroll = () => {
      const offset = 100;
      let current = "";

      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (scrollRoot instanceof Window) {
          if (rect.top <= offset) {
            current = headings[i].id;
            break;
          }
        } else if (scrollRoot) {
          const rootRect = (scrollRoot as HTMLElement).getBoundingClientRect();
          if (rect.top <= rootRect.top + offset) {
            current = headings[i].id;
            break;
          }
        }
      }

      if (current) {
        setActiveId(current);
      }
    };

    scrollRoot?.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollRoot?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings, containerRef]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  // Calculate progress indicator positions
  const getProgressPositions = () => {
    if (headingPositions.size === 0) return [];
    const container = containerRef.current;
    if (!container) return [];

    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;
    const containerHeight = containerRect.height;
    const viewportHeight = window.innerHeight;
    
    // Calculate the visible range of the container
    const visibleStart = Math.max(0, window.scrollY - containerTop);
    const visibleEnd = Math.min(containerHeight, window.scrollY + viewportHeight - containerTop);

    return headings.map((heading) => {
      const headingPosition = headingPositions.get(heading.id);
      if (headingPosition === undefined) return null;

      // Calculate position relative to container
      const relativePosition = headingPosition - containerTop;
      
      // Map to percentage of container height
      const percentage = (relativePosition / containerHeight) * 100;
      
      // Only show if within visible range
      const isVisible = relativePosition >= visibleStart - 100 && relativePosition <= visibleEnd + 100;
      
      return {
        id: heading.id,
        position: Math.max(0, Math.min(100, percentage)),
        isActive: activeId === heading.id,
        isVisible,
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null && item.isVisible);
  };

  const progressPositions = getProgressPositions();

  return (
    <div
      ref={tocRef}
      className={`table-of-contents ${isHovered ? 'toc-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress Indicator */}
      <div className="toc-progress-indicator">
        {progressPositions.map((item) => {
          if (!item) return null;
          return (
            <div
              key={item.id}
              className={`toc-progress-line ${item.isActive ? 'toc-progress-active' : ''}`}
              style={{
                top: `${item.position}%`,
              }}
            />
          );
        })}
      </div>

      <div className="toc-header">
        <span className="toc-title">MỤC LỤC</span>
      </div>
      <nav className="toc-nav">
        {headings.map((heading) => (
          <div
            key={heading.id}
            className={`toc-item toc-level-${heading.level} ${activeId === heading.id ? 'toc-active' : ''}`}
            onClick={() => scrollToHeading(heading.id)}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <span className="toc-item-text">{heading.text}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;

