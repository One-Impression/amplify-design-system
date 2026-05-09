/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  RecentChangesPanel,
  type GitCommit,
} from './RecentChangesPanel';

afterEach(cleanup);

const sevenCommits: GitCommit[] = Array.from({ length: 7 }, (_, i) => ({
  sha: `sha${i}abcd`,
  message: `Commit message ${i}`,
  author: `Author ${i}`,
  timestamp: new Date(Date.now() - (i + 1) * 3600_000),
  added: 10 * (i + 1),
  removed: 2 * (i + 1),
  url: i === 0 ? 'https://github.com/example/repo/commit/sha0abcd' : undefined,
}));

describe('RecentChangesPanel', () => {
  it('renders as a complementary landmark with the heading id linked', () => {
    render(
      <RecentChangesPanel
        filePath="src/components/Order.tsx"
        commits={sevenCommits}
        onClose={() => undefined}
      />,
    );
    const aside = screen.getByRole('complementary');
    const heading = screen.getByTestId('recent-changes-panel-heading');
    expect(aside.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('renders the heading "Recent changes" and the file path', () => {
    render(
      <RecentChangesPanel
        filePath="src/components/Order.tsx"
        commits={sevenCommits}
        onClose={() => undefined}
      />,
    );
    expect(screen.getByTestId('recent-changes-panel-heading').textContent).toBe(
      'Recent changes',
    );
    expect(
      screen.getByTestId('recent-changes-panel-filepath').textContent,
    ).toBe('src/components/Order.tsx');
  });

  it('renders one list item per commit', () => {
    render(
      <RecentChangesPanel
        filePath="x"
        commits={sevenCommits}
        onClose={() => undefined}
      />,
    );
    sevenCommits.forEach((c) => {
      expect(screen.getByTestId(`recent-changes-panel-commit-${c.sha}`)).toBeDefined();
    });
  });

  it('renders the commit message, author, +added, -removed, short SHA per row', () => {
    render(
      <RecentChangesPanel
        filePath="x"
        commits={[sevenCommits[1]]}
        onClose={() => undefined}
      />,
    );
    const c = sevenCommits[1];
    expect(
      screen.getByTestId(`recent-changes-panel-commit-${c.sha}`).textContent,
    ).toContain(c.message);
    expect(
      screen.getByTestId(`recent-changes-panel-commit-author-${c.sha}`).textContent,
    ).toBe(c.author);
    expect(
      screen.getByTestId(`recent-changes-panel-commit-added-${c.sha}`).textContent,
    ).toBe(`+${c.added}`);
    expect(
      screen.getByTestId(`recent-changes-panel-commit-removed-${c.sha}`).textContent,
    ).toBe(`−${c.removed}`);
  });

  it('renders the message as <a> when commit.url is provided', () => {
    render(
      <RecentChangesPanel
        filePath="x"
        commits={[sevenCommits[0]]}
        onClose={() => undefined}
      />,
    );
    const link = screen.getByTestId(
      `recent-changes-panel-commit-link-${sevenCommits[0].sha}`,
    ) as HTMLAnchorElement;
    expect(link.tagName).toBe('A');
    expect(link.href).toContain('github.com/example/repo/commit/sha0abcd');
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
  });

  it('renders the message as plain text when commit.url is not provided', () => {
    const noUrl: GitCommit = { ...sevenCommits[1], url: undefined };
    render(
      <RecentChangesPanel
        filePath="x"
        commits={[noUrl]}
        onClose={() => undefined}
      />,
    );
    expect(
      screen.queryByTestId(`recent-changes-panel-commit-link-${noUrl.sha}`),
    ).toBeNull();
  });

  it('close button fires onClose when clicked', () => {
    const onClose = vi.fn();
    render(
      <RecentChangesPanel
        filePath="x"
        commits={sevenCommits}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByTestId('recent-changes-panel-close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Escape on the window fires onClose', () => {
    const onClose = vi.fn();
    render(
      <RecentChangesPanel
        filePath="x"
        commits={sevenCommits}
        onClose={onClose}
      />,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders an empty-state message when commits is empty', () => {
    render(
      <RecentChangesPanel filePath="x" commits={[]} onClose={() => undefined} />,
    );
    expect(screen.getByTestId('recent-changes-panel-empty')).toBeDefined();
    expect(screen.queryByTestId('recent-changes-panel-list')).toBeNull();
  });

  it('honours custom formatTime', () => {
    render(
      <RecentChangesPanel
        filePath="x"
        commits={[sevenCommits[0]]}
        onClose={() => undefined}
        formatTime={() => 'NOW-NOW'}
      />,
    );
    expect(
      screen.getByTestId(`recent-changes-panel-commit-time-${sevenCommits[0].sha}`)
        .textContent,
    ).toBe('NOW-NOW');
  });

  it('does NOT inject hardcoded hex colours into the rendered DOM', () => {
    const { container } = render(
      <RecentChangesPanel
        filePath="x"
        commits={sevenCommits}
        onClose={() => undefined}
      />,
    );
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });
});
