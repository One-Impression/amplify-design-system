import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Footer } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/Footer',
  component: Footer,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'select', options: [3, 4, 5] },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Twitter = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M22 5.8c-.7.3-1.5.6-2.4.7.9-.5 1.5-1.4 1.8-2.4-.8.5-1.7.8-2.7 1A4.2 4.2 0 0011.6 9c-3.5-.2-6.6-1.9-8.7-4.5-.4.7-.6 1.5-.6 2.3 0 1.5.7 2.7 1.9 3.5-.7 0-1.4-.2-2-.5v.1c0 2 1.4 3.7 3.4 4.1-.7.2-1.4.2-2.1.1.6 1.7 2.2 3 4.1 3a8.4 8.4 0 01-6.2 1.7A12 12 0 008 21c8 0 12.4-6.6 12.4-12.4l-.0-.6A8.7 8.7 0 0022 5.8z" />
  </svg>
);
const LinkedIn = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 5 3.87 6 2.5 6 1.13 6 0 5 0 3.5 0 2 1.13 1 2.5 1c1.4 0 2.48 1 2.48 2.5zM.2 8h4.6V23H.2V8zm7.6 0H12v2c.6-1 2-2.2 4.2-2.2 4.5 0 5.3 3 5.3 6.8V23h-4.6v-7.4c0-1.8 0-4-2.5-4s-2.9 1.9-2.9 3.9V23H7.8V8z" />
  </svg>
);
const YouTube = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M23 7s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C16.3 3.4 12 3.4 12 3.4s-4.3 0-7.8.3c-.5.1-1.4.1-2.3 1C1.2 5.4 1 7 1 7s-.2 1.9-.2 3.7v1.6C.8 14 1 16 1 16s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8 .3 8 .3s4.3 0 7.8-.3c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.7v-1.6C23.2 8.9 23 7 23 7zM9.7 14.4V8.6L15.7 11.5l-6 2.9z" />
  </svg>
);

const SocialLink = ({ children, label, href }: { children: React.ReactNode; label: string; href: string }) => (
  <a
    href={href}
    aria-label={label}
    style={{ color: 'inherit', display: 'inline-flex' }}
    className="hover:text-[var(--amp-semantic-text-accent)] transition-colors"
  >
    {children}
  </a>
);

const Wordmark = () => (
  <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>Amplify</span>
);

export const FullFooter: Story = {
  args: {
    columns: 5,
    children: (
      <>
        <Footer.Brand
          logo={<Wordmark />}
          tagline="The operating system for creator marketing."
        >
          <Footer.Social>
            <SocialLink href="#" label="Twitter"><Twitter /></SocialLink>
            <SocialLink href="#" label="LinkedIn"><LinkedIn /></SocialLink>
            <SocialLink href="#" label="YouTube"><YouTube /></SocialLink>
          </Footer.Social>
        </Footer.Brand>

        <Footer.LinkColumn title="Product">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Integrations</a>
          <a href="#">Changelog</a>
        </Footer.LinkColumn>

        <Footer.LinkColumn title="Company">
          <a href="#">About</a>
          <a href="#">Customers</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
        </Footer.LinkColumn>

        <Footer.LinkColumn title="Resources">
          <a href="#">Blog</a>
          <a href="#">Docs</a>
          <a href="#">Help center</a>
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
      </>
    ),
  },
};

export const FourColumn: Story = {
  args: {
    columns: 4,
    children: (
      <>
        <Footer.Brand logo={<Wordmark />} tagline="Run influencer campaigns at scale." />
        <Footer.LinkColumn title="Product">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
        </Footer.LinkColumn>
        <Footer.LinkColumn title="Company">
          <a href="#">About</a>
          <a href="#">Careers</a>
        </Footer.LinkColumn>
        <Footer.LinkColumn title="Legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </Footer.LinkColumn>
        <Footer.Legal copyright="© 2026 Amplify, Inc." />
      </>
    ),
  },
};

export const MinimalFooter: Story = {
  args: {
    columns: 3,
    children: (
      <>
        <Footer.Brand logo={<Wordmark />} />
        <Footer.LinkColumn title="Links">
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
        </Footer.LinkColumn>
        <Footer.Social>
          <SocialLink href="#" label="Twitter"><Twitter /></SocialLink>
          <SocialLink href="#" label="LinkedIn"><LinkedIn /></SocialLink>
        </Footer.Social>
        <Footer.Legal copyright="© 2026 Amplify, Inc." />
      </>
    ),
  },
};
