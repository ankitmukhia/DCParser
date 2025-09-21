"use server";

import z from "zod";
import { auth } from "@/lib/auth";

export const Login = async (state: any, formData: FormData) => {
  const { data, error, success } = z
    .object({
      email: z.string(),
      password: z.string(),
    })
    .safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

  if (!success) {
    return {
      success: false,
      errors: error.flatten().fieldErrors,
    };
  }

  const { email, password } = data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Logged-in successfully.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "An unknown error occurred.",
    };
  }
};
