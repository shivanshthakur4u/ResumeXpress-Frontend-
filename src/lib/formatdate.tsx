export function formatDate(datestring: Date) {
  const date = new Date(datestring)
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}
