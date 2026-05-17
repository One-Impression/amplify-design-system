import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ImageStack } from './ImageStack';

describe('ImageStack', () => {
  const images = [
    { uri: 'https://example.com/1.jpg' },
    { uri: 'https://example.com/2.jpg' },
    { uri: 'https://example.com/3.jpg' },
    { uri: 'https://example.com/4.jpg' },
    { uri: 'https://example.com/5.jpg' },
  ];

  it('renders max images and overflow count', () => {
    render(<ImageStack testID="stack" images={images} max={3} />);
    expect(screen.getByText('+2')).toBeTruthy();
  });

  it('does not show overflow when images fit within max', () => {
    render(<ImageStack testID="stack" images={images.slice(0, 2)} max={3} />);
    expect(screen.queryByText(/\+/)).toBeNull();
  });
});
