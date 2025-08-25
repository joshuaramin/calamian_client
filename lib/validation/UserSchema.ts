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
  birthday: z.string().min(1, "Birthday is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email Address is required"),
  role: z.enum(["admin", "manager", "staff"]),
  salary: z.float64(),
});
