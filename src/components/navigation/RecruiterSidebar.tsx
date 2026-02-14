import { useState } from 'react';

import { Building2, Copy, Mail, X } from 'lucide-react';

import { classNames } from '@/helpers/functions';

interface RecruiterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileButtonProps {
  key: string;
  label: string;
  className: string;
  onClick: () => void;
}

export function RecruiterSidebar({ isOpen, onClose }: RecruiterSidebarProps) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    const mailElement = document.getElementById('recruiter-mail');
    if (!mailElement) return;

    await navigator.clipboard.writeText(mailElement.textContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const RECRUITER_SIDEBAR_BUTTONS: ProfileButtonProps[] = [
    {
      key: 'profile-settings',
      label: 'Profile Settings',
      className: '',
      onClick: () => {},
    },
    {
      key: 'preferences',
      label: 'Preferences',
      className: '',
      onClick: () => {},
    },
    {
      key: 'help-and-support',
      label: 'Help & Support',
      className: '',
      onClick: () => {},
    },
    {
      key: 'logout',
      label: 'Logout',
      className:
        'font-medium text-red-600 underline underline-offset-2 transition-colors hover:text-red-800',
      onClick: () => console.log('Clicked logout button'),
    },
  ];
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-80 bg-white text-current shadow-lg transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 transition-colors hover:bg-neutral-100"
          >
            <X size="24" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-16 pr-2 pl-6">
          <div className="items-top flex gap-4 border-b border-neutral-200 pb-4">
            <div className="max-h-16 min-h-16 max-w-16 min-w-16 rounded-full bg-neutral-200" />
            <div>
              <h2 className="text-xl font-semibold">Bar Simon</h2>
              <small className="text-sm font-medium text-neutral-600">
                Senior Talent Acquisition
              </small>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">Contact Information</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail size="22" />
                <p id="recruiter-mail">Bar-simon@gmail.com</p>
                <div
                  className={`transition-opacity duration-300 ${
                    isCopied ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  {isCopied && (
                    <span className="ml-2 text-sm font-medium text-green-600">
                      Copied!
                    </span>
                  )}
                </div>
                <div
                  className={`transition-opacity duration-300 ${
                    !isCopied ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  {!isCopied && (
                    <Copy
                      size="18"
                      className="mx-1 cursor-pointer text-neutral-400"
                      onClick={handleCopy}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size="22" />
                <span>Meta</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium">About</h3>
            <p className="text-sm">
              Experienced Talent Acquisition professional with a passion for
              connecting people with opportunities that make an impact. At Meta,
              I focus on identifying and attracting top talent to help drive
              innovation and growth. I thrive on building strong relationships,
              streamlining hiring processes, and ensuring a seamless candidate
              experience.
            </p>
          </div>

          {/* Menu Items */}
          <div className="absolute bottom-4 left-6 space-y-2">
            {RECRUITER_SIDEBAR_BUTTONS.map((b) => (
              <button
                key={b.key}
                className={classNames(
                  'w-full cursor-pointer rounded-md py-2 text-left',
                  b.className,
                )}
                onClick={b.onClick}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
