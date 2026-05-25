import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  // DTS generated separately via tsc — react-native JSX types conflict
  // with @types/react@19 in the monorepo root, and tsup's rollup-plugin-dts
  // doesn't honor skipLibCheck. tsc respects tsconfig.json's skipLibCheck.
  dts: false,
  external: ['react', 'react-native', '@one-impression/tokens-creator'],
  clean: true,
});
