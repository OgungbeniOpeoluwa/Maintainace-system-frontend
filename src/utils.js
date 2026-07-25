/** Turns a Mongo ObjectId into a short, ticket-style code, e.g. "#A1B2C3". */
export function ticketCode(id) {
  if (!id) return "#——————";
  return "#" + id.slice(-6).toUpperCase();
}

export function initials(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  return (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
}
