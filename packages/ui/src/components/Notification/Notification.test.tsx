import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Notification, NotificationList } from './Notification';

describe('Notification', () => {
  it('renders title, body, and timestamp', () => {
    render(
      <Notification title="Hello" body="World" timestamp="now" />
    );
    expect(screen.getByText('Hello')).toBeDefined();
    expect(screen.getByText('World')).toBeDefined();
    expect(screen.getByText('now')).toBeDefined();
  });

  it('shows unread indicator when read=false', () => {
    render(<Notification title="t" />);
    expect(screen.getByLabelText('Unread')).toBeDefined();
  });

  it('does not show unread indicator when read=true', () => {
    render(<Notification title="t" read />);
    expect(screen.queryByLabelText('Unread')).toBeNull();
  });

  it('fires onMarkRead on click for unread items', () => {
    const onMarkRead = vi.fn();
    render(
      <Notification id="abc" title="t" onMarkRead={onMarkRead} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onMarkRead).toHaveBeenCalledWith('abc');
  });

  it('does not fire onMarkRead for already-read items', () => {
    const onMarkRead = vi.fn();
    render(
      <Notification id="abc" title="t" read onMarkRead={onMarkRead} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onMarkRead).not.toHaveBeenCalled();
  });

  it('renders as link when href provided', () => {
    render(<Notification title="t" href="/somewhere" />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/somewhere');
  });
});

describe('NotificationList', () => {
  it('renders list with role="list"', () => {
    render(
      <NotificationList>
        <Notification title="a" />
        <Notification title="b" />
      </NotificationList>
    );
    expect(screen.getByRole('list')).toBeDefined();
    expect(screen.getAllByRole('listitem').length).toBe(2);
  });

  it('renders empty slot when no children', () => {
    render(<NotificationList empty={<p>No notifications</p>}>{[]}</NotificationList>);
    expect(screen.getByText('No notifications')).toBeDefined();
  });
});
