export default function TicketSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-ticket" />
      ))}
    </>
  );
}
