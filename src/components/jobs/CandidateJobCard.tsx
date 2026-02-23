import { Briefcase, Lightbulb, MapPin, Timer, User } from 'lucide-react';

import { JobsPopover } from '@/components/jobs/JobsPopover';
import { ResumeIcon } from '@/components/ui/icons/ResumeIcon';
import { removeCandidateFromJob } from '@/server/recruiter/jobs-queries';
import { CandidateJobDetails } from '@/shared/types/candidates';

interface CandidateJobCardProps {
  candidate: CandidateJobDetails;
  jobId: number;
  stages: number;
  isSelected: boolean;
  onToggleSelection: () => void;
  isConfirmingDelete: boolean;
  onSetRemoveId: (id: number | null) => void;
  onViewResume: (resumeId: number) => void;
  onViewProfile: (candidateId: number) => void;
  dropdownOptions: any[];
}

export function CandidateJobCard({
  candidate,
  jobId,
  stages,
  isSelected,
  onToggleSelection,
  isConfirmingDelete,
  onSetRemoveId,
  onViewResume,
  onViewProfile,
  dropdownOptions,
}: CandidateJobCardProps) {
  return (
    <div
      className="relative z-0 grid cursor-pointer grid-cols-[4fr_4fr_2fr] items-start rounded bg-white px-2 py-3"
      onClick={() => console.log('TODO: go to chat with:', candidate.id, jobId)}
    >
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation(); // Prevents clicking the checkbox from opening the chat
            onToggleSelection();
          }}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2"
        />
        <div className="relative ml-8 flex size-16">
          {candidate.profilePicUrl ? (
            <img
              className="object-fit m-auto size-12 rounded-full border"
              alt={`${candidate.fullName} profile pic`}
              src={candidate.profilePicUrl}
            />
          ) : (
            <div className="m-auto size-12 rounded-full border bg-neutral-700" />
          )}
          <div className="absolute right-0 -bottom-2 flex size-8 place-items-center justify-center gap-0.5 rounded-full bg-sky-950 text-white">
            <span className="text-xs font-semibold">
              {candidate.matchScore}
            </span>
            <small className="text-[8px]">%</small>
          </div>
        </div>

        <div className="flex max-w-110 flex-col gap-1">
          <p className="space-x-1">
            <b className="cursor-auto">{candidate.fullName}</b>
            <small className="cursor-auto text-neutral-500">
              {candidate.jobTitle}
            </small>
          </p>
          <div className="flex items-center space-x-1 text-xs text-neutral-400">
            <MapPin size="14" />{' '}
            <span className="cursor-auto">{candidate.city}</span>
            <Briefcase size="14" />{' '}
            <span className="cursor-auto">{candidate.jobType}</span>
            <Lightbulb size="14" />{' '}
            <span className="cursor-auto">
              {candidate.yearsOfExperience} years exp.
            </span>
          </div>
          {candidate.totalChatMessages && (
            <div className="flex cursor-auto items-center justify-between rounded-tl-xl rounded-r-lg bg-neutral-200 px-2 py-1 text-xs">
              <span>{candidate.recentChatMessage}</span>
              <span className="flex size-5 place-items-center justify-center rounded-full bg-neutral-300 text-sm font-semibold">
                {candidate.totalChatMessages}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-30 space-y-1 text-sky-950">
          <p className="cursor-auto text-sm font-medium">
            STAGE {candidate.currentStage}/{stages}
          </p>
          <div className="flex h-2 w-full items-center gap-2">
            {Array.from({ length: stages }).map((_, i) => (
              <div
                key={i}
                className={`h-full flex-1 rounded-lg ${i < candidate.currentStage ? 'bg-sky-950' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
        {candidate.totalChatMessages && !isNaN(candidate.daysUntilRespond) && (
          <div className="w-30 space-y-1 text-emerald-600">
            <div className="flex items-center gap-2">
              <Timer size="14" strokeWidth="3" />
              <p className="cursor-auto text-sm font-bold">
                {candidate.daysUntilRespond} days left
              </p>
            </div>
            <div className="h-2 w-full rounded-lg bg-emerald-600" />
          </div>
        )}
      </div>

      <div className="relative z-100 flex gap-2 justify-self-end">
        <ResumeIcon
          isShow={Number(candidate.resumeId) !== 0}
          size="24"
          className="cursor-pointer"
          onClick={() => onViewResume(candidate.resumeId)}
        />
        <User
          size="24"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(candidate.id);
          }}
        />
        <JobsPopover
          variables={{ candidateIdList: [candidate.id] }}
          mutationFn={removeCandidateFromJob}
          queryKeysToInvalidate={[['jobs']]}
          isConfirmAction={isConfirmingDelete}
          title="Are you sure you want to remove this candidate?"
          idPrefix="remove"
          onCancel={() => onSetRemoveId(null)}
          menuOptions={dropdownOptions}
          attributeId={candidate.id}
        />
      </div>
    </div>
  );
}
