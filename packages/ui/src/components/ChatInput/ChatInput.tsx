'use client';

import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

export interface ChatInputHandle {
  focus: () => void;
  clear: () => void;
}

export interface ChatInputProps {
  /** Controlled value. If omitted, the component is uncontrolled. */
  value?: string;
  /** Default value (uncontrolled mode). */
  defaultValue?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Called on every change. */
  onChange?: (value: string) => void;
  /** Called when user sends — Enter (without shift) or Cmd/Ctrl+Enter, or send button. */
  onSend?: (value: string) => void;
  /** Disable input + send. */
  disabled?: boolean;
  /** Min textarea rows. Default 1. */
  minRows?: number;
  /** Max textarea rows before scrolling. Default 6. */
  maxRows?: number;
  /** Slot for attach button (rendered left of input). */
  attachSlot?: React.ReactNode;
  /** Slot for voice button (rendered right, before send). */
  voiceSlot?: React.ReactNode;
  /** Slot for emoji picker trigger (rendered right, before send). */
  emojiSlot?: React.ReactNode;
  /** Custom send icon (defaults to paper-plane). */
  sendIcon?: React.ReactNode;
  /** Aria label for send button. */
  sendLabel?: string;
  /** Hint text below input. */
  hint?: string;
  className?: string;
}

const SendIcon = (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export const ChatInput = React.forwardRef<ChatInputHandle, ChatInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      placeholder = 'Type a message…',
      onChange,
      onSend,
      disabled,
      minRows = 1,
      maxRows = 6,
      attachSlot,
      voiceSlot,
      emojiSlot,
      sendIcon,
      sendLabel = 'Send message',
      hint,
      className,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = isControlled ? controlledValue : internalValue;

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      clear: () => {
        if (!isControlled) setInternalValue('');
        onChange?.('');
      },
    }));

    const autosize = useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = 'auto';
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
      const max = lineHeight * maxRows + 16;
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
    }, [maxRows]);

    useEffect(() => {
      autosize();
    }, [value, autosize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    };

    const handleSend = () => {
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSend?.(trimmed);
      if (!isControlled) setInternalValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Cmd/Ctrl+Enter always sends.
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSend();
        return;
      }
      // Plain Enter sends; Shift+Enter inserts newline.
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const canSend = value.trim().length > 0 && !disabled;

    return (
      <div
        className={cn(
          'flex flex-col gap-1 w-full',
          className
        )}
      >
        <div
          className={cn(
            'flex items-end gap-2 p-2 rounded-[16px]',
            'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
            'focus-within:ring-2 focus-within:ring-[var(--amp-semantic-border-focus)] focus-within:border-[var(--amp-semantic-border-focus)]',
            // TODO(phase-a): swap to amplify-motion-*
            'transition-shadow duration-150',
            disabled && 'opacity-50'
          )}
        >
          {attachSlot && <div className="flex-shrink-0 pb-1">{attachSlot}</div>}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={minRows}
            placeholder={placeholder}
            aria-label={placeholder}
            className={cn(
              'flex-1 bg-transparent resize-none outline-none',
              'text-[14px] leading-[20px] text-[var(--amp-semantic-text-primary)]',
              'placeholder:text-[var(--amp-semantic-text-muted)]',
              'py-1 px-1'
            )}
          />
          {emojiSlot && <div className="flex-shrink-0 pb-1">{emojiSlot}</div>}
          {voiceSlot && <div className="flex-shrink-0 pb-1">{voiceSlot}</div>}
          <button
            type="button"
            aria-label={sendLabel}
            disabled={!canSend}
            onClick={handleSend}
            className={cn(
              'flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full',
              'transition-colors duration-150',
              canSend
                ? 'bg-[var(--amp-semantic-accent)] text-[var(--amp-semantic-text-inverse)] hover:opacity-90'
                : 'bg-[var(--amp-semantic-bg-sunken)] text-[var(--amp-semantic-text-muted)] cursor-not-allowed'
            )}
          >
            {sendIcon || SendIcon}
          </button>
        </div>
        {hint && (
          <p className="text-[11px] text-[var(--amp-semantic-text-muted)] px-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
ChatInput.displayName = 'ChatInput';
