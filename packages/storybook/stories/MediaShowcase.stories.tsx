import type { Meta, StoryObj } from '@storybook/react';
import { MediaShowcase, Button } from '@amplify-ai/ui';

const meta = {
  title: 'Marketing/MediaShowcase',
  component: MediaShowcase,
  tags: ['autodocs'],
  argTypes: {
    aspect: { control: 'select', options: ['16/9', '21/9', '4/3', '1/1'] },
    showPlayButton: { control: 'boolean' },
    overlay: { control: 'boolean' },
  },
} satisfies Meta<typeof MediaShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const stockImage =
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80&auto=format&fit=crop';
const sampleVideo =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const samplePoster =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg';

export const ImageHero: Story = {
  args: {
    media: { type: 'image', src: stockImage, alt: 'Team collaborating in a modern office' },
    eyebrow: 'Featured story',
    headline: 'How Acme tripled their ROAS in 30 days',
    description: 'A short look at how the Acme growth team rebuilt their creator program on Amplify.',
    cta: <Button variant="primary">Watch the story</Button>,
  },
};

export const VideoWithPlayButton: Story = {
  args: {
    media: {
      type: 'video',
      src: sampleVideo,
      poster: samplePoster,
      alt: 'Product walkthrough',
    },
    showPlayButton: true,
    eyebrow: 'Product tour',
    headline: 'See Amplify in 90 seconds',
    description: 'A guided walkthrough of the campaign-creation flow, from brief to launch.',
  },
};

export const AutoplayVideo: Story = {
  args: {
    media: {
      type: 'video',
      src: sampleVideo,
      poster: samplePoster,
      alt: 'Looping product reel',
      autoPlay: true,
      loop: true,
      muted: true,
    },
  },
};

export const VideoWithCaptions: Story = {
  args: {
    media: {
      type: 'video',
      src: sampleVideo,
      poster: samplePoster,
      alt: 'Captioned demo',
      tracks: [
        { src: '/captions/en.vtt', srcLang: 'en', label: 'English', default: true },
        { src: '/captions/es.vtt', srcLang: 'es', label: 'Español' },
      ],
    },
    showPlayButton: true,
    headline: 'Captions ship with every video',
  },
};

export const Wide: Story = {
  args: {
    media: { type: 'image', src: stockImage, alt: '' },
    aspect: '21/9',
    headline: 'Cinematic 21:9 hero',
    description: 'Use the wide aspect for above-the-fold storytelling.',
  },
};

export const Square: Story = {
  args: {
    media: { type: 'image', src: stockImage, alt: '' },
    aspect: '1/1',
    headline: 'Square format',
  },
};

export const NoOverlayContent: Story = {
  args: {
    media: { type: 'image', src: stockImage, alt: 'Decorative banner' },
  },
};
