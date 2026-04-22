import React from 'react';
import { GoalCards } from './components/ordering/GoalCards';
import { ProductScanner } from './components/ordering/ProductScanner';
import { ContentType } from './components/ordering/ContentType';
import { BudgetSection } from './components/ordering/BudgetSection';
import { BriefEditor } from './components/ordering/BriefEditor';
import { ScriptPreview } from './components/ordering/ScriptPreview';
import { Checkout } from './components/ordering/Checkout';
import { WalletCard } from './components/ordering/WalletCard';
import { RepeatBanner } from './components/ordering/RepeatBanner';
import { SuccessModal } from './components/ordering/SuccessModal';
import { Intelligence } from './components/ordering/Intelligence';

export type ComponentRenderer = React.FC<{ props: Record<string, unknown>; context: Record<string, unknown> }>;

export const componentRegistry: Record<string, ComponentRenderer> = {
  'goal-cards': GoalCards,
  'product-scanner': ProductScanner,
  'content-type': ContentType,
  'budget-section': BudgetSection,
  'brief-editor': BriefEditor,
  'script-preview': ScriptPreview,
  'checkout': Checkout,
  'wallet-card': WalletCard,
  'repeat-banner': RepeatBanner,
  'success-modal': SuccessModal,
  'intelligence': Intelligence,
};

export function renderComponent(name: string, props: Record<string, unknown>, context: Record<string, unknown>): React.ReactElement | null {
  const Component = componentRegistry[name];
  if (!Component) return null;
  return <Component props={props} context={context} />;
}
