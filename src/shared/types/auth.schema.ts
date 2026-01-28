import { email, object, string, z } from "zod";

export const LoginFormSchema = object({
  email: email({ error: "Please enter a valid email." }).trim(),
  password: string()
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
});

export const SignupFormSchema = object({
  fullName: string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: email({ error: "Please enter a valid email." }).trim(),
  password: string()
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
});

export type LoginSchemaType = z.infer<typeof LoginFormSchema>;
export type SignupFormSchemaType = z.infer<typeof SignupFormSchema>;

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
