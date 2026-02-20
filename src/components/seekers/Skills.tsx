interface CandidateSkillsProps {
  skills: string[];
}

export const CandidateSkills = ({ skills }: CandidateSkillsProps) => {
  return (
    <>
      {skills.map((s) => (
        <div key={s} className="rounded-2xl bg-neutral-200 px-2 py-1 text-xs">
          {s}
        </div>
      ))}
    </>
  );
};
