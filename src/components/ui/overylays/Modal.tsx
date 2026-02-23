import { Fragment } from 'react';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from '@headlessui/react';
import { XIcon } from 'lucide-react';

import { classNames } from '@/helpers/functions';

type ModalProps = React.ComponentProps<typeof Dialog> & {
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  childrenClassName?: string;
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
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      </TransitionChild>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
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
            <div className={classNames('px-6 pt-5', props.childrenClassName)}>
              {props.children}
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  );
};
