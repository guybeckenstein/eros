import { createFormHook } from '@tanstack/react-form';

import { FormCheckbox, FormTextField } from '@/components/ui/form';

import { fieldContext, formContext } from './form-context';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField: FormTextField,
    Checkbox: FormCheckbox,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
