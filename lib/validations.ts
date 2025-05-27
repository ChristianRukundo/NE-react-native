import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const expenseSchema = z.object({
  name: z
    .string()
    .min(2, "Expense name must be at least 2 characters.")
    .max(100, "Expense name is too long (max 100 characters)."),

  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Amount must be a valid number.",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than zero.",
    })
    .refine((val) => parseFloat(val) < 1000000000, {
      message: "Amount seems too large.",
    }),

  description: z
    .string()
    .max(500, "Description is too long (max 500 characters).")
    .optional()
    .or(z.literal("")),

  category: z
    .string()
    .min(1, "Category is required.")
    .min(2, "Category name must be at least 2 characters.")
    .max(50, "Category name is too long (max 50 characters)."),

  date: z
    .string()
    .min(1, "Date is required.")

    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in YYYY-MM-DD format.",
    })
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return date.valueOf() && date <= today;
      },
      {
        message: "Please select a valid date (today or past).",
      }
    ),

  title: z
    .string()
    .max(100, "Optional title is too long (max 100 characters).")
    .optional()
    .or(z.literal("")),

  note: z
    .string()
    .max(1000, "Note is too long (max 1000 characters).")
    .optional()
    .or(z.literal("")),
});
export type ExpenseFormData = z.infer<typeof expenseSchema>;
