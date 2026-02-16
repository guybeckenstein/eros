import { ComponentProps } from 'react';

import { ClickableButton } from '@/components/ui/Buttons/ClickableButton';
import { classNames } from '@/helpers/functions';

export default function ExitDialog({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={classNames(
        'flex flex-col items-center gap-8 text-justify text-neutral-900',
        className,
      )}
      {...props}
    >
      <h1 className="text-2xl font-bold">Are you sure you want to exit?</h1>
      <p className="w-1/2">
        If you leave now, your job creation will be deleted.
      </p>
      <div className="flex items-center gap-10">
        <ClickableButton
          className="w-32 min-w-20 p-4"
          label="Cancel"
          onClick={() => console.log('Cancel clicked')}
        />
        <ClickableButton
          className="w-32 min-w-20 p-4"
          label="Exit"
          onClick={() => console.log('Exit clicked')}
        />
      </div>
    </div>
  );
}
