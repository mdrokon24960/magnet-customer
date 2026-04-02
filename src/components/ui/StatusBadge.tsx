import { getStatusColor, getStatusLabel } from '../../lib/utils';

interface BadgeProps {
  status: string;
}

export function StatusBadge({ status }: BadgeProps) {
  const color = getStatusColor(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
      style={{ color, background: `${color}18`, border: `1px solid ${color}35` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {getStatusLabel(status)}
    </span>
  );
}
