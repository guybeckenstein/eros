import { useFieldContext } from '@/components/hooks/form-context';

import { RangeSlider, RangeSliderProps } from '../inputs';

export function FormRangeSlider(props: RangeSliderProps) {
  const field = useFieldContext<[number, number]>();

  return (
    <RangeSlider
      {...props}
      value={field.state.value}
      onValueChange={(value, activeThumb, event) => {
        field.handleChange(value);
        props.onValueChange?.(value, activeThumb, event);
      }}
    />
  );
}
