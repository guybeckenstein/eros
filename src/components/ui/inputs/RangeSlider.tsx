import * as React from 'react';
import { forwardRef } from 'react';

import { Field, Label } from '@headlessui/react';

import { classNames } from '@/helpers/functions';

type NativeSliderProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
>;

type RangeValue = [number, number];

export type RangeSliderProps = NativeSliderProps & {
  label?: string;
  required?: boolean;
  wrapperClassName?: string;
  sliderClassName?: string;
  valueLabelClassName?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: RangeValue;
  defaultValue?: RangeValue;
  showValue?: boolean;
  formatValue?: (value: number) => React.ReactNode;
  onValueChange?: (
    value: RangeValue,
    activeThumb: 'min' | 'max',
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  (
    {
      className,
      label,
      required,
      wrapperClassName,
      sliderClassName,
      valueLabelClassName,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = [min, max],
      showValue = true,
      formatValue,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const numericMin = Number(min);
    const numericMax = Number(max);
    const numericStep = Math.max(Number(step), 0.000001);

    const clamp = (nextValue: number) =>
      Math.min(Math.max(nextValue, numericMin), numericMax);

    const normalizeRange = React.useCallback(
      (nextRange: RangeValue): RangeValue => {
        const start = clamp(nextRange[0]);
        const end = clamp(nextRange[1]);
        return start <= end ? [start, end] : [end, start];
      },
      [numericMin, numericMax],
    );

    const [internalValue, setInternalValue] = React.useState<RangeValue>(() =>
      normalizeRange(defaultValue),
    );

    const currentValue = normalizeRange(isControlled ? value : internalValue);
    const [rangeStart, rangeEnd] = currentValue;

    const denominator = numericMax - numericMin;
    const startPercent =
      denominator <= 0 ? 0 : ((rangeStart - numericMin) / denominator) * 100;
    const endPercent =
      denominator <= 0 ? 0 : ((rangeEnd - numericMin) / denominator) * 100;

    const renderedStart = formatValue ? formatValue(rangeStart) : rangeStart;
    const renderedEnd = formatValue ? formatValue(rangeEnd) : rangeEnd;

    const updateValue = (
      nextRange: RangeValue,
      activeThumb: 'min' | 'max',
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const normalizedRange = normalizeRange(nextRange);

      if (!isControlled) {
        setInternalValue(normalizedRange);
      }

      onValueChange?.(normalizedRange, activeThumb, event);
    };

    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextStart = Math.min(
        Number(event.target.value),
        rangeEnd - numericStep,
      );
      updateValue([nextStart, rangeEnd], 'min', event);
    };

    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextEnd = Math.max(
        Number(event.target.value),
        rangeStart + numericStep,
      );
      updateValue([rangeStart, nextEnd], 'max', event);
    };

    return (
      <Field className="inline-flex flex-col items-start justify-start gap-2 self-stretch">
        {label ? (
          <div className="inline-flex w-full items-center justify-between gap-2">
            <Label className="justify-start text-base font-semibold tracking-wide text-black">
              {label}
              {required && '*'}
            </Label>
            {showValue ? (
              <span
                className={classNames(
                  'text-base font-semibold tracking-wide text-black',
                  valueLabelClassName,
                )}
              >
                {renderedStart} - {renderedEnd}
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          className={classNames(
            'inline-flex items-center justify-start gap-1.5 self-stretch rounded-md p-2.5 outline-1 -outline-offset-1 outline-black',
            wrapperClassName,
          )}
        >
          <div className="relative h-6 w-full">
            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-zinc-300" />
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-black"
              style={{
                left: `${startPercent}%`,
                right: `${100 - endPercent}%`,
              }}
            />

            <input
              ref={ref}
              type="range"
              min={numericMin}
              max={numericMax}
              step={numericStep}
              value={rangeStart}
              onChange={handleMinChange}
              className={classNames(
                'pointer-events-none absolute top-0 left-0 h-6 w-full cursor-pointer appearance-none bg-transparent outline-0',
                '[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent',
                '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black',
                '[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
                '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-black',
                className,
                sliderClassName,
              )}
              {...props}
            />

            <input
              type="range"
              min={numericMin}
              max={numericMax}
              step={numericStep}
              value={rangeEnd}
              onChange={handleMaxChange}
              className={classNames(
                'pointer-events-none absolute top-0 left-0 h-6 w-full cursor-pointer appearance-none bg-transparent outline-0',
                '[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent',
                '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black',
                '[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
                '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-black',
                className,
                sliderClassName,
              )}
              {...props}
            />
          </div>
        </div>
      </Field>
    );
  },
);
