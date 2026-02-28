import { Toggle } from '../inputs';

interface FormToggleProps {
  label?: string;
}

export function FormToggle({ label }: FormToggleProps) {
  return <Toggle />;
}
