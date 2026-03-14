import type { ComponentProps } from 'react';

import { useFieldContext } from '@/components/hooks/form-context';

import { Toggle } from '../inputs';

type FormToggleProps = ComponentProps<typeof Toggle>;

export function FormToggle(props: FormToggleProps) {
  const field = useFieldContext<boolean>();

  return (
    <Toggle
      {...props}
      checked={Boolean(field.state.value)}
      setChecked={(next) => {
        const resolved =
          typeof next === 'function' ? next(Boolean(field.state.value)) : next;
        field.handleChange(Boolean(resolved));
      }}
    />
  );
}
