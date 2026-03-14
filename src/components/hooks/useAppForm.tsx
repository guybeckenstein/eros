import { createFormHook } from '@tanstack/react-form';

import {
  FormCheckbox,
  FormRangeSlider,
  FormSelect,
  FormTextArea,
  FormTextField,
  FormToggle,
} from '@/components/ui/form';

import { fieldContext, formContext } from './form-context';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField: FormTextField,
    TextArea: FormTextArea,
    Checkbox: FormCheckbox,
    Toggle: FormToggle,
    RangeSlider: FormRangeSlider,
    Select: FormSelect,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
