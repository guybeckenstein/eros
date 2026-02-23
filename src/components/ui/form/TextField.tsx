import { TextField } from '../inputs';

interface FormTextFieldProps {
  label: string;
}

export function FormTextField({ label }: FormTextFieldProps) {
  return <TextField label={label} required />;
}
