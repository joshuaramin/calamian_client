import { email, z, ZodStringFormat } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Email address is required"),
  password: z.string().min(1, "Password is required"),
});
