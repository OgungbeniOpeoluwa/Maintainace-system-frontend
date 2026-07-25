import { Clock, UserCheck, Wrench, CheckCircle2, XCircle } from "lucide-react";

const CONFIG = {
  PENDING: { icon: Clock, label: "Pending" },
  ASSIGNED: { icon: UserCheck, label: "Assigned" },
  IN_PROGRESS: { icon: Wrench, label: "In Progress" },
  COMPLETED: { icon: CheckCircle2, label: "Completed" },
  REJECTED: { icon: XCircle, label: "Rejected" },
};

export default function StatusBadge({ status }) {
  const entry = CONFIG[status] || { icon: Clock, label: status };
  const Icon = entry.icon;
  return (
    <span className={`stamp stamp-${status}`}>
      <Icon size={12} strokeWidth={2.5} />
      {entry.label}
    </span>
  );
}
