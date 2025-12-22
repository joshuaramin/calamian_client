import z from "zod";

export const ItemSchema = z.object({
  categoryID: z.string().nullable().optional(),
  item: z.string().min(1, "Name is required"),
  dosage: z.string().nullable().optional(),
  price: z.number().min(1, "Price must not minimum at 1"),
  quantity: z.number().min(1, "The minimum amount is 1"),
  expiredDate: z.string().nullable().optional(),
});
