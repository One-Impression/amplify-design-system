import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';
import { Section } from './Section';

describe('Section', () => {
  it('renders title', () => {
    render(<Section title="Campaigns"><RNText>Content</RNText></Section>);
    expect(screen.getByText('Campaigns')).toBeTruthy();
  });

  it('renders children', () => {
    render(<Section><RNText>Body</RNText></Section>);
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('renders headerRight', () => {
    render(
      <Section title="Earnings" headerRight={<RNText>See all</RNText>}>
        <RNText>Content</RNText>
      </Section>,
    );
    expect(screen.getByText('See all')).toBeTruthy();
  });
});
