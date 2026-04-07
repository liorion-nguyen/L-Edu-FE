import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Force dark theme (no toggle)
  const [theme] = useState<Theme>('dark');

  const toggleTheme = () => {
    // Intentionally disabled; dark is the only supported theme.
    localStorage.setItem('theme', 'dark');
  };

  const isDark = theme === 'dark';

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme, isDark]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
