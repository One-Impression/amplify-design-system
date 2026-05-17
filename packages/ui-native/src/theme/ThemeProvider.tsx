import React, { createContext, useContext } from 'react';
import { sdui } from '@amplify-ai/tokens-creator/react-native';

type SduiTokens = typeof sdui;

const ThemeContext = createContext<SduiTokens>(sdui);

export interface ThemeProviderProps {
  /** Override tokens — deep-merged with defaults from tokens-creator. */
  tokens?: Partial<SduiTokens>;
  children: React.ReactNode;
}

/**
 * Provides SDUI tokens to the component tree. Optional — components
 * fall back to the default sdui export from tokens-creator when no
 * provider is present.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ tokens: overrides, children }) => {
  const value = overrides
    ? {
        color: { ...sdui.color, ...overrides.color },
        spacing: { ...sdui.spacing, ...overrides.spacing },
        fontSize: { ...sdui.fontSize, ...overrides.fontSize },
        fontWeight: { ...sdui.fontWeight, ...overrides.fontWeight },
        iconSize: { ...sdui.iconSize, ...overrides.iconSize },
        radius: { ...sdui.radius, ...overrides.radius },
        borderWidth: { ...sdui.borderWidth, ...overrides.borderWidth },
        component: {
          button: { ...sdui.component.button, ...overrides.component?.button },
        },
      }
    : sdui;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/** Read current SDUI tokens from context. Falls back to default tokens. */
export const useTheme = (): SduiTokens => useContext(ThemeContext);
