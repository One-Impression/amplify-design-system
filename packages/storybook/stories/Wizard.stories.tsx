import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Wizard, type WizardStep } from '@amplify-ai/ui';

const meta = {
  title: 'Components/Forms/Wizard',
  component: Wizard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseSteps: WizardStep[] = [
  {
    id: 'brand',
    label: 'Brand',
    heading: 'Tell us about your brand',
    description: 'We use this to personalise the campaign brief.',
    body: <input placeholder="Brand name" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />,
  },
  {
    id: 'goals',
    label: 'Goals',
    heading: 'What are your goals?',
    description: 'Pick everything that applies.',
    body: <div>Awareness · Conversions · Retention</div>,
  },
  {
    id: 'budget',
    label: 'Budget',
    heading: 'Set a budget',
    body: <div>Slide to choose ₹50k – ₹50L</div>,
    skippable: true,
    optional: true,
  },
  {
    id: 'review',
    label: 'Review',
    heading: 'Review & launch',
    body: <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8 }}>Everything looks good!</div>,
  },
];

export const Linear: Story = {
  args: { steps: baseSteps },
};

export const NonLinear: Story = {
  args: { steps: baseSteps, variant: 'non-linear' },
};

export const Vertical: Story = {
  args: { steps: baseSteps, orientation: 'vertical' },
};

export const WithSkip: Story = {
  args: {
    steps: baseSteps.map((s, i) => (i === 1 ? { ...s, skippable: true } : s)),
  },
};

export const WithValidation: Story = {
  render: (args) => {
    const [name, setName] = useState('');
    const steps: WizardStep[] = [
      {
        id: 'name',
        label: 'Your name',
        heading: 'What should we call you?',
        body: (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type at least 3 characters"
            style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
          />
        ),
        validate: () => name.trim().length >= 3,
      },
      ...baseSteps.slice(1),
    ];
    return <Wizard {...args} steps={steps} />;
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [step, setStep] = useState(0);
    return (
      <div>
        <div style={{ marginBottom: 12, fontFamily: 'monospace' }}>activeStep = {step}</div>
        <Wizard {...args} steps={baseSteps} activeStep={step} onStepChange={setStep} />
      </div>
    );
  },
};

export const WithCancel: Story = {
  args: {
    steps: baseSteps,
    onCancel: () => alert('cancelled'),
    onComplete: () => alert('finished!'),
  },
};

export const TwoSteps: Story = {
  args: {
    steps: baseSteps.slice(0, 2),
  },
};
