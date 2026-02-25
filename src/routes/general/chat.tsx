import { Link, createFileRoute } from '@tanstack/react-router';

import { useState } from 'react';

import {
  ChevronLeft,
  Copy,
  Download,
  EllipsisVertical,
  Linkedin,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { SocialLink } from '@/components/discover/SocialLink';
import { Avatar } from '@/components/profile/Avatar';
import { InformationIcon } from '@/components/ui/icons';
import { TextField } from '@/components/ui/inputs';

export const Route = createFileRoute('/general/chat')({
  component: ChatPage,
});

function ChatPage() {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    const mailElement = document.getElementById('seeker-mail');
    if (!mailElement) return;

    await navigator.clipboard.writeText(mailElement.textContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const NOTES = [
    {
      text: 'Strong technical background in React and Node.js',
      added: '5 mins ago',
    },
    { text: 'He was abroad one year for working at Wix', added: '5 mins ago' },
  ];

  return (
    <div className="grid w-full grid-flow-col grid-cols-[2fr_7fr_2fr] text-current">
      {/* Left sidebar */}
      <div className="flex flex-col gap-6 bg-white p-6 pt-10">
        <Link to="/recruiter/jobs">
          <div className="flex items-center space-x-2 justify-self-start text-lg">
            <ChevronLeft
              size="22"
              strokeWidth="2"
              className="inline text-current"
            />
            <span>Back</span>
          </div>
        </Link>
        <div className="flex justify-between">
          <Avatar
            src={null}
            alt={`Guy Beckenstein profile pic`}
            name="Guy Beckenstein"
            size="size-16"
          />
          <SocialLink
            href="https://google.com"
            icon={<Linkedin size="20" />}
            title="LinkedIn"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Israel Israeli</h2>
          <h3 className="mt-1 text-xl font-light text-neutral-500">
            Product Manager
          </h3>
          <h3 className="text-xl font-light text-neutral-500">052-285-6574</h3>
          <div className="flex w-full items-center justify-between">
            <h3
              id="seeker-mail"
              className="text-xl font-light text-neutral-500"
            >
              email@gmail.com
            </h3>
            <Copy
              size="18"
              className={twMerge(
                'mx-1 cursor-pointer transition-colors',
                isCopied ? 'text-green-600' : 'text-current',
              )}
              onClick={handleCopy}
            />
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg border border-neutral-400 px-2 py-1 text-current">
            <p className="text-lg font-bold">View resume</p>
            <Download
              size="32"
              className="cursor-pointer border-l border-l-neutral-400 pl-2 text-current"
            />
          </div>
        </div>
        <div className="h-px w-full bg-neutral-200" />
        <div className="space-y-4">
          <button className="w-full rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-2 text-lg font-medium text-white">
            Move Forward
          </button>
          <button className="w-full rounded-lg border border-neutral-900 bg-white px-3 py-2 text-lg font-medium text-current">
            Freeze
          </button>
          <button className="w-full rounded-lg border border-neutral-900 bg-white px-3 py-2 text-lg font-medium text-current">
            Reject
          </button>
          <button className="w-full rounded-lg border border-neutral-900 bg-white px-3 py-2 text-lg font-medium text-current">
            Alternative Role
          </button>
        </div>
        <div className="h-px w-full bg-neutral-200" />
        <div className="relative flex h-24 w-full flex-col justify-between rounded-lg border border-neutral-900 bg-white px-3 py-2 text-lg font-medium text-current">
          <div className="flex items-center justify-between">
            <h3>Response time</h3>
            <button className="space-x-2 text-base text-current">
              <span>+</span>
              <span className="underline underline-offset-2">Add 7 days</span>
            </button>
          </div>
          <div className="space-y-1">
            <div className="space-x-2">
              <span className="text-xl font-extrabold">7</span>
              <span className="text-base font-medium text-neutral-500">
                days left
              </span>
            </div>
            <div className="h-1.5 w-full rounded bg-neutral-900"></div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="">Center</div>
      {/* Right sidebar */}
      <div className="w-full space-y-4 bg-white p-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        {NOTES.map((n) => (
          <div className="relative rounded-xl bg-neutral-100 px-2 py-1 text-start text-lg">
            <div className="w-5/6 space-y-2">
              <EllipsisVertical
                size="20"
                className="absolute top-2 right-2 cursor-pointer text-neutral-400"
              />
              <p>{n.text}</p>
              <small className="text-neutral-700">Added {n.added}</small>
            </div>
          </div>
        ))}
        <TextField
          placeholder="Add a note..."
          fieldClassName="w-full gap-0"
          wrapperClassName="outline-neutral-400 rounded-xl"
        />
      </div>
    </div>
  );
}
