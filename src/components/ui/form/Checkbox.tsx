import { Checkbox, CheckboxProps } from '../inputs';

type FormCheckboxProps = CheckboxProps;

export function FormCheckbox({ label }: FormCheckboxProps) {
  return <Checkbox label={label} />;
}
