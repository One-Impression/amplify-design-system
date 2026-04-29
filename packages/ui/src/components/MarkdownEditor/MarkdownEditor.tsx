'use client';

import React, {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';
import { renderMarkdown } from './markdown';

export type MarkdownEditorMode = 'split' | 'write' | 'preview';

export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Custom HTML renderer. Defaults to a built-in minimal markdown renderer. */
  renderer?: (markdown: string) => string;
  /** Initial mode. Default `split`. */
  mode?: MarkdownEditorMode;
  onModeChange?: (mode: MarkdownEditorMode) => void;
  placeholder?: string;
  /** Min height in px for the editor pane. Default 280. */
  minHeight?: number;
  /** Aria label for the textarea (required when no visible label). */
  ariaLabel?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

interface ToolAction {
  key: string;
  label: string;
  shortcut?: string;
  glyph: React.ReactNode;
  apply: (text: string, sel: { start: number; end: number }) => {
    text: string;
    selectionStart: number;
    selectionEnd: number;
  };
}

const wrap = (
  text: string,
  sel: { start: number; end: number },
  prefix: string,
  suffix = prefix
) => {
  const before = text.slice(0, sel.start);
  const middle = text.slice(sel.start, sel.end);
  const after = text.slice(sel.end);
  const next = `${before}${prefix}${middle || ''}${suffix}${after}`;
  return {
    text: next,
    selectionStart: sel.start + prefix.length,
    selectionEnd: sel.start + prefix.length + middle.length,
  };
};

const linePrefix = (
  text: string,
  sel: { start: number; end: number },
  prefix: string
) => {
  const before = text.slice(0, sel.start);
  const middle = text.slice(sel.start, sel.end) || '';
  const after = text.slice(sel.end);
  const lineStart = before.lastIndexOf('\n') + 1;
  const head = text.slice(lineStart, sel.start);
  const lines = (head + middle).split('\n');
  const newLines = lines.map((l) => `${prefix}${l}`).join('\n');
  const next = text.slice(0, lineStart) + newLines + after;
  return {
    text: next,
    selectionStart: lineStart,
    selectionEnd: lineStart + newLines.length,
  };
};

const TOOLS: ToolAction[] = [
  {
    key: 'bold',
    label: 'Bold',
    shortcut: 'Mod+B',
    glyph: <span style={{ fontWeight: 700 }}>B</span>,
    apply: (t, s) => wrap(t, s, '**'),
  },
  {
    key: 'italic',
    label: 'Italic',
    shortcut: 'Mod+I',
    glyph: <span style={{ fontStyle: 'italic' }}>I</span>,
    apply: (t, s) => wrap(t, s, '*'),
  },
  {
    key: 'link',
    label: 'Link',
    shortcut: 'Mod+K',
    glyph: (
      <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14a4 4 0 015.66 0l3-3a4 4 0 10-5.66-5.66L11 7M14 10a4 4 0 01-5.66 0l-3 3a4 4 0 105.66 5.66L13 17" />
      </svg>
    ),
    apply: (t, s) => {
      const before = t.slice(0, s.start);
      const middle = t.slice(s.start, s.end) || 'link text';
      const after = t.slice(s.end);
      const inserted = `[${middle}](https://)`;
      return {
        text: before + inserted + after,
        selectionStart: before.length + inserted.length - 9,
        selectionEnd: before.length + inserted.length - 1,
      };
    },
  },
  {
    key: 'h2',
    label: 'Heading',
    glyph: <span style={{ fontWeight: 600 }}>H</span>,
    apply: (t, s) => linePrefix(t, s, '## '),
  },
  {
    key: 'ul',
    label: 'Bulleted list',
    glyph: (
      <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
    apply: (t, s) => linePrefix(t, s, '- '),
  },
  {
    key: 'ol',
    label: 'Numbered list',
    glyph: (
      <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h12M9 12h12M9 18h12M4 6h1m-1 6h1.5M4 18h1.5" />
      </svg>
    ),
    apply: (t, s) => linePrefix(t, s, '1. '),
  },
  {
    key: 'quote',
    label: 'Quote',
    glyph: (
      <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h4v4H7zm0 6h4v4H7zM13 7h4v4h-4zm0 6h4v4h-4z" />
      </svg>
    ),
    apply: (t, s) => linePrefix(t, s, '> '),
  },
  {
    key: 'code',
    label: 'Code',
    glyph: <span style={{ fontFamily: 'monospace' }}>{'<>'}</span>,
    apply: (t, s) => wrap(t, s, '`'),
  },
];

const isMod = (e: React.KeyboardEvent) => e.metaKey || e.ctrlKey;

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  defaultValue,
  onChange,
  renderer = renderMarkdown,
  mode: modeProp,
  onModeChange,
  placeholder = 'Write Markdown…',
  minHeight = 280,
  ariaLabel,
  label,
  helperText,
  disabled,
  className,
  id,
}) => {
  const isControlled = typeof value !== 'undefined';
  const [internal, setInternal] = useState(defaultValue ?? '');
  const text = isControlled ? value! : internal;

  const [internalMode, setInternalMode] = useState<MarkdownEditorMode>(modeProp ?? 'split');
  const isModeControlled = typeof modeProp !== 'undefined';
  const mode = isModeControlled ? modeProp! : internalMode;

  const setMode = useCallback(
    (m: MarkdownEditorMode) => {
      if (!isModeControlled) setInternalMode(m);
      onModeChange?.(m);
    },
    [isModeControlled, onModeChange]
  );

  const setText = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const taRef = useRef<HTMLTextAreaElement>(null);
  const generatedId = useId();
  const editorId = id ?? `mdeditor-${generatedId}`;

  const applyTool = useCallback(
    (tool: ToolAction) => {
      const ta = taRef.current;
      if (!ta) return;
      const sel = { start: ta.selectionStart, end: ta.selectionEnd };
      const result = tool.apply(text, sel);
      setText(result.text);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(result.selectionStart, result.selectionEnd);
      });
    },
    [setText, text]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isMod(e)) return;
    const k = e.key.toLowerCase();
    const map: Record<string, string> = { b: 'bold', i: 'italic', k: 'link' };
    const toolKey = map[k];
    if (!toolKey) return;
    const tool = TOOLS.find((t) => t.key === toolKey);
    if (!tool) return;
    e.preventDefault();
    applyTool(tool);
  };

  const html = useMemo(() => renderer(text), [renderer, text]);

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {label && (
        <label
          htmlFor={editorId}
          className="text-[14px] font-medium text-[var(--amp-semantic-text-primary)]"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'rounded-[16px] border border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-surface)] overflow-hidden',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-b border-[var(--amp-semantic-border-default)] bg-[var(--amp-semantic-bg-sunken)]">
          <div role="toolbar" aria-label="Markdown formatting" className="flex items-center gap-0.5 flex-wrap">
            {TOOLS.map((t) => (
              <button
                key={t.key}
                type="button"
                title={t.shortcut ? `${t.label} (${t.shortcut})` : t.label}
                aria-label={t.label}
                onClick={() => applyTool(t)}
                className={cn(
                  'h-8 w-8 inline-flex items-center justify-center rounded-[8px]',
                  'text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-surface)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]'
                )}
              >
                {t.glyph}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5" role="tablist" aria-label="Editor mode">
            {(['write', 'split', 'preview'] as MarkdownEditorMode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  'h-8 px-2.5 text-[12px] font-medium rounded-[8px] capitalize',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]',
                  mode === m
                    ? 'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)] shadow-sm'
                    : 'text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-surface)]'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div
          className={cn(
            'grid',
            mode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--amp-semantic-border-default)]' : 'grid-cols-1'
          )}
          style={{ minHeight }}
        >
          {(mode === 'write' || mode === 'split') && (
            <textarea
              ref={taRef}
              id={editorId}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label={ariaLabel ?? label ?? 'Markdown editor'}
              spellCheck
              disabled={disabled}
              className={cn(
                'w-full p-4 text-[14px] leading-6 resize-none focus:outline-none',
                'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)]',
                'placeholder:text-[var(--amp-semantic-text-muted)] font-mono'
              )}
              style={{ minHeight }}
            />
          )}
          {(mode === 'preview' || mode === 'split') && (
            <div
              role="region"
              aria-label="Markdown preview"
              className={cn(
                'w-full p-4 overflow-auto text-[14px] leading-6',
                'text-[var(--amp-semantic-text-primary)] prose-sm',
                'amp-markdown-preview'
              )}
              style={{ minHeight }}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
      {helperText && (
        <p className="text-[12px] text-[var(--amp-semantic-text-muted)]">{helperText}</p>
      )}
    </div>
  );
};

MarkdownEditor.displayName = 'MarkdownEditor';
