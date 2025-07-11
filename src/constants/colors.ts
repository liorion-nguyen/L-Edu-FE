// Elegant Light Color Constants - Sophisticated and refined light palette
export const COLORS = {
  // Primary palette - Soft sage green
  primary: {
    50: '#F8FBF8',
    100: '#F0F7F0',
    200: '#E1EFE1',
    300: '#C8E0C8',
    400: '#A8CFA8',
    500: '#7FB67F',    // Main primary - soft sage
    600: '#6BA06B',    // Primary dark
    700: '#578A57',
    800: '#457345',
    900: '#365D36',
  },

  // Accent palette - Warm beige
  accent: {
    50: '#FDFCFA',
    100: '#FAF8F3',
    200: '#F4F0E6',
    300: '#EDE5D4',
    400: '#E3D4BB',
    500: '#D4C5A0',    // Main accent - warm beige
    600: '#C5B287',
    700: '#B49E6E',
    800: '#A08A55',
    900: '#8B7640',
  },

  // Neutral palette - Soft grays with warmth
  neutral: {
    50: '#FBFBFB',
    100: '#F7F7F7',
    200: '#F0F0F0',
    300: '#E8E8E8',
    400: '#DBDBDB',
    500: '#B8B8B8',
    600: '#9A9A9A',
    700: '#6B6B6B',
    800: '#4A4A4A',
    900: '#2D2D2D',
  },

  // Background colors - Very light and airy
  background: {
    primary: '#FFFFFF',
    secondary: '#FBFBFB',
    tertiary: '#F7F7F7',
    elevated: '#FFFFFF',
    overlay: 'rgba(255, 255, 255, 0.95)',
    overlayDark: 'rgba(0, 0, 0, 0.1)',
  },

  // Text colors - Soft and readable
  text: {
    primary: '#4A4A4A',
    secondary: '#6B6B6B',
    muted: '#9A9A9A',
    inverse: '#FFFFFF',
    heading: '#2D2D2D',
    description: '#6B6B6B',
  },

  // Border colors - Very subtle
  border: {
    light: 'rgba(232, 232, 232, 0.8)',
    medium: 'rgba(219, 219, 219, 0.9)',
    strong: 'rgba(184, 184, 184, 1)',
    focus: 'rgba(127, 182, 127, 0.3)',
    accent: 'rgba(212, 197, 160, 0.3)',
  },

  // Status colors - Muted and soft
  status: {
    success: '#7FB67F',
    successLight: '#A8CFA8',
    successDark: '#6BA06B',
    warning: '#E3D4BB',
    warningLight: '#EDE5D4',
    warningDark: '#D4C5A0',
    error: '#D4A5A5',
    errorLight: '#E0B8B8',
    errorDark: '#C49292',
    info: '#B8D4E3',
    infoLight: '#CBE0ED',
    infoDark: '#A5C4D4',
  },

  // Gradients - Very subtle and light
  gradient: {
    primary: 'linear-gradient(135deg, #F8FBF8 0%, #F0F7F0 100%)',
    accent: 'linear-gradient(135deg, #FDFCFA 0%, #FAF8F3 100%)',
    neutral: 'linear-gradient(135deg, #FBFBFB 0%, #F7F7F7 100%)',
    subtle: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%)',
  },
};

// Common border radius values
export const RADIUS = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

// Spacing values
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '96px',
};

export default COLORS; 