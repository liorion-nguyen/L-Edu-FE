import { theme } from 'antd';
import { COLORS } from './constants/colors';

const { darkAlgorithm, defaultAlgorithm } = theme;

// Get current theme from document attribute or system preference
const getCurrentTheme = (): 'light' | 'dark' => {
  const themeAttr = document.documentElement.getAttribute('data-theme');
  if (themeAttr === 'dark' || themeAttr === 'light') {
    return themeAttr;
  }
  // Fallback to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getAntdTheme = (themeMode?: 'light' | 'dark') => {
  const currentTheme = themeMode || getCurrentTheme();
  return {
  algorithm: currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm,
  token: {
    // Primary colors - Notion-inspired blue
    colorPrimary: '#2383e2',
    colorPrimaryActive: '#1a6bc7',
    colorPrimaryHover: '#2d8ef0',
    colorPrimaryBorder: '#2383e2',
    colorPrimaryText: '#2383e2',
    colorPrimaryTextHover: '#2d8ef0',
    colorPrimaryTextActive: '#1a6bc7',
    
    // Success colors
    colorSuccess: COLORS.status.success,
    colorSuccessActive: COLORS.status.successDark,
    colorSuccessHover: COLORS.status.successLight,
    colorSuccessBorder: COLORS.status.success,
    colorSuccessText: COLORS.status.successDark,
    colorSuccessTextHover: COLORS.status.success,
    colorSuccessTextActive: COLORS.status.successDark,
    
    // Warning colors
    colorWarning: COLORS.status.warning,
    colorWarningActive: COLORS.status.warningDark,
    colorWarningHover: COLORS.status.warningLight,
    colorWarningBorder: COLORS.status.warning,
    colorWarningText: COLORS.status.warningDark,
    colorWarningTextHover: COLORS.status.warning,
    colorWarningTextActive: COLORS.status.warningDark,
    
    // Error colors
    colorError: COLORS.status.error,
    colorErrorActive: COLORS.status.errorDark,
    colorErrorHover: COLORS.status.errorLight,
    colorErrorBorder: COLORS.status.error,
    colorErrorText: COLORS.status.errorDark,
    colorErrorTextHover: COLORS.status.error,
    colorErrorTextActive: COLORS.status.errorDark,
    
    // Info colors
    colorInfo: COLORS.status.info,
    colorInfoActive: COLORS.status.infoDark,
    colorInfoHover: COLORS.status.infoLight,
    colorInfoBorder: COLORS.status.info,
    colorInfoText: COLORS.status.infoDark,
    colorInfoTextHover: COLORS.status.info,
    colorInfoTextActive: COLORS.status.infoDark,
    
    // Neutral colors
    colorText: COLORS.text.primary,
    colorTextSecondary: COLORS.text.secondary,
    colorTextTertiary: COLORS.text.muted,
    colorTextQuaternary: COLORS.text.muted,
    colorTextHeading: COLORS.text.heading,
    colorTextDescription: COLORS.text.description,
    colorTextPlaceholder: COLORS.text.muted,
    colorTextDisabled: COLORS.text.muted,
    
    // Background colors
    colorBgContainer: COLORS.background.primary,
    colorBgElevated: COLORS.background.elevated,
    colorBgLayout: COLORS.background.secondary,
    colorBgSpotlight: COLORS.background.primary,
    colorBgMask: COLORS.background.overlayDark,
    
    // Border colors
    colorBorder: COLORS.border.light,
    colorBorderSecondary: COLORS.border.light,
    
    // Component specific
    colorFillAlter: COLORS.background.secondary,
    colorFillContent: COLORS.background.tertiary,
    colorFillContentHover: COLORS.background.secondary,
    colorFillSecondary: COLORS.background.secondary,
    colorFillTertiary: COLORS.background.tertiary,
    colorFillQuaternary: COLORS.background.primary,
    
    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusOuter: 4,
    borderRadiusSM: 6,
    borderRadiusXS: 2,
    
    // Font settings
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 48,
    fontSizeHeading2: 32,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Line height
    lineHeight: 1.5,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.3,
    lineHeightHeading3: 1.4,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    lineHeightLG: 1.5,
    lineHeightSM: 1.5,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    // Motion settings (all disabled for no animations)
    motionDurationFast: '0s',
    motionDurationMid: '0s',
    motionDurationSlow: '0s',
    motionEaseInBack: 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
    motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
    motionEaseOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
    motionUnit: 0, // Disable motion unit
    
    // Disable all box shadows
    boxShadow: 'none',
    boxShadowSecondary: 'none',
    boxShadowTertiary: 'none',
  },
  components: {
    Button: {
      colorPrimary: '#2383e2',
      colorPrimaryHover: '#2d8ef0',
      colorPrimaryActive: '#1a6bc7',
      borderRadius: 6,
      boxShadow: 'none',
      boxShadowSecondary: 'none',
    },
    Card: {
      colorBgContainer: COLORS.background.primary,
      colorBorderSecondary: COLORS.border.light,
      borderRadius: 8,
      boxShadow: 'none',
      boxShadowTertiary: 'none',
    },
    Input: {
      colorBgContainer: COLORS.background.primary,
      colorBorder: COLORS.border.light,
      colorPrimary: '#2383e2',
      borderRadius: 6,
      boxShadow: 'none',
    },
    Modal: {
      colorBgElevated: COLORS.background.elevated,
      colorBgMask: COLORS.background.overlayDark,
      borderRadius: 12,
      boxShadow: 'none',
    },
    Notification: {
      colorBgElevated: COLORS.background.elevated,
      colorBorder: COLORS.border.light,
      borderRadius: 8,
      boxShadow: 'none',
    },
    Tooltip: {
      colorBgSpotlight: COLORS.background.elevated,
      colorTextLightSolid: COLORS.text.primary,
      borderRadius: 6,
      boxShadow: 'none',
    },
    Dropdown: {
      colorBgElevated: COLORS.background.elevated,
      colorBorder: COLORS.border.light,
      borderRadius: 8,
      boxShadow: 'none',
    },
  },
  };
};

export default getAntdTheme;
