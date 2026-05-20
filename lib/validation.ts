import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(40, "Please enter a shorter phone number.")
    .optional()
    .default(""),
  business: z.string().min(2, "Tell us your business name."),
  currentWebsite: z
    .string()
    .trim()
    .max(160, "Please enter a shorter website address.")
    .optional()
    .default(""),
  enquiry: z.string().min(10, "Share a few details so we can help."),
  website: z.string().optional().default(""),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
