import { z } from "zod";

export const statusOptions = ["Applied", "Interviewing", "Offer", "Rejected"] as const;

export const ApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  platform: z.string().optional(),
  companyName: z.string().min(1, "Company name is required."),
  role: z.string().min(1, "Role is required."),
  dateApplied: z.date({
    required_error: "A date of application is required.",
  }),
  status: z.enum(statusOptions),
  notes: z.string().optional(),
});

export type Application = z.infer<typeof ApplicationSchema>;
export type Status = Application['status'];

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;