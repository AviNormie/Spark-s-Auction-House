import { z } from "zod";

export const TeamSchema = z.object({
  team_id: z.number().int().positive().optional(), // Auto-generated
  team_name: z.string().min(3, "Team name must be at least 3 characters"),
  members: z
    .array(z.string().min(1, "Member name cannot be empty"))
    .min(2, "A team must have at least 2 members")
    .max(5, "A team cannot have more than 5 members"),
  credits: z.number().nonnegative().default(5000),
  purchased_startups: z.array(z.string()).optional(),
});
