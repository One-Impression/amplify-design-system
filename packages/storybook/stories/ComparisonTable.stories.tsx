import type { Meta, StoryObj } from '@storybook/react';
import { ComparisonTable, type ComparisonRow, type ComparisonPlan } from '@amplify/ui';

const meta = {
  title: 'Marketing/ComparisonTable',
  component: ComparisonTable,
  tags: ['autodocs'],
} satisfies Meta<typeof ComparisonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const plans: ComparisonPlan[] = [
  { name: 'Starter' },
  { name: 'Pro', highlighted: true, subLabel: 'Most popular' },
  { name: 'Enterprise' },
];

const rows: ComparisonRow[] = [
  { feature: 'Active campaigns', values: ['5', 'Unlimited', 'Unlimited'] },
  { feature: 'Creator matches / month', values: ['100', '1,000', 'Unlimited'] },
  { feature: 'Priority support', values: [false, true, true] },
  { feature: 'Custom integrations', values: [false, true, true] },
  { feature: 'SSO', values: [false, false, true] },
  { feature: 'Dedicated CSM', values: [false, false, true] },
];

export const Default: Story = { args: { plans, rows } };

export const TwoPlans: Story = {
  args: {
    plans: plans.slice(0, 2),
    rows: rows.map((r) => ({ ...r, values: r.values.slice(0, 2) })),
  },
};

export const WithCategories: Story = {
  args: {
    plans,
    rows: [
      { category: 'Volume', feature: 'Active campaigns', values: ['5', 'Unlimited', 'Unlimited'] },
      { category: 'Volume', feature: 'Creator matches', values: ['100', '1,000', 'Unlimited'] },
      { category: 'Support', feature: 'Email support', values: [true, true, true] },
      { category: 'Support', feature: 'Priority support', values: [false, true, true] },
      { category: 'Support', feature: 'Dedicated CSM', values: [false, false, true] },
      { category: 'Security', feature: 'SSO', values: [false, false, true] },
      { category: 'Security', feature: 'Audit logs', values: [false, true, true] },
    ],
  },
};

export const WithCaption: Story = {
  args: {
    plans,
    rows,
    caption: 'Compare all plan features side-by-side.',
  },
};

export const NoHighlight: Story = {
  args: { plans: plans.map((p) => ({ ...p, highlighted: false, subLabel: undefined })), rows },
};

export const FourPlans: Story = {
  args: {
    plans: [...plans, { name: 'Custom' }],
    rows: rows.map((r) => ({ ...r, values: [...r.values, 'Tailored'] })),
  },
};
