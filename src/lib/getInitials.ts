export default function getInitials(name: string | undefined) {
  const parts = name && name?.split(" ");

  let initials = "";

  if (name && parts) {
    for (let i = 0; i < parts.length; i++) {
      initials += parts[i].charAt(0).toUpperCase();
    }
  }
  return initials;
}
