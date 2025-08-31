import { z } from "zod";

export const statusOptions = ["Applied", "Interviewing", "Offer", "Rejected"] as const;

export const ApplicationSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
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
