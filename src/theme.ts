import type { ThemeConfig } from "antd";

// Define CSS custom properties for theme-aware styling
const setupThemeProperties = () => {
  const root = document.documentElement;
  
  // Check if user prefers dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (prefersDark) {
    // Dark theme variables
    root.style.setProperty('--markdown-bg', 'rgba(26, 74, 74, 0.95)');
    root.style.setProperty('--markdown-text', '#B0E0E6');
    root.style.setProperty('--markdown-border', 'rgba(78, 205, 196, 0.3)');
    root.style.setProperty('--markdown-glow', 'rgba(78, 205, 196, 0.2)');
    root.style.setProperty('--markdown-code-bg', 'rgba(10, 46, 46, 0.8)');
    root.style.setProperty('--markdown-code-text', '#4ECDC4');
    root.style.setProperty('--markdown-quote-border', '#4ECDC4');
    root.style.setProperty('--markdown-link', '#4ECDC4');
    root.style.setProperty('--markdown-heading', '#B0E0E6');
  } else {
    // Light theme variables
    root.style.setProperty('--markdown-bg', 'rgba(255, 255, 255, 0.95)');
    root.style.setProperty('--markdown-text', '#2c3e50');
    root.style.setProperty('--markdown-border', 'rgba(78, 205, 196, 0.2)');
    root.style.setProperty('--markdown-glow', 'rgba(78, 205, 196, 0.1)');
    root.style.setProperty('--markdown-code-bg', 'rgba(248, 249, 250, 0.95)');
    root.style.setProperty('--markdown-code-text', '#0969da');
    root.style.setProperty('--markdown-quote-border', '#0969da');
    root.style.setProperty('--markdown-link', '#0969da');
    root.style.setProperty('--markdown-heading', '#24292f');
  }
};

// Initialize theme properties
setupThemeProperties();

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setupThemeProperties);

const theme: ThemeConfig = {
  token: {
    // More elegant and less harsh color palette
    colorPrimary: "#4ECDC4", // Softer teal as primary
    colorBorder: "#7fb3d3", // Softer border color
    colorBgLayout: "#f8fafc", // Softer background
    colorBgBase: "#ffffff",
    colorTextBase: "#2c3e50", // Softer text color
    colorTextSecondary: "#64748b", // More subtle secondary text
    colorBgContainer: "#ffffff",
    
    // Refined color tokens for better elegance
    colorLink: "#4ECDC4",
    colorLinkHover: "#45b7b8",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    
    // Subtle shadows and borders
    boxShadowSecondary: "0 4px 12px rgba(0, 0, 0, 0.05)",
    borderRadiusLG: 12,
    borderRadiusXS: 4,
  },
  components: {
    Typography: {
      colorText: "#2c3e50",
      colorTextHeading: "#1e293b",
    },
    Button: {
      colorText: "#FFFFFF",
      colorPrimary: "#4ECDC4",
      colorPrimaryHover: "#45b7b8",
      colorPrimaryActive: "#3ba7a9",
      boxShadow: "0 2px 8px rgba(78, 205, 196, 0.2)",
      borderRadius: 8,
    },
    Card: {
      colorBgContainer: "#ffffff",
      colorBorder: "rgba(78, 205, 196, 0.1)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      borderRadiusLG: 12,
    },
    Input: {
      colorBgContainer: "#ffffff",
      colorBorder: "rgba(78, 205, 196, 0.2)",
      colorPrimaryHover: "rgba(78, 205, 196, 0.4)",
      colorPrimary: "#4ECDC4",
      borderRadius: 8,
    },
    Modal: {
      colorBgElevated: "#ffffff",
      colorBorder: "rgba(78, 205, 196, 0.1)",
      borderRadiusLG: 16,
    },
    Divider: {
      colorSplit: "rgba(78, 205, 196, 0.15)",
    },
  },
};

export default theme;
