import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "./index";

export const authConfig = {
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
};
