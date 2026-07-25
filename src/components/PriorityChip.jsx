export default function PriorityChip({ priority }) {
  return (
    <span className="priority-chip">
      <span className={`priority-dot ${priority}`} />
      {priority?.charAt(0) + priority?.slice(1).toLowerCase()}
    </span>
  );
}
