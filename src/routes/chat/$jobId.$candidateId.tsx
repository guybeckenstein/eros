import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

import { Fragment, useState } from 'react';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Tooltip } from '@mui/material';
import {
  ChevronLeft,
  Clock,
  Copy,
  Download,
  Linkedin,
  Send,
  Trash,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { VerticalDividerIcon } from '@/assets/icons/VerticalDividerIcon';
import { ChatPopover } from '@/components/chat/ChatPopover';
import { SortableStage } from '@/components/chat/SortableStage';
import { SocialLink } from '@/components/discover/SocialLink';
import { Avatar } from '@/components/profile/Avatar';
import { InformationIcon } from '@/components/ui/icons';
import { TextField } from '@/components/ui/inputs';
import {
  addMessage,
  addNote,
  chatDetailQueryOptions,
  deleteNote,
  deleteStage,
  fetchAlternativeRoles,
  updateJobSeekerStatus,
} from '@/server/general/chat-queries';
import { RECRUITER_DAYS_TO_RESPOND } from '@/shared/configurations/configuration';
import { calculateTimeDifference } from '@/shared/mapping/time';

export const Route = createFileRoute('/chat/$jobId/$candidateId')({
  component: ChatPage,
});

function ChatPage() {
  const queryClient = useQueryClient();
  const { jobId, candidateId } = Route.useParams();
  const jobIdNumeric = Number(jobId);
  const candidateIdNumeric = Number(candidateId);

  const detailQueryKey = ['chats', 'detail', jobIdNumeric, candidateIdNumeric];
  const listQueryKey = ['chat', 'list'];

  const { data } = useSuspenseQuery(
    chatDetailQueryOptions(jobIdNumeric, candidateIdNumeric, listQueryKey),
  );

  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: detailQueryKey,
      });
      queryClient.invalidateQueries({ queryKey: listQueryKey });
      setNoteInput('');
    },
  });

  const setFreezeAndActivityMutation = useMutation({
    mutationFn: updateJobSeekerStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: detailQueryKey,
      });
      queryClient.invalidateQueries({ queryKey: listQueryKey });
    },
  });

  const addMessageMutation = useMutation({
    mutationFn: addMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: detailQueryKey,
      });
      queryClient.invalidateQueries({ queryKey: listQueryKey });
      setMessageInput('');
    },
  });

  const [noteInput, setNoteInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const isFrozen = data.candidate.isFrozen;
  const [removeNoteId, setRemoveNoteId] = useState(0);
  const [removeStageId, setRemoveStageId] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    const mailElement = document.getElementById('seeker-mail');
    if (!mailElement) return;

    await navigator.clipboard.writeText(mailElement.textContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const BUTTONS = [
    {
      text: 'Move Forward',
      className: 'bg-neutral-900 text-white',
      onClick: () =>
        setFreezeAndActivityMutation.mutate({
          jobId: jobIdNumeric,
          candidateId: candidateIdNumeric,
          isFrozen: isFrozen,
          isActive: true,
          stageId: data.stages[data.candidate.currentStage - 1].stageId,
          nextStageId: data.stages[data.candidate.currentStage].stageId,
        }),
    },
    {
      text: !isFrozen ? 'Freeze' : 'Unfreeze',
      className: 'bg-white text-current',
      onClick: () =>
        setFreezeAndActivityMutation.mutate({
          jobId: jobIdNumeric,
          candidateId: candidateIdNumeric,
          isFrozen: !isFrozen,
          isActive: true,
        }),
    },
    {
      text: 'Reject',
      className: 'bg-white text-current',
      onClick: () =>
        setFreezeAndActivityMutation.mutate({
          jobId: jobIdNumeric,
          candidateId: candidateIdNumeric,
          isFrozen: !isFrozen,
          isActive: false,
        }),
    },
    {
      text: 'Alternative Roles',
      className: 'bg-white text-current',
      onClick: async () => {
        console.log(
          await queryClient.ensureQueryData(
            fetchAlternativeRoles(jobIdNumeric, queryClient),
          ),
        );
      },
    },
  ];

  const onEnterEvent = () => {
    if (!messageInput.trim()) {
      return;
    }
    addMessageMutation.mutate({
      jobId: jobIdNumeric,
      text: messageInput,
    });
  };

  // Percentage bar
  const splitPoint =
    100 - (data.candidate.responseTimeDays / RECRUITER_DAYS_TO_RESPOND) * 100;
  const inversePoint = 100 - splitPoint;

  const [localStages, setLocalStages] = useState(data.stages);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLocalStages((items) => {
        const oldIndex = items.findIndex((i) => i.stageId === active.id);
        const newIndex = items.findIndex((i) => i.stageId === over.id);

        const newArray = arrayMove(items, oldIndex, newIndex);

        // TODO: In the future, trigger your updateStageIndexMutation here
        // using newArray to get the new order
        return newArray;
      });
    }
  };

  return (
    <div className="grid w-full grid-flow-col grid-cols-[2fr_6fr_2fr] text-current">
      {/* Left sidebar */}
      <div className="flex flex-col gap-6 bg-white p-6 pt-10">
        <Link to="/recruiter/jobs/$id" params={{ id: jobId }}>
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
            src={data.candidate.candidateProfileImageUrl}
            alt={`${data.candidate.fullName} profile pic`}
            name={data.candidate.fullName}
            size="size-16"
          />
          <SocialLink
            href="https://google.com"
            icon={<Linkedin size="20" />}
            title="LinkedIn"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{data.candidate.fullName}</h2>
          <h3 className="mt-1 text-lg text-neutral-500">
            {data.candidate.jobTitle}
          </h3>
          <h3 className="text-lg text-neutral-500">
            {data.candidate.phoneNumber}
          </h3>
          <div className="flex w-full items-center justify-between">
            <h3 id="seeker-mail" className="text-lg text-neutral-500">
              {data.candidate.emailAddress}
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
              onClick={() =>
                console.log('TODO: download resume', data.candidate.resumeId)
              }
            />
          </div>
        </div>
        <div className="h-px w-full bg-neutral-200" />
        <div className="space-y-4">
          {BUTTONS.map((b) => (
            <button
              key={b.text}
              className={twMerge(
                'w-full cursor-pointer rounded-lg border border-neutral-900 px-3 py-2 text-lg font-medium',
                b.className,
              )}
              onClick={b.onClick}
            >
              {b.text}
            </button>
          ))}
        </div>
        {!isFrozen && (
          <>
            <div className="h-px w-full bg-neutral-200" />
            <div className="relative flex h-24 w-full flex-col justify-between rounded-lg border border-neutral-900 bg-white px-3 py-2 text-lg font-medium text-current">
              <div className="flex items-center justify-between">
                <h3>Response time</h3>
                <button
                  className="cursor-pointer space-x-2 text-base text-current"
                  onClick={() =>
                    setFreezeAndActivityMutation.mutate({
                      jobId: jobIdNumeric,
                      candidateId: candidateIdNumeric,
                      isFrozen: isFrozen,
                      isActive: true,
                      daysToRespondDays: data.candidate.responseTimeDays,
                    })
                  }
                >
                  <span>+</span>
                  <span className="underline underline-offset-2">
                    Add 7 days
                  </span>
                </button>
              </div>
              <div className="space-y-1">
                <div className="space-x-2">
                  <span className="text-xl font-extrabold">
                    {data.candidate.responseTimeDays}
                  </span>
                  <span className="text-base font-medium text-neutral-500">
                    days left
                  </span>
                </div>
                <div
                  className="h-1.5 w-full rounded"
                  style={{
                    background: `linear-gradient(to right, #171717 ${inversePoint}%, #d4d4d4 ${inversePoint}%)`,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {/* Main content */}
      <div className="flex flex-col justify-between space-y-4 p-4">
        <div className="space-y-2">
          {/* Slider */}
          <h4 className="text-center text-xl font-light text-neutral-500">
            {data.firstMessageDate}
          </h4>
          <div className="mb-20 w-full space-y-6 rounded-xl bg-white px-6 py-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold text-current">
                Interview Process
                <Tooltip
                  title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, -6],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <InformationIcon
                    size="22"
                    strokeWidth="1.5"
                    className="ml-2 inline text-neutral-600"
                    onClick={() => console.log('information clicked')}
                  />
                </Tooltip>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Clock size="20" />
                  <small className="text-sm text-neutral-400">
                    Last Update: {data.lastUpdatedStages}
                  </small>
                </div>
                <VerticalDividerIcon
                  className="h-6 w-px fill-none"
                  pathClassName="fill-neutral-300"
                />
                <div className="flex items-center justify-between">
                  <button className="cursor-pointer space-x-1 text-base text-current">
                    <span>+</span>
                    <span
                      className="underline underline-offset-2"
                      onClick={() =>
                        console.log('TODO: add another stage popup')
                      }
                    >
                      Add another stage
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localStages.map((s) => s.stageId)}
                  strategy={horizontalListSortingStrategy}
                >
                  {localStages.map((s, index) => (
                    <Fragment key={s.stageId}>
                      <SortableStage
                        stage={s}
                        currentStageNumber={data.candidate.currentStage}
                        deleteStage={() => deleteStage({ stageId: s.stageId })}
                        removeStageId={removeStageId}
                        setRemoveStageId={setRemoveStageId}
                        detailQueryKey={detailQueryKey}
                      />
                      {/* The line is now a static neighbor, not a child of the sortable */}
                      {index < localStages.length - 1 && (
                        <div className="h-0.5 w-14 shrink-0 rounded-md bg-neutral-300" />
                      )}
                    </Fragment>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
          {/* Chat messages */}
          {!isFrozen ? (
            <div className="space-y-4 px-4">
              {data.messages.map((m, i) => (
                <div
                  key={i}
                  className={twMerge(
                    'mb-4 w-1/2',
                    m.isRecruiter ? 'ms-auto' : 'me-auto', // Moves the 50% box to the right or left
                  )}
                >
                  <div
                    className={twMerge(
                      'flex items-start justify-start gap-4',
                      m.isRecruiter ? 'flex-row-reverse' : '',
                    )}
                  >
                    <Avatar
                      src={m.profileImageUrl}
                      alt={`${m.senderFullName} image`}
                      name={m.senderFullName}
                      size="size-10"
                    />
                    <div
                      className={twMerge(
                        'w-full space-y-1 rounded-xl border px-3 py-1',
                        m.isRecruiter
                          ? 'rounded-tr-none bg-neutral-200'
                          : 'rounded-tl-none bg-white shadow-md',
                      )}
                    >
                      <p className="text-current">{m.text}</p>
                      <small
                        className={
                          m.isRecruiter ? 'text-current' : 'text-neutral-500'
                        }
                      >
                        {m.dateSentStr}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-center">
              Unfreeze candidate to see chat again...
            </h1>
          )}
        </div>

        {!isFrozen && (
          <TextField
            placeholder="Type a message..."
            fieldClassName="w-full gap-0 border-none"
            wrapperClassName="outline-neutral-400 rounded-xl bg-white"
            value={messageInput}
            endIcon={
              <Send
                size="24"
                className="cursor-pointer"
                onClick={onEnterEvent}
              />
            }
            onChange={(e) => setMessageInput(e.target.value)}
            onEnter={onEnterEvent}
          />
        )}
      </div>
      {/* Right sidebar */}
      <div className="w-full space-y-4 bg-white p-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        {data.notes.map((n) => (
          <div
            key={n.noteId}
            className="relative rounded-xl bg-neutral-100 px-2 py-1 text-start text-lg"
          >
            <div className="w-5/6 space-y-2">
              <ChatPopover
                variables={{ noteId: n.noteId }}
                mutationFn={deleteNote}
                queryKeysToInvalidate={[
                  detailQueryKey.map((x) => x.toString()),
                ]}
                isConfirmAction={removeNoteId === n.noteId}
                title="Are you sure you want to delete this note?"
                idPrefix="delete"
                onCancel={() => setRemoveNoteId(0)}
                menuOptions={[
                  {
                    id: 'delete',
                    label: 'Delete Forever',
                    startIcon: <Trash size="20" className="cursor-pointer" />,
                    onClick: (noteId: number) => setRemoveNoteId(noteId),
                  },
                ]}
                attributeId={n.noteId}
                className="absolute top-2 right-2"
              />
              <p>{n.text}</p>
              <small className="text-neutral-700">
                Added {calculateTimeDifference(n.dateUploaded)}
              </small>
            </div>
          </div>
        ))}
        {addNoteMutation.isPending
          ? 'Adding note'
          : addNoteMutation.isError && 'Failed to add note... Try again later'}
        <TextField
          placeholder="Add a note..."
          fieldClassName="w-full gap-0"
          wrapperClassName="outline-neutral-400 rounded-xl bg-white"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onEnter={() => {
            if (!noteInput.trim()) {
              return;
            }
            addNoteMutation.mutate({
              candidateId: candidateIdNumeric,
              text: noteInput,
            });
          }}
        />
      </div>
    </div>
  );
}
