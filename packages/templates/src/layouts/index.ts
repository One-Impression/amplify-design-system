import React from 'react';
import type { TemplateConfig } from '../render';
import { StepperLayout } from './StepperLayout';
import { ScrollLayout } from './ScrollLayout';

export interface LayoutComponent extends React.FC<{ config: TemplateConfig; context: Record<string, unknown> }> {
  getCSS?: () => string;
}

export const layoutRegistry: Record<string, LayoutComponent> = {
  stepper: StepperLayout,
  scroll: ScrollLayout,
};
