// src/utils/date.js
export function toMySQLDatetime(dateInput) {
  if (!dateInput) return null;

  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;

  // Use UTC representation to avoid timezone ambiguity:
  // e.g. "2025-03-14T22:00:00.000Z" -> "2025-03-14 22:00:00"
  const iso = d.toISOString();              // "2025-03-14T22:00:00.000Z"
  const mysqlDT = iso.slice(0, 19).replace('T', ' '); // "2025-03-14 22:00:00"
  return mysqlDT;
}
