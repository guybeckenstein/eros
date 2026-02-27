import { TextField, TextFieldProps } from '../inputs';

type FormTextFieldProps = TextFieldProps;

export function FormTextField({ label, placeholder }: FormTextFieldProps) {
  return <TextField label={label} placeholder={placeholder} required />;
}
