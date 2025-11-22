import { authClient } from "../lib/auth-client.ts";

export async function fetchUser() {
  const { data, error } = await authClient.getSession();

  if (error || !data) return null;

  return data.user;
}
