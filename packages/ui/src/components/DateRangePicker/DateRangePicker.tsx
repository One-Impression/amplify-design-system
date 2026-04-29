'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePreset {
  label: string;
  /** Returns the range when this preset is clicked. */
  getRange: () => DateRange;
}

export interface DateRangePickerProps {
  /** Controlled value. */
  value?: DateRange;
  /** Default uncontrolled value. */
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  /** Earliest selectable date. */
  minDate?: Date;
  /** Latest selectable date. */
  maxDate?: Date;
  /** Placeholder when no range is selected. */
  placeholder?: string;
  /** Hide the preset sidebar. */
  hidePresets?: boolean;
  /** Custom presets. Falls back to a default set. */
  presets?: DateRangePreset[];
  /** Optional label rendered above the trigger. */
  label?: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Date format used for the trigger. Default: en-US short. */
  format?: (date: Date) => string;
  className?: string;
  id?: string;
}

const startOfDay = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);

const isSameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && startOfDay(a).getTime() === startOfDay(b).getTime();

const isInRange = (d: Date, from: Date | null, to: Date | null) => {
  if (!from || !to) return false;
  const t = startOfDay(d).getTime();
  return t >= startOfDay(from).getTime() && t <= startOfDay(to).getTime();
};

const defaultFormat = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const buildDefaultPresets = (): DateRangePreset[] => {
  const today = startOfDay(new Date());
  return [
    {
      label: 'Today',
      getRange: () => ({ from: today, to: today }),
    },
    {
      label: 'Last 7 days',
      getRange: () => ({ from: addDays(today, -6), to: today }),
    },
    {
      label: 'Last 30 days',
      getRange: () => ({ from: addDays(today, -29), to: today }),
    },
    {
      label: 'This month',
      getRange: () => ({ from: startOfMonth(today), to: today }),
    },
    {
      label: 'Custom',
      getRange: () => ({ from: null, to: null }),
    },
  ];
};

