"use server";

import z from "zod";
import { auth } from "@/lib/auth";

export const Signup = async (state: any, formData: FormData) => {
  const { data, error, success } = z
    .object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })
    .safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

  if (!success) {
    return {
      success: false,
      errors: error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = data;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Signed up successfully.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "An unknown error occurred.",
    };
  }
};
