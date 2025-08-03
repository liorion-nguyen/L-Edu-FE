import React from 'react';

// Custom SVG Icons for Code Editor
export const CodeIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 16, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
);

export const JavaScriptIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#F7DF1E">
    <rect width="24" height="24" fill="#F7DF1E" rx="2" />
    <path 
      d="M17.09 20.29c-1.5 0-2.47-.75-2.95-1.74l1.42-.81c.27.47.51.87 1.1.87.56 0 .92-.22.92-.79V9.91h1.75v7.95c0 1.85-1.08 2.95-2.65 2.95m-5.41 0c-1.5 0-2.47-.75-2.95-1.74l1.42-.81c.27.47.64.87 1.25.87.56 0 .92-.22.92-.79V9.91h1.75v7.95c0 1.85-1.08 2.95-2.65 2.95"
      fill="#000"
    />
  </svg>
);

export const PythonIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M12.04 2C8.3 2 8.71 3.64 8.71 3.64l.01 1.69h3.35v.47H8.01s-2.49-.28-2.49 3.66c0 3.94 2.17 3.8 2.17 3.8h1.3v-1.83s-.07-2.17 2.13-2.17h3.34c1.8 0 2.04-1.85 2.04-1.85V4.46S14.8 2 12.04 2zM10.5 3.7c.3 0 .53.24.53.53 0 .29-.24.53-.53.53-.29 0-.53-.24-.53-.53 0-.29.24-.53.53-.53z" 
      fill="#3776AB"
    />
    <path 
      d="M11.96 22c3.74 0 3.33-1.64 3.33-1.64l-.01-1.69h-3.35v-.47h4.06s2.49.28 2.49-3.66c0-3.94-2.17-3.8-2.17-3.8h-1.3v1.83s.07 2.17-2.13 2.17H9.54c-1.8 0-2.04 1.85-2.04 1.85v3.99S9.2 22 11.96 22zm1.54-1.7c-.3 0-.53-.24-.53-.53 0-.29.24-.53.53-.53.29 0 .53.24.53.53 0 .29-.24.53-.53.53z" 
      fill="#FFCF02"
    />
  </svg>
);

export const CppIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#00599C">
    <path d="M22.39 9.78c0-1.2-.84-2.46-2.46-3.06L13.27 4.2c-1.32-.48-3.24-.48-4.56 0L2.07 6.72C.45 7.32-.39 8.58-.39 9.78v4.44c0 1.2.84 2.46 2.46 3.06l6.66 2.52c1.32.48 3.24.48 4.56 0l6.66-2.52c1.62-.6 2.46-1.86 2.46-3.06V9.78z"/>
    <text x="12" y="16" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold">C++</text>
  </svg>
);

export const HtmlIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#E34F26">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
  </svg>
);

export const CssIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1572B6">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm4.133 4.518l.458 5.025h10.187l-.329 3.696-3.473.956-3.473-.956-.198-2.218h-2.29l.329 4.082L12 17.341l5.179-1.38.744-8.443H8.98l-.333-2.56h10.705l.457-2.44H5.633z"/>
  </svg>
);

export const TerminalIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 16, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="4,17 10,11 4,5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

export const getLanguageIcon = (language: string, size: number = 16) => {
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return <JavaScriptIcon size={size} />;
    case 'python':
    case 'py':
      return <PythonIcon size={size} />;
    case 'cpp':
    case 'c++':
    case 'c':
      return <CppIcon size={size} />;
    case 'html':
      return <HtmlIcon size={size} />;
    case 'css':
      return <CssIcon size={size} />;
    default:
      return <CodeIcon size={size} />;
  }
};
