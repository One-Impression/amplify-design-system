/** Mock tokens for testing — mirrors @amplify-ai/tokens-creator/react-native */
export const sdui = {
  color: {
    neutralStrong: '#1C1917',
    neutralMedium: '#78716C',
    neutralWeak: '#D6D3D1',
    neutralSubtle: '#E7E5E4',
    neutralInverse: '#FFFFFF',
    primary: '#7C3AED',
    primaryWeak: '#EDE9FE',
    positive: '#16A34A',
    positiveWeak: '#E3F6EC',
    notice: '#D97706',
    noticeWeak: '#FFF3E1',
    negative: '#DC2626',
    negativeWeak: '#FFEBEF',
    offsetStrong: '#E7E5E4',
    offsetMedium: '#F1F6FE',
    offsetWeak: '#F6FAFF',
    transparent: 'transparent',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 },
  fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  iconSize: { sm: 16, md: 20, lg: 24, xl: 32 },
  radius: { none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  borderWidth: { none: 0, thin: 1, medium: 2, thick: 4 },
  component: {
    button: {
      heightSm: 32,
      heightMd: 40,
      heightLg: 48,
      paddingXSm: 12,
      paddingXMd: 16,
      paddingXLg: 20,
      radius: 8,
      fontSizeSm: 12,
      fontSizeMd: 14,
      fontSizeLg: 16,
    },
  },
};

export const colors = { ...sdui.color };
export const fontSize = { ...sdui.fontSize };
export const spacing = { ...sdui.spacing };
