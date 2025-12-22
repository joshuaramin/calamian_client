import z from "zod";

export const CategorySchema = z.object({
  category: z.string().min(1, "Category is required"),
});
