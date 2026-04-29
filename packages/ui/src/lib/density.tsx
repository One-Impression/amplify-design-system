'use client';

import React, { createContext, useContext } from 'react';

/**
 * Density mode for Canvas components.
 *
 * - `compact`: dense tables, ops dashboards, power-user surfaces.
 *              Subtracts ~1px height per size step from comfortable.
 * - `comfortable`: default. Matches v1.0 sizing — backwards compatible.
 * - `spacious`: marketing pages, onboarding, mobile-touch surfaces.
 *               Adds ~1px height per size step.
 *
 * Components that opt in to density (Button, IconButton, Input, Select,
 * Textarea, Chip) consume this via `useDensity()` and pick the
 * density-appropriate row of their size table.
 *
 * Components that don't opt in (Card, Dialog, Badge layout) ignore density
 * entirely — they're already density-neutral.
 */
export type Density = 'compact' | 'comfortable' | 'spacious';

const DensityContext = createContext<Density>('comfortable');

export interface DensityProviderProps {
  density: Density;
  children: React.ReactNode;
}

/**
 * Wrap a subtree to set its density. Nesting is supported — inner provider
 * wins. To override on a single component, prefer the component's
 * `density` prop (where supported).
 *
 * @example
 * <DensityProvider density="compact">
 *   <CampaignsTable />
 * </DensityProvider>
 */
export const DensityProvider: React.FC<DensityProviderProps> = ({ density, children }) => {
  return <DensityContext.Provider value={density}>{children}</DensityContext.Provider>;
};

/**
 * Read the current density from context. Returns `'comfortable'` if no
 * provider is in scope (backwards-compatible default).
 */
export const useDensity = (): Density => useContext(DensityContext);
