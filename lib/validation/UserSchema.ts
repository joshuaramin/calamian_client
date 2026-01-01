import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().min(1, "Email Address is required"),
});

export const AuthSchema = z.object({
  email: z.string().min(1, "Email Address is required"),
  password: z.string().min(1, "Password is required"),
});

export const UserCreation = z.object({
  firstname: z.string().min(1, "First Name is required"),
  lastname: z.string().min(1, "Last Name is required"),
  birthday: z.coerce
    .date()
    .refine((date) => !isNaN(date.getTime()), "Birthday is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email Address is required"),
  role: z.string().min(1, "Role is required"),
  salary: z.float64(),
});

export const UserPassword = z.object({
  current: z.string().min(1, "Current password is required"),
  password: z.string().min(1, "New password is required"),
  retype: z.string().min(1, "Re-type password is required"),
});

export const UserDeleteSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  main: z.string().min(1, "Main User ID is required"),
});
