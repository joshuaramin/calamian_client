import z from "zod";

export const ExpenseSchema = z.object({
  expense: z.string().min(1, "Expense is required"),
  mod: z.enum(["Cash", "Card", "Paypal"]),
  payDate: z.string().min(1, "Pay Date is requried"),
  amount: z.number().min(1, "Amount is required"),
});
