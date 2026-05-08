import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PhaseRibbon, type PhaseItem } from './PhaseRibbon';

const meta = {
  title: 'Studio v2/PhaseRibbon',
  component: PhaseRibbon,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    status: { type: 'beta' },
  },
} satisfies Meta<typeof PhaseRibbon>;

export default meta;
type Story = StoryObj<typeof meta>;

const flow: PhaseItem[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'design', label: 'Design' },
  { id: 'build', label: 'Build' },
  { id: 'ship', label: 'Ship' },
];

export const Default: Story = {
  args: {
    phases: flow,
    current: 'design',
  },
};

export const FirstPhase: Story = {
  args: {
    phases: flow,
    current: 'discover',
  },
};

export const Mid: Story = {
  args: {
    phases: flow,
    current: 'build',
  },
};

export const LastPhase: Story = {
  args: {
    phases: flow,
    current: 'ship',
  },
};

export const WithError: Story = {
  args: {
    phases: [
      { id: 'discover', label: 'Discover', status: 'done' },
      { id: 'design', label: 'Design', status: 'error', hint: 'Validation failed' },
      { id: 'build', label: 'Build', status: 'pending' },
      { id: 'ship', label: 'Ship', status: 'pending' },
    ],
    current: 'design',
  },
};

export const WithHints: Story = {
  args: {
    phases: [
      { id: 'discover', label: 'Discover', hint: 'Gather context and intent' },
      { id: 'design', label: 'Design', hint: 'Sketch and pick a direction' },
      { id: 'build', label: 'Build', hint: 'Compose components and wire data' },
      { id: 'ship', label: 'Ship', hint: 'Push to production' },
    ],
    current: 'design',
  },
};

export const NumericIds: Story = {
  args: {
    phases: [
      { id: 1, label: 'Step One' },
      { id: 2, label: 'Step Two' },
      { id: 3, label: 'Step Three' },
    ],
    current: 2,
  },
};

export const SinglePhase: Story = {
  args: {
    phases: [{ id: 'only', label: 'Only step' }],
    current: 'only',
  },
};

export const Long: Story = {
  args: {
    phases: [
      { id: 'a', label: 'Brief' },
      { id: 'b', label: 'Audience' },
      { id: 'c', label: 'Scripts' },
      { id: 'd', label: 'Variants' },
      { id: 'e', label: 'Council' },
      { id: 'f', label: 'Pick' },
      { id: 'g', label: 'Ship' },
    ],
    current: 'd',
  },
};
