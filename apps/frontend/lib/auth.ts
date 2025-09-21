import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { authConfig } from "@repo/db/config";

export const auth = betterAuth({
  ...authConfig,
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
