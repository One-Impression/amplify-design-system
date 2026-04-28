import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const amplifyTheme = create({
  base: 'dark',
  brandTitle: 'Amplify Canvas Design System',
  brandUrl: 'https://canvas.amplify.club',
  colorPrimary: '#6531FF',
  colorSecondary: '#6531FF',
  appBg: '#0a0a0a',
  appContentBg: '#111111',
  appBorderColor: '#222222',
  textColor: '#ffffff',
  textInverseColor: '#0a0a0a',
  barTextColor: '#999999',
  barSelectedColor: '#6531FF',
  barBg: '#111111',
});

addons.setConfig({
  theme: amplifyTheme,
});
