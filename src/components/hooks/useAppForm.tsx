import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './form-context';

import { FormTextField } from '../ui/form/TextField';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField: FormTextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
