import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Hero,
  CaseStudyCard,
  Marquee,
  IconGrid,
  IconCallout,
  FAQ,
  Footer,
  MediaShowcase,
  Section,
  Button,
} from '@amplify-ai/ui';

/**
 * Marketing-page composition — shows how the new primitives plug together
 * to form a full landing page. Use this as the design / a11y reference when
 * adopting the components in product marketing pages.
 */
const meta = {
  title: 'Marketing/Marketing Page',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'End-to-end marketing-page composition built from the Wave 6 primitives: CaseStudyCard, Marquee, IconCallout/IconGrid, FAQ, Footer, MediaShowcase.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const Bolt = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 11-12h-7l0-8z" />
  </svg>
);
const Shield = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
  </svg>
);
const Globe = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M2 12h20M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10c-2.5-3-4-6.5-4-10s1.5-7 4-10z" />
  </svg>
);

const brands = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Massive Dynamic', 'Cyberdyne'];
const brandPill = (label: string) => (
  <div
    key={label}
    style={{
      padding: '8px 24px',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 1,
      color: 'var(--amp-semantic-text-secondary)',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

export const FullPage: Story = {
  render: () => (
    <div style={{ background: 'var(--amp-semantic-bg-default, #fff)' }}>
      {/* Hero */}
      <Hero
        variant="centered"
        eyebrow="New"
        headline="Run influencer campaigns at scale"
        description="Amplify is the operating system for performance creator marketing — from discovery to delivery, in one workflow."
        primaryCta={<Button variant="primary">Get started</Button>}
        secondaryCta={<Button variant="ghost">Watch the demo</Button>}
      />

      {/* Trusted-by Marquee */}
      <Section variant="muted">
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: 'var(--amp-semantic-text-secondary)',
            marginBottom: 16,
          }}
        >
          Trusted by teams at
        </p>
        <Marquee direction="left" speed="slow" gap={48}>
          {brands.map(brandPill)}
        </Marquee>
      </Section>

      {/* MediaShowcase */}
      <Section>
        <MediaShowcase
          aspect="21/9"
          media={{
            type: 'image',
            src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80&auto=format&fit=crop',
            alt: 'Team collaborating',
          }}
          eyebrow="Featured story"
          headline="How Acme tripled their ROAS in 30 days"
          description="A short look at how the Acme growth team rebuilt their creator program on Amplify."
          cta={<Button variant="primary">Watch the story</Button>}
        />
      </Section>

      {/* IconGrid features */}
      <Section>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 32, color: 'var(--amp-semantic-text-primary)' }}>
          Built for serious marketing teams
        </h2>
        <IconGrid columns={3} gap="comfortable">
          <IconCallout
            icon={<Bolt />}
            title="Lightning fast"
            description="Sub-second matching, briefs and approvals."
          />
          <IconCallout
            icon={<Shield />}
            title="Enterprise security"
            description="SOC 2 Type II, SAML SSO, audit trail."
          />
          <IconCallout
            icon={<Globe />}
            title="Global by default"
            description="Multi-region, multi-currency in one workflow."
          />
        </IconGrid>
      </Section>

      {/* CaseStudyCards */}
      <Section variant="muted">
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 32, color: 'var(--amp-semantic-text-primary)' }}>
          Customers who win with Amplify
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          <CaseStudyCard
            customerLogo={<span style={{ fontWeight: 800, letterSpacing: 1 }}>ACME</span>}
            quote="Amplify shipped what would have taken our team six months in just three weeks."
            stats={[
              { value: '3.2x', label: 'ROAS' },
              { value: '+87%', label: 'Conversion' },
              { value: '12d', label: 'Time to launch' },
            ]}
            customerName="Priya Sharma"
            customerRole="VP Marketing, Acme"
            cta={<Button variant="ghost">Read story →</Button>}
          />
          <CaseStudyCard
            variant="featured"
            customerLogo={<span style={{ fontWeight: 800, letterSpacing: 1 }}>GLOBEX</span>}
            quote="Switching to Amplify was the single highest-leverage decision of the year."
            stats={[
              { value: '$1.2M', label: 'New revenue' },
              { value: '14x', label: 'Faster' },
            ]}
            customerName="Rohan Mehta"
            customerRole="CMO, Globex"
            cta={<Button variant="ghost">Read story →</Button>}
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <FAQ
            title="Frequently asked questions"
            items={[
              {
                id: 'what',
                question: 'What is Amplify?',
                answer:
                  'An end-to-end creator marketing platform — discovery, briefs, contracts, content review, payouts, and ROAS reporting in one workflow.',
              },
              {
                id: 'pricing',
                question: 'How does pricing work?',
                answer: 'Plans start free and scale based on the number of campaigns and creators per month.',
              },
              {
                id: 'support',
                question: 'Do you offer support?',
                answer: 'Yes — every plan includes email support, and growth plans add a dedicated success manager.',
              },
              {
                id: 'security',
                question: 'How is my data handled?',
                answer:
                  'SOC 2 Type II certified. Data is encrypted at rest and in transit, and never used to train third-party models without explicit opt-in.',
              },
            ]}
          />
        </div>
      </Section>

      {/* Footer */}
      <Footer columns={5}>
        <Footer.Brand
          logo={<span style={{ fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>Amplify</span>}
          tagline="The operating system for creator marketing."
        />
        <Footer.LinkColumn title="Product">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Integrations</a>
        </Footer.LinkColumn>
        <Footer.LinkColumn title="Company">
          <a href="#">About</a>
          <a href="#">Customers</a>
          <a href="#">Careers</a>
        </Footer.LinkColumn>
        <Footer.LinkColumn title="Resources">
          <a href="#">Blog</a>
          <a href="#">Docs</a>
          <a href="#">Status</a>
        </Footer.LinkColumn>
        <Footer.Newsletter
          title="Stay in the loop"
          description="Monthly product updates. No spam."
          buttonLabel="Subscribe"
        />
        <Footer.Legal copyright="© 2026 Amplify, Inc.">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </Footer.Legal>
      </Footer>
    </div>
  ),
};
