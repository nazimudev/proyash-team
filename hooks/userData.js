export default function userData() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("auth_user");

  return user ? JSON.parse(user) : null;
}
