import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XIcon } from 'lucide-react';

import { classNames } from '@/helpers/functions';

type ModalProps = React.ComponentProps<typeof Dialog> & {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  closeButton?: boolean;
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  className,
  closeButton = true,
  ...props
}: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={'relative z-50'}
      {...props}
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className={classNames(
            'relative overflow-auto rounded-[20px] bg-white py-5',
            className,
          )}
        >
          <DialogTitle className="inline-flex w-full items-center justify-between border-b border-zinc-400 bg-white px-6 pb-5">
            <span className="justify-start text-2xl font-semibold tracking-wide text-black">
              {title}
            </span>
            {closeButton && (
              <button onClick={() => onClose(false)}>
                <XIcon className="cursor-pointer" />
              </button>
            )}
          </DialogTitle>
          <div className="px-6 pt-5">{props.children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
