import React, { useCallback, useMemo } from 'react';
import { cn } from '../../lib/cn';

export interface SliderMark {
  value: number;
  label: string;
}

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  marks?: SliderMark[];
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      marks,
      showValue = false,
      formatValue,
      className,
      min = 0,
      max = 100,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<number>(
      (defaultValue as number) ?? (min as number)
    );

    const currentValue = value !== undefined ? (value as number) : internalValue;
    const minNum = min as number;
    const maxNum = max as number;

    const percentage = useMemo(() => {
      if (maxNum === minNum) return 0;
      return ((currentValue - minNum) / (maxNum - minNum)) * 100;
    }, [currentValue, minNum, maxNum]);

    const displayValue = useMemo(() => {
      if (formatValue) return formatValue(currentValue);
      return String(currentValue);
    }, [currentValue, formatValue]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onChange?.(e);
      },
      [value, onChange]
    );

    const getMarkPosition = useCallback(
      (markValue: number) => {
        if (maxNum === minNum) return 0;
        return ((markValue - minNum) / (maxNum - minNum)) * 100;
      },
      [minNum, maxNum]
    );

    return (
      <div className={cn('relative w-full', className)}>
        {showValue && (
          <div
            className="absolute -top-7 text-xs font-medium text-violet-600 -translate-x-1/2 pointer-events-none"
            style={{ left: `${percentage}%` }}
          >
            {displayValue}
          </div>
        )}

        <div className="relative">
          {/* Background track */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-stone-200 pointer-events-none" />

          {/* Filled track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-violet-600 pointer-events-none"
            style={{ width: `${percentage}%` }}
          />

          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            value={currentValue}
            onChange={handleChange}
            className={cn(
              'relative w-full h-1.5 appearance-none bg-transparent cursor-pointer z-10',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6',
              '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-600',
              '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
              '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-lg',
              '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6',
              '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-violet-600',
              '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white',
              '[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer',
              '[&::-moz-range-track]:bg-transparent',
              'focus-visible:outline-none',
              '[&::-webkit-slider-thumb]:focus-visible:ring-2 [&::-webkit-slider-thumb]:focus-visible:ring-violet-600/40',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            {...props}
          />
        </div>

        {marks && marks.length > 0 && (
          <div className="relative mt-2 w-full">
            {marks.map((mark) => {
              const pos = getMarkPosition(mark.value);
              return (
                <span
                  key={mark.value}
                  className="absolute text-xs text-stone-500 -translate-x-1/2"
                  style={{ left: `${pos}%` }}
                >
                  {mark.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
