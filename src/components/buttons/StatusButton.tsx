export function StatusButton({ isActive }: { isActive: boolean }) {
  const statusText = isActive ? 'Active' : 'Inactive';
  const statusColor = isActive ? 'bg-green-300' : 'bg-red-300';
  return (
    <button
      className={`flex max-w-22 min-w-22 cursor-default items-center justify-center rounded-lg border-none ${statusColor}`}
    >
      <label className="cursor-default text-current">{statusText}</label>
    </button>
  );
}
