import z from "zod";

export const ExpenseFolderSchema = z.object({
  exFolder: z.string().min(1, "Expense Folder name is required"),
});
