/**
 * Recipes — small compositions of @amplify-ai/ui primitives.
 *
 * A recipe is a thin wrapper that combines 2–4 primitives into a
 * higher-level pattern. Recipes contain minimal new logic; they are
 * shape + slot composition, not new behaviour. See ./README.md.
 */

export { SearchCombobox } from './SearchCombobox';
export type { SearchComboboxProps, SearchComboboxOption } from './SearchCombobox';

export { ActionCard } from './ActionCard';
export type { ActionCardProps } from './ActionCard';

export { StepHeader } from './StepHeader';
export type { StepHeaderProps } from './StepHeader';

export { MetricGrid } from './MetricGrid';
export type { MetricGridProps } from './MetricGrid';

export { AlertBanner } from './AlertBanner';
export type { AlertBannerProps, AlertBannerTone } from './AlertBanner';