const WEEK_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarMonthProps {
  monthStart: Date;
  selection: DateRange;
  hoverDate: Date | null;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({
  monthStart,
  selection,
  hoverDate,
  onSelect,
  onHover,
  minDate,
  maxDate,
}) => {
  const cells = useMemo(() => {
    const first = startOfMonth(monthStart);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0
    ).getDate();
    const list: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      list.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), d));
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [monthStart]);

  const monthLabel = monthStart.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const previewTo = selection.from && !selection.to ? hoverDate : selection.to;

  return (
    <div className="w-full">
      <div className="text-[14px] font-semibold text-[var(--amp-semantic-text-primary)] text-center mb-2">
        {monthLabel}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEK_LABELS.map((w) => (
          <div
            key={w}
            className="text-[11px] uppercase tracking-wide text-[var(--amp-semantic-text-muted)] py-1"
          >
            {w}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={i} aria-hidden="true" />;
          const disabled =
            (minDate && date < startOfDay(minDate)) ||
            (maxDate && date > startOfDay(maxDate));
          const isStart = isSameDay(date, selection.from);
          const isEnd = isSameDay(date, selection.to);
          const inRange = isInRange(date, selection.from, previewTo);
          return (
            <button
              key={i}
              type="button"
              disabled={!!disabled}
              onMouseEnter={() => onHover(date)}
              onFocus={() => onHover(date)}
              onClick={() => !disabled && onSelect(date)}
              aria-pressed={isStart || isEnd}
              aria-label={defaultFormat(date)}
              className={cn(
                'h-8 w-8 mx-auto text-[13px] rounded-full transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]',
                disabled
                  ? 'text-[var(--amp-semantic-text-muted)] opacity-40 cursor-not-allowed'
                  : 'hover:bg-[var(--amp-semantic-bg-sunken)] text-[var(--amp-semantic-text-primary)]',
                inRange &&
                  !isStart &&
                  !isEnd &&
                  'bg-[var(--amp-semantic-bg-accent,#6531FF)]/10',
                (isStart || isEnd) &&
                  'bg-[var(--amp-semantic-bg-accent,#6531FF)] text-white hover:opacity-90'
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select dates',
  hidePresets = false,
  presets,
  label,
  disabled = false,
  format = defaultFormat,
  className,
  id,
}) => {
  const isControlled = typeof value !== 'undefined';
  const [internal, setInternal] = useState<DateRange>(
    defaultValue ?? { from: null, to: null }
  );
  const range = isControlled ? value! : internal;

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(
    startOfMonth(range.from ?? new Date())
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const triggerId = id ?? `daterange-${generatedId}`;
  const popoverId = `${triggerId}-popover`;

  const presetList = useMemo(
    () => presets ?? buildDefaultPresets(),
    [presets]
  );

  const update = useCallback(
    (next: DateRange) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleSelect = useCallback(
    (date: Date) => {
      if (!range.from || (range.from && range.to)) {
        update({ from: date, to: null });
        return;
      }
      if (date < range.from) {
        update({ from: date, to: range.from });
        return;
      }
      update({ from: range.from, to: date });
    },
    [range, update]
  );

  // Close on outside click or escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const display =
    range.from && range.to
      ? `${format(range.from)} – ${format(range.to)}`
      : range.from
        ? `${format(range.from)} – …`
        : placeholder;

  const nextMonth = addMonths(viewMonth, 1);

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block w-full max-w-md', className)}
    >
      {label && (
        <label
          htmlFor={triggerId}
          className="block text-[14px] font-medium text-[var(--amp-semantic-text-primary)] mb-1.5"
        >
          {label}
        </label>
      )}
      <button
        type="button"
        ref={triggerRef}
        id={triggerId}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center justify-between gap-2 h-10 w-full px-3 rounded-[16px] text-[14px]',
          'bg-[var(--amp-semantic-bg-surface)] text-[var(--amp-semantic-text-primary)]',
          'border border-[var(--amp-semantic-border-default)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--amp-semantic-border-focus)]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn(!range.from && 'text-[var(--amp-semantic-text-muted)]')}>
          {display}
        </span>
        <svg
          className="w-4 h-4 text-[var(--amp-semantic-text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3M3 11h18M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
          />
        </svg>
      </button>

      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-label="Choose date range"
          className={cn(
            'absolute z-50 mt-2 left-0 flex',
            'bg-[var(--amp-semantic-bg-surface)] border border-[var(--amp-semantic-border-default)]',
            'rounded-[16px] shadow-xl p-4',
            // TODO(phase-a): adopt motion + shadow tokens once defined
          )}
          style={{ minWidth: 560 }}
        >
          {!hidePresets && (
            <div className="w-36 shrink-0 pr-3 mr-3 border-r border-[var(--amp-semantic-border-default)] flex flex-col gap-1">
              {presetList.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    const r = p.getRange();
                    if (r.from && r.to) {
                      update(r);
                      setViewMonth(startOfMonth(r.from));
                      setOpen(false);
                    } else {
                      update(r);
                    }
                  }}
                  className={cn(
                    'text-left text-[13px] px-2.5 py-1.5 rounded-[8px]',
                    'text-[var(--amp-semantic-text-secondary)] hover:bg-[var(--amp-semantic-bg-sunken)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, -1))}
                aria-label="Previous month"
                className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-[var(--amp-semantic-bg-sunken)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
                aria-label="Next month"
                className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-[var(--amp-semantic-bg-sunken)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amp-semantic-border-focus)]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <CalendarMonth
                monthStart={viewMonth}
                selection={range}
                hoverDate={hoverDate}
                onSelect={handleSelect}
                onHover={setHoverDate}
                minDate={minDate}
                maxDate={maxDate}
              />
              <CalendarMonth
                monthStart={nextMonth}
                selection={range}
                hoverDate={hoverDate}
                onSelect={handleSelect}
                onHover={setHoverDate}
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DateRangePicker.displayName = 'DateRangePicker';
