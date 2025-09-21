import { Session, auth } from "@/lib/auth";
import { headers } from "next/headers";

export const useSession = async (): Promise<Session | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (err) {
    const error = err instanceof Error ? err.message : err;
    console.log("Error getting session: ", error);
    return null;
  }
};

export const getUser = async () => {
  const session = await useSession();
  return session?.user ?? null;
};
