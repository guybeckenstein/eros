import { useFieldContext } from '@/components/hooks/form-context';

import { Checkbox, CheckboxProps } from '../inputs';

type FormCheckboxProps = CheckboxProps;

export function FormCheckbox(props: FormCheckboxProps) {
  const field = useFieldContext<boolean>();

  return (
    <Checkbox
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
