import { Link, createFileRoute } from '@tanstack/react-router';

import { useState } from 'react';

import {
  Check,
  ChevronLeft,
  Clock,
  Copy,
  Download,
  Ellipsis,
  EllipsisVertical,
  Linkedin,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { VerticalDividerIcon } from '@/assets/icons/VerticalDividerIcon';
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
    <div className="grid w-full grid-flow-col grid-cols-[2fr_6fr_2fr] text-current">
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
      <div className="flex flex-col justify-between space-y-4 p-4">
        <div>
          {/* Slider */}
          <div className="w-full space-y-6 rounded-xl bg-white px-6 py-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold text-current">
                Interview Process
                <InformationIcon
                  size="22"
                  strokeWidth="1.5"
                  className="ml-2 inline text-neutral-600"
                  onClick={() => console.log('information clicked')}
                />
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Clock size="20" />
                  <small className="text-sm text-neutral-400">
                    Last Update: today at 9:30
                  </small>
                </div>
                <VerticalDividerIcon
                  className="h-6 w-px fill-none"
                  pathClassName="fill-neutral-300"
                />
                <div className="flex items-center justify-between">
                  <button className="space-x-1 text-base text-current">
                    <span>+</span>
                    <span className="underline underline-offset-2">
                      Add 7 days
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative flex h-15 w-45 rounded-md border border-neutral-400">
                <div className="my-auto ms-2 flex items-center gap-2">
                  <Ellipsis
                    size="24"
                    className="absolute top-0 right-1 text-neutral-500"
                  />
                  <div className="flex size-10 rounded-full bg-black">
                    <Check
                      size="24"
                      strokeWidth="3"
                      className="m-auto text-white"
                    />
                  </div>
                  <p className="w-8 text-base font-semibold">Phone Interview</p>
                </div>
              </div>
              <div className="my-auto h-1 w-8 rounded-md bg-neutral-300"></div>
              <div className="relative flex h-15 w-45 rounded-md border border-neutral-400">
                <div className="my-auto ms-2 flex items-center gap-2">
                  <Ellipsis
                    size="24"
                    className="absolute top-0 right-1 text-neutral-500"
                  />
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <p className="m-auto text-xl text-current">2</p>
                  </div>
                  <p className="w-8 text-base">Phone Interview</p>
                </div>
              </div>
              <div className="my-auto h-1 w-8 rounded-md bg-neutral-300"></div>
              <div className="relative flex h-15 w-45 rounded-md border border-neutral-400">
                <div className="my-auto ms-2 flex items-center gap-2">
                  <Ellipsis
                    size="24"
                    className="absolute top-0 right-1 text-neutral-500"
                  />
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <p className="m-auto text-xl text-current">3</p>
                  </div>
                  <p className="w-8 text-base">Phone Interview</p>
                </div>
              </div>
            </div>
          </div>
          <h4 className="text-center text-xl font-light text-neutral-500">
            Today at 9:30 AM
          </h4>
        </div>

        <TextField
          placeholder="Type a message..."
          fieldClassName="w-full gap-0 border-none"
          wrapperClassName="outline-neutral-400 rounded-xl bg-white"
        />
      </div>
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
