import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/* ---------------------------------------------------------------------------
 * SnippetDoc — helper component that renders an SDUI snippet's JSON contract
 * with its type name and description. No actual RN renderer needed.
 * --------------------------------------------------------------------------- */

interface SnippetDocProps {
  type: string;
  description: string;
  json: Record<string, unknown>;
}

const SnippetDoc: React.FC<SnippetDocProps> = ({ type, description, json }) => (
  <div style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 720 }}>
    <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 600 }}>
      <code style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: 4, fontSize: 18 }}>
        {type}
      </code>
    </h2>
    <p style={{ margin: '0 0 16px', color: '#555', fontSize: 14, lineHeight: 1.5 }}>
      {description}
    </p>
    <pre
      style={{
        background: '#1e1e2e',
        color: '#cdd6f4',
        padding: 20,
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.6,
        overflow: 'auto',
        maxHeight: 600,
      }}
    >
      {JSON.stringify(json, null, 2)}
    </pre>
  </div>
);

/* ---------------------------------------------------------------------------
 * Storybook meta
 * --------------------------------------------------------------------------- */

const meta = {
  title: 'SDUI/Snippets',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------------------
 * Stories — one per snippet type, realistic JSON examples
 * --------------------------------------------------------------------------- */

export const PageHeader: Story = {
  render: () => (
    <SnippetDoc
      type="pageHeaderSnippet"
      description="Top-of-page header with title, subtitle, left/right icons, and an optional right button. Used as the primary navigation header."
      json={{
        type: 'pageHeaderSnippet',
        data: {
          title: { text: 'Campaign Details', color: '#1A1A1A', fontSize: 18, fontWeight: '600' },
          subtitle: { text: 'Fashion Week 2026', color: '#888888', fontSize: 13 },
          leftIcon: { name: 'arrow-left', size: 24, color: '#1A1A1A' },
          rightButton: {
            label: { text: 'Edit', color: '#6C5CE7', fontSize: 14 },
            variant: 'ghost',
            clickAction: { type: 'navigate', route: '/campaigns/edit/123' },
          },
          rightIcon: { name: 'more-vertical', size: 20, color: '#1A1A1A' },
        },
      }}
    />
  ),
};

export const SectionHeader: Story = {
  render: () => (
    <SnippetDoc
      type="sectionHeaderSnippet"
      description="Section divider with a title, optional subtitle, and icon. Used to label groups of content within a page."
      json={{
        type: 'sectionHeaderSnippet',
        data: {
          title: { text: 'Selected Creators', color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
          subtitle: { text: '12 creators matched', color: '#888888', fontSize: 13 },
          icon: { name: 'users', size: 20, color: '#6C5CE7' },
        },
      }}
    />
  ),
};

export const InfoSnippetType1: Story = {
  name: 'Info Snippet Type 1',
  render: () => (
    <SnippetDoc
      type="infoSnippetType1"
      description="Versatile info row with left image/icon, title, up to 3 subtitles, tag, right icon/image, progress indicators, and click/view actions. The workhorse list-item snippet."
      json={{
        type: 'infoSnippetType1',
        data: {
          title: { text: 'Priya Sharma', color: '#1A1A1A', fontSize: 15, fontWeight: '500' },
          subtitle: { text: '2.4M followers', color: '#888888', fontSize: 13 },
          subtitle2: { text: 'Fashion, Lifestyle', color: '#AAAAAA', fontSize: 12 },
          subtitle3: { text: 'Mumbai', color: '#AAAAAA', fontSize: 12 },
          leftImage: {
            url: 'https://cdn.amplify.club/avatars/priya.jpg',
            width: 48,
            height: 48,
            borderRadius: 24,
          },
          tag: { text: 'Top Creator', backgroundColor: '#E8F5E9', textColor: '#2E7D32', fontSize: 11 },
          rightIcon: { name: 'chevron-right', size: 16, color: '#CCCCCC' },
          leftProgressIndicator: { value: 0.85, color: '#6C5CE7', trackColor: '#F0F0F0' },
          clickAction: { type: 'navigate', route: '/creators/456' },
          onViewAction: { type: 'event', event: 'creator_impression', payload: { id: '456' } },
        },
      }}
    />
  ),
};

export const CardSnippetType1: Story = {
  name: 'Card Snippet Type 1',
  render: () => (
    <SnippetDoc
      type="cardSnippetType1"
      description="Card container that wraps a header, footer, and a list of child snippet items. Provides visual grouping with optional Card styling (background, border, shadow)."
      json={{
        type: 'cardSnippetType1',
        data: {
          card: { backgroundColor: '#FFFFFF', borderRadius: 12, elevation: 2, padding: 16 },
          header: {
            type: 'sectionHeaderSnippet',
            data: { title: { text: 'Campaign Summary', fontSize: 16, fontWeight: '600' } },
          },
          items: [
            {
              type: 'infoSnippetType1',
              data: {
                title: { text: 'Total Budget' },
                subtitle: { text: 'INR 5,00,000' },
                rightIcon: { name: 'rupee-sign', size: 16 },
              },
            },
            {
              type: 'infoSnippetType1',
              data: {
                title: { text: 'Duration' },
                subtitle: { text: '15 Apr - 30 Apr' },
              },
            },
          ],
          footer: {
            type: 'pageFooterSnippet',
            data: {
              primaryButton: { label: { text: 'Approve' }, variant: 'primary' },
            },
          },
        },
      }}
    />
  ),
};

export const GroupSnippetType1: Story = {
  name: 'Group Snippet Type 1',
  render: () => (
    <SnippetDoc
      type="groupSnippetType1"
      description="Generic group container with card styling, a list of child snippet items, and optional layout config (scrollable, grid, etc.)."
      json={{
        type: 'groupSnippetType1',
        data: {
          card: { backgroundColor: '#F9F9FB', borderRadius: 12, padding: 12 },
          items: [
            {
              type: 'infoSnippetType1',
              data: { title: { text: 'Content Approved' }, subtitle: { text: '8 posts' } },
            },
            {
              type: 'infoSnippetType1',
              data: { title: { text: 'Pending Review' }, subtitle: { text: '3 posts' } },
            },
          ],
        },
        config: { layout: 'vertical', gap: 8 },
      }}
    />
  ),
};

export const BannerImage: Story = {
  render: () => (
    <SnippetDoc
      type="bannerImageSnippetType1"
      description="Full-width banner image with optional config for aspect ratio and border radius. Used for hero banners and campaign cover images."
      json={{
        type: 'bannerImageSnippetType1',
        data: {
          image: {
            url: 'https://cdn.amplify.club/banners/fashion-week-2026.jpg',
            width: 375,
            height: 200,
            borderRadius: 12,
            resizeMode: 'cover',
          },
        },
        config: { aspectRatio: 1.875 },
      }}
    />
  ),
};

export const AeroBar: Story = {
  render: () => (
    <SnippetDoc
      type="aeroBarType1"
      description="Carousel-style horizontal bar with auto-play and pagination dots. Each item is rendered as a card within the carousel."
      json={{
        type: 'aeroBarType1',
        config: { autoPlayInterval: 3000, showPagination: true },
        data: {
          items: [
            {
              title: { text: 'Complete your profile', color: '#1A1A1A', fontSize: 14 },
              subtitle: { text: 'Add a profile photo to get started', color: '#888888' },
              image: { url: 'https://cdn.amplify.club/icons/profile-prompt.png' },
              clickAction: { type: 'navigate', route: '/profile/edit' },
            },
            {
              title: { text: 'New campaign available', color: '#1A1A1A', fontSize: 14 },
              subtitle: { text: 'Summer Collection by Brand X', color: '#888888' },
              image: { url: 'https://cdn.amplify.club/icons/campaign-new.png' },
              clickAction: { type: 'navigate', route: '/campaigns/789' },
            },
          ],
        },
      }}
    />
  ),
};

export const ImageCarousel: Story = {
  render: () => (
    <SnippetDoc
      type="imageCarouselSnippet"
      description="Swipeable image carousel displaying a list of images with optional metadata per item."
      json={{
        type: 'imageCarouselSnippet',
        data: {
          items: [
            { url: 'https://cdn.amplify.club/content/post-1.jpg', width: 375, height: 375 },
            { url: 'https://cdn.amplify.club/content/post-2.jpg', width: 375, height: 375 },
            { url: 'https://cdn.amplify.club/content/post-3.jpg', width: 375, height: 375 },
          ],
        },
      }}
    />
  ),
};

export const FormSnippetType1: Story = {
  name: 'Form Snippet Type 1',
  render: () => (
    <SnippetDoc
      type="formSnippetType1"
      description="Form container holding a list of input snippet items. Collects form state by formKey and submits via the page footer's CTA."
      json={{
        type: 'formSnippetType1',
        data: {
          items: [
            {
              type: 'input',
              config: { formKey: 'brand_name' },
              data: {
                type: 'text',
                data: {
                  label: { text: 'Brand Name', fontSize: 13, color: '#555' },
                  placeholder: { text: 'Enter brand name', color: '#BBBBBB' },
                },
              },
            },
            {
              type: 'input',
              config: { formKey: 'budget' },
              data: {
                type: 'number',
                data: {
                  label: { text: 'Budget (INR)', fontSize: 13, color: '#555' },
                  placeholder: { text: '50000', color: '#BBBBBB' },
                },
              },
            },
            {
              type: 'singleSelectInput',
              config: { formKey: 'category' },
              data: {
                label: { text: 'Category' },
                options: [
                  { label: 'Fashion', value: 'fashion' },
                  { label: 'Beauty', value: 'beauty' },
                  { label: 'Tech', value: 'tech' },
                ],
              },
            },
          ],
        },
        config: { scrollable: true },
      }}
    />
  ),
};

export const InputSnippet: Story = {
  name: 'Input',
  render: () => (
    <SnippetDoc
      type="input"
      description="Single text/number input field with label, placeholder, optional right button, editable flag, and default value. Identified by formKey in config."
      json={{
        type: 'input',
        config: { formKey: 'creator_handle' },
        data: {
          type: 'text',
          data: {
            label: { text: 'Instagram Handle', fontSize: 13, color: '#555' },
            placeholder: { text: '@username', color: '#BBBBBB' },
            rightButton: {
              label: { text: 'Verify', color: '#6C5CE7', fontSize: 13 },
              variant: 'ghost',
              clickAction: { type: 'api', url: '/api/verify-handle' },
            },
            editable: true,
            defaultValue: '',
          },
        },
      }}
    />
  ),
};

export const PageFooter: Story = {
  render: () => (
    <SnippetDoc
      type="pageFooterSnippet"
      description="Sticky bottom bar with primary/secondary buttons, optional checkbox, and helper text. Drives the main CTA for the page."
      json={{
        type: 'pageFooterSnippet',
        data: {
          primaryButton: {
            label: { text: 'Submit Application', color: '#FFFFFF', fontSize: 15 },
            variant: 'primary',
            clickAction: { type: 'api', method: 'POST', url: '/api/applications', body: '$formState' },
          },
          secondaryButton: {
            label: { text: 'Save as Draft', color: '#6C5CE7', fontSize: 14 },
            variant: 'ghost',
            clickAction: { type: 'api', method: 'POST', url: '/api/applications/draft', body: '$formState' },
          },
          helperText: { text: 'By submitting you agree to the terms', color: '#AAAAAA', fontSize: 11 },
          checkbox: {
            title: { text: 'I accept the Terms and Conditions', color: '#555555', fontSize: 13 },
          },
        },
        config: { sticky: true },
      }}
    />
  ),
};

export const Separator: Story = {
  render: () => (
    <SnippetDoc
      type="separator"
      description="Visual divider between sections. Supports variants (line, space), thickness, label overlay, color, and vertical margins."
      json={{
        type: 'separator',
        data: {
          variant: 'line',
          thickness: 1,
          marginVertical: 16,
          color: '#E0E0E0',
          label: { text: 'OR', color: '#AAAAAA', fontSize: 12 },
        },
      }}
    />
  ),
};

export const Chip: Story = {
  render: () => (
    <SnippetDoc
      type="chip"
      description="Small tappable chip with a label, optional icon, and click action. Used for filters, tags, and quick-action pills."
      json={{
        type: 'chip',
        data: {
          title: { text: 'Fashion', color: '#6C5CE7', fontSize: 13 },
          icon: { name: 'tag', size: 14, color: '#6C5CE7' },
          clickAction: { type: 'filter', key: 'category', value: 'fashion' },
        },
      }}
    />
  ),
};

export const BottomSheetType1: Story = {
  name: 'Bottom Sheet Type 1',
  render: () => (
    <SnippetDoc
      type="BottomSheetType1"
      description="Modal bottom sheet with configurable height, optional API endpoint for lazy-loading content, and a header with search support."
      json={{
        type: 'BottomSheetType1',
        config: { height: '90%', apiEndpoint: '/api/creators/search' },
        data: {
          header: {
            type: 'bottomSheetHeaderWithSearchSnippet',
            data: {
              title: { text: 'Select Creators', fontSize: 16, fontWeight: '600' },
              searchPlaceholder: { text: 'Search by name or handle', color: '#BBBBBB' },
            },
          },
        },
      }}
    />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <SnippetDoc
      type="emptyStateSnippetType1"
      description="Placeholder shown when a list or section has no data. Includes top image, title, subtitle, and a primary CTA button."
      json={{
        type: 'emptyStateSnippetType1',
        data: {
          card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24 },
          topImage: {
            url: 'https://cdn.amplify.club/illustrations/no-campaigns.png',
            width: 200,
            height: 160,
          },
          title: { text: 'No campaigns yet', color: '#1A1A1A', fontSize: 18, fontWeight: '600' },
          subtitle: { text: 'Create your first campaign to get started with creator marketing.', color: '#888888', fontSize: 14 },
          primaryButton: {
            label: { text: 'Create Campaign', color: '#FFFFFF', fontSize: 15 },
            variant: 'primary',
            clickAction: { type: 'navigate', route: '/campaigns/new' },
          },
        },
      }}
    />
  ),
};

export const TabsFooter: Story = {
  render: () => (
    <SnippetDoc
      type="tabsFooterSnippetType1"
      description="Bottom tab bar with multiple tabs, each having an icon, label, and navigation action. Used as the app's main navigation footer."
      json={{
        type: 'tabsFooterSnippetType1',
        data: {
          tabs: [
            {
              icon: { name: 'home', size: 22, color: '#6C5CE7' },
              label: { text: 'Home', fontSize: 11, color: '#6C5CE7' },
              isSelected: true,
              clickAction: { type: 'navigate', route: '/home' },
            },
            {
              icon: { name: 'briefcase', size: 22, color: '#888888' },
              label: { text: 'Campaigns', fontSize: 11, color: '#888888' },
              isSelected: false,
              clickAction: { type: 'navigate', route: '/campaigns' },
            },
            {
              icon: { name: 'message-circle', size: 22, color: '#888888' },
              label: { text: 'Chat', fontSize: 11, color: '#888888' },
              isSelected: false,
              clickAction: { type: 'navigate', route: '/chat' },
            },
            {
              icon: { name: 'user', size: 22, color: '#888888' },
              label: { text: 'Profile', fontSize: 11, color: '#888888' },
              isSelected: false,
              clickAction: { type: 'navigate', route: '/profile' },
            },
          ],
        },
      }}
    />
  ),
};

export const ListSnippetType1: Story = {
  name: 'List Snippet Type 1',
  render: () => (
    <SnippetDoc
      type="listSnippetType1"
      description="Simple labeled list with a title, bullet-style list items, and an optional click action on the whole row."
      json={{
        type: 'listSnippetType1',
        data: {
          title: { text: 'Deliverables', color: '#1A1A1A', fontSize: 15, fontWeight: '500' },
          listItems: [
            { text: '1 Instagram Reel (30s)', color: '#555555', fontSize: 13 },
            { text: '2 Instagram Stories', color: '#555555', fontSize: 13 },
            { text: '1 YouTube Short', color: '#555555', fontSize: 13 },
          ],
          clickAction: { type: 'navigate', route: '/campaigns/123/deliverables' },
        },
      }}
    />
  ),
};

export const UploadFile: Story = {
  render: () => (
    <SnippetDoc
      type="uploadFileSnippet"
      description="File upload button with label, left icon, upload-success state icon, remove icon, and form key binding. Supports showing the uploaded file name."
      json={{
        type: 'uploadFileSnippet',
        config: { formKey: 'invoice_file', maxSizeMB: 10, allowedTypes: ['pdf', 'jpg', 'png'] },
        data: {
          title: { text: 'Upload Invoice', color: '#1A1A1A', fontSize: 14 },
          label: { text: 'Choose File', color: '#6C5CE7', fontSize: 14 },
          leftIcon: { name: 'upload', size: 18, color: '#6C5CE7' },
          uploadSuccessIcon: { name: 'check-circle', size: 18, color: '#2E7D32' },
          removeFileIcon: { name: 'x-circle', size: 18, color: '#E53935' },
          variant: 'noBackground',
          size: 'large',
          clickAction: { type: 'file_picker', accept: 'application/pdf,image/*' },
        },
      }}
    />
  ),
};

export const Loader: Story = {
  render: () => (
    <SnippetDoc
      type="loaderSnippetType1"
      description="Loading indicator snippet with variant control (spinner, skeleton, shimmer). Shown while async content is being fetched."
      json={{
        type: 'loaderSnippetType1',
        data: {
          variant: 'spinner',
        },
      }}
    />
  ),
};
