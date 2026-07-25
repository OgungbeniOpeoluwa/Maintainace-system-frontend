export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={26} strokeWidth={2} />
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      {action}
    </div>
  );
}
