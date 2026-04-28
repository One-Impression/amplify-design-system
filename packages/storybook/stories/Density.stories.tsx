import type { Meta, StoryObj } from '@storybook/react';
import { Button, DensityProvider, type Density } from '@one-impression/ui';

const meta = {
  title: 'Foundation/Density',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Density mode lets a subtree opt into **compact**, **comfortable** (default),
or **spacious** sizing. Components that opt in (Button initially; Input,
Select, Chip, etc. follow) read the ambient density via \`useDensity()\`
and select the density-appropriate row from their size table.

\`\`\`tsx
import { DensityProvider, Button } from '@one-impression/ui';

<DensityProvider density="compact">
  <Button size="sm">Save</Button>     {/* renders h-7 */}
</DensityProvider>
\`\`\`

**Use cases:**
- \`compact\` — dense data tables, ops dashboards (Atmosphere)
- \`comfortable\` — default, all v1.0 sizing (Atmosphere main flows, Brand)
- \`spacious\` — onboarding, marketing, mobile-touch surfaces (Brand landing)
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const densities: Density[] = ['compact', 'comfortable', 'spacious'];

const ThreeDensities: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-6">
    {densities.map((d) => (
      <div key={d} className="border border-border rounded-md p-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">density="{d}"</h3>
        <DensityProvider density={d}>
          <div className="flex items-center gap-3">{children}</div>
        </DensityProvider>
      </div>
    ))}
  </div>
);

export const Buttons_AllSizes: Story = {
  render: () => (
    <ThreeDensities>
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD (default)</Button>
      <Button size="lg">LG</Button>
    </ThreeDensities>
  ),
};

export const Atmosphere_DenseTable_AT2_Fix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Atmosphere PR-AT2 flagged a 1px regression in dense data tables: Atmosphere\'s legacy Button rendered `h-7` for `size="sm"` but Canvas v1.0 \'s `sm` is `h-8`. With `<DensityProvider density="compact">`, Canvas\'s `sm` renders `h-7` — restoring the dense table layout structurally.',
      },
    },
  },
  render: () => (
    <DensityProvider density="compact">
      <table className="text-sm border border-border rounded-md">
        <thead>
          <tr className="bg-surface-overlay">
            <th className="px-3 py-2 text-left">Campaign</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {['Acme Q1', 'Acme Q2', 'Beta launch'].map((row) => (
            <tr key={row} className="border-t border-border">
              <td className="px-3 py-2">{row}</td>
              <td className="px-3 py-2">Active</td>
              <td className="px-3 py-2">
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DensityProvider>
  ),
};

export const SpaciousMobileTouchTarget: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'For mobile-touch surfaces (Brand landing, Creator onboarding), `density="spacious"` enlarges hit targets without changing the prop API. `size="md"` becomes `h-11` instead of `h-10`.',
      },
    },
  },
  render: () => (
    <DensityProvider density="spacious">
      <div className="flex flex-col gap-3 max-w-xs">
        <Button size="md" variant="primary">
          Get started
        </Button>
        <Button size="md" variant="outline">
          Learn more
        </Button>
      </div>
    </DensityProvider>
  ),
};

export const PerComponentOverride: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Component-level `density` prop overrides the ambient provider. Useful for one-off exceptions inside a wrapped subtree.',
      },
    },
  },
  render: () => (
    <DensityProvider density="compact">
      <div className="flex items-center gap-3">
        <Button size="md">Inherits compact (h-8)</Button>
        <Button size="md" density="spacious">
          Override spacious (h-11)
        </Button>
      </div>
    </DensityProvider>
  ),
};
