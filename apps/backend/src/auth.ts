import { betterAuth } from "better-auth";
import { authConfig } from "@repo/db/config";

export const auth = betterAuth({ ...authConfig });
