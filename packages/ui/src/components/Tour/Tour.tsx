import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

export type TourStepPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TourStep {
  /** CSS selector for the anchor element. Omit for unanchored (centered) steps. */
  target?: string;
  /** Step headline. */
  title: string;
  /** Body copy. */
  body: React.ReactNode;
  /** Where the card sits relative to the target. Defaults to `bottom` (or `center` if no target). */
  placement?: TourStepPlacement;
}

export interface TourProps {
  /** Stable identifier — used as the localStorage key for progress. */
  tourId: string;
  /** Ordered list of steps. */
  steps: TourStep[];
  /** Whether the tour is mounted/visible. */
  open: boolean;
  /** Called when the user finishes or skips the tour. */
  onComplete?: () => void;
  /** Called when the user dismisses (Esc / close / skip). */
  onClose?: () => void;
  /** Optional starting step — overrides any persisted progress. */
  startAt?: number;
  /** Disable localStorage persistence. */
  persist?: boolean;
  className?: string;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function readProgress(tourId: string, persist: boolean): number {
  if (!persist || typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(`amp:tour:${tourId}`);
    if (!raw) return 0;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeProgress(tourId: string, step: number, persist: boolean): void {
  if (!persist || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`amp:tour:${tourId}`, String(step));
  } catch {
    /* ignore — quota / disabled storage */
  }
}

function clearProgress(tourId: string, persist: boolean): void {
  if (!persist || typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(`amp:tour:${tourId}`);
  } catch {
    /* ignore */
  }
}

function measureTarget(selector: string | undefined): TargetRect | null {
  if (!selector || typeof document === 'undefined') return null;
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Multi-step product tour overlay.
 *
 * - Renders a dimmed backdrop in a top-level portal so it covers everything.
 * - Each step anchors to a CSS selector (or floats centered if `target` is omitted).
 * - Keyboard: Esc closes, Enter / → advances, ← goes back.
 * - Persists current step index to `localStorage[amp:tour:{tourId}]` unless `persist=false`.
 * - On the final step, "Done" calls `onComplete` and clears persisted progress.
 */
export const Tour: React.FC<TourProps> = ({
  tourId,
  steps,
  open,
  onComplete,
  onClose,
  startAt,
  persist = true,
  className,
}) => {
  const titleId = useId();
  const descId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState<number>(() =>
    startAt ?? readProgress(tourId, persist)
  );
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  // Clamp step index to bounds.
  const clampedIndex = Math.min(Math.max(stepIndex, 0), Math.max(steps.length - 1, 0));
  const step = steps[clampedIndex];
  const placement: TourStepPlacement =
    step?.placement ?? (step?.target ? 'bottom' : 'center');

  const goNext = useCallback(() => {
    setStepIndex((i) => {
      const next = i + 1;
      if (next >= steps.length) {
        clearProgress(tourId, persist);
        onComplete?.();
        return i;
      }
      writeProgress(tourId, next, persist);
      return next;
    });
  }, [steps.length, tourId, persist, onComplete]);

  const goPrev = useCallback(() => {
    setStepIndex((i) => {
      const prev = Math.max(0, i - 1);
      writeProgress(tourId, prev, persist);
      return prev;
    });
  }, [tourId, persist]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Keyboard handling
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, goNext, goPrev, handleClose]);

  // Focus the card when step changes
  useEffect(() => {
    if (open && cardRef.current) {
      cardRef.current.focus();
    }
  }, [open, clampedIndex]);

  // Measure target on step change + on resize/scroll
  useEffect(() => {
    if (!open || !step) return;
    const update = () => setTargetRect(measureTarget(step.target));
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, step]);

  if (!open || !step) return null;
  if (typeof document === 'undefined') return null;

  const isFirst = clampedIndex === 0;
  const isLast = clampedIndex === steps.length - 1;

  const cardPosition = computeCardPosition(targetRect, placement);

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      aria-hidden={false}
    >
      {/* Backdrop with optional spotlight cutout */}
      <Backdrop targetRect={targetRect} onClick={handleClose} />

      {/* Card */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        style={cardPosition.style}
        className={cn(
          'absolute z-[101] w-[320px] max-w-[90vw] rounded-[12px] p-4',
          'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
          'shadow-xl focus:outline-none',
          className
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            id={titleId}
            className="text-[15px] font-semibold text-[var(--amp-semantic-text-primary)]"
          >
            {step.title}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close tour"
            className="shrink-0 -mt-1 -mr-1 inline-flex items-center justify-center w-7 h-7 rounded-md text-[var(--amp-semantic-text-muted)] hover:text-[var(--amp-semantic-text-primary)] hover:bg-[var(--amp-semantic-bg-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div
          id={descId}
          className="text-[13px] text-[var(--amp-semantic-text-secondary)] leading-snug mb-4"
        >
          {step.body}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-[var(--amp-semantic-text-muted)]">
            {clampedIndex + 1} of {steps.length}
          </span>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={goPrev}
                className="text-[13px] px-2.5 py-1.5 rounded-md text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={goNext}
              className="text-[13px] font-medium px-3 py-1.5 rounded-md bg-[var(--amp-semantic-bg-accent,var(--amp-semantic-status-info))] text-[var(--amp-semantic-text-on-accent,white)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]"
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

interface BackdropProps {
  targetRect: TargetRect | null;
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ targetRect, onClick }) => {
  // When a target is present, render four panels around it to create a spotlight.
  if (targetRect && targetRect.width > 0 && targetRect.height > 0) {
    const padding = 6;
    const t = targetRect.top - padding;
    const l = targetRect.left - padding;
    const w = targetRect.width + padding * 2;
    const h = targetRect.height + padding * 2;
    const panel = 'fixed bg-black/55 backdrop-blur-[1px]';
    return (
      <>
        <div className={panel} style={{ top: 0, left: 0, right: 0, height: t }} onClick={onClick} aria-hidden="true" />
        <div className={panel} style={{ top: t, left: 0, width: l, height: h }} onClick={onClick} aria-hidden="true" />
        <div className={panel} style={{ top: t, left: l + w, right: 0, height: h }} onClick={onClick} aria-hidden="true" />
        <div className={panel} style={{ top: t + h, left: 0, right: 0, bottom: 0 }} onClick={onClick} aria-hidden="true" />
        {/* Spotlight ring */}
        <div
          aria-hidden="true"
          className="fixed pointer-events-none rounded-[8px] ring-2 ring-[var(--amp-semantic-status-info,#60a5fa)]"
          style={{ top: t, left: l, width: w, height: h }}
        />
      </>
    );
  }
  return (
    <div
      className="fixed inset-0 bg-black/55 backdrop-blur-[1px]"
      onClick={onClick}
      aria-hidden="true"
    />
  );
};

interface CardPosition {
  style: React.CSSProperties;
}

const CARD_GAP = 12;
const CARD_WIDTH = 320;
const CARD_EST_HEIGHT = 180;

function computeCardPosition(
  rect: TargetRect | null,
  placement: TourStepPlacement
): CardPosition {
  if (!rect || placement === 'center') {
    return {
      style: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    };
  }

  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = rect.top - CARD_EST_HEIGHT - CARD_GAP;
      left = rect.left + rect.width / 2 - CARD_WIDTH / 2;
      break;
    case 'bottom':
      top = rect.top + rect.height + CARD_GAP;
      left = rect.left + rect.width / 2 - CARD_WIDTH / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - CARD_EST_HEIGHT / 2;
      left = rect.left - CARD_WIDTH - CARD_GAP;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - CARD_EST_HEIGHT / 2;
      left = rect.left + rect.width + CARD_GAP;
      break;
  }

  // Clamp within viewport with 8px margin.
  const margin = 8;
  left = Math.max(margin, Math.min(left, viewportW - CARD_WIDTH - margin));
  top = Math.max(margin, Math.min(top, viewportH - CARD_EST_HEIGHT - margin));

  return { style: { top, left } };
}

/**
 * Documentation alias — the canonical step shape is the `TourStep` type
 * (re-exported from `index.ts`). This component is a no-op render slot
 * provided for symmetry; consumers should pass `steps={...}` to `<Tour>`.
 */
export const TourStepMarker: React.FC<TourStep> = () => null;
