import { ComponentPropsWithoutRef } from 'react';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { EllipsisVertical } from 'lucide-react';

import { ConfirmAction } from '@/components/jobs/ConfirmAction';
import { DropdownOptions } from '@/components/jobs/DropdownOptions';
import { MenuOption } from '@/components/jobs/JobRow';

interface ChatPopoverProps<TVariables> extends ComponentPropsWithoutRef<'div'> {
  // Data & Logic
  variables: TVariables;
  mutationFn: (variables: TVariables) => Promise<any>;
  queryKeysToInvalidate?: string[][]; // The key to invalidate on success

  isConfirmAction: boolean;
  title: string;
  idPrefix: string;
  onCancel: () => void;

  menuOptions: MenuOption[];
  attributeId: number;
}

export function ChatPopover<TVariables>({
  variables,
  mutationFn,
  queryKeysToInvalidate,
  isConfirmAction,
  title,
  idPrefix,
  onCancel,
  menuOptions,
  attributeId,
  ...props
}: ChatPopoverProps<TVariables>) {
  return (
    <Popover data-slot="dropdown" {...props}>
      <PopoverButton aria-label="Open job row actions">
        <EllipsisVertical
          size="24"
          className="cursor-pointer text-neutral-500"
        />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom end"
        transition
        className="original-top mt-2 rounded-sm border border-neutral-200 bg-white transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
      >
        {({ close }) => (
          <>
            {isConfirmAction === true && (
              <ConfirmAction
                title={title}
                idPrefix={idPrefix}
                variables={variables}
                mutationFn={mutationFn}
                queryKeysToInvalidate={queryKeysToInvalidate}
                onCancel={onCancel}
                close={close}
              />
            )}
            {isConfirmAction === false && (
              <DropdownOptions
                options={menuOptions}
                attributeId={attributeId}
              />
            )}
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
}
