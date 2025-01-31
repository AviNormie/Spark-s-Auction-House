import { z } from "zod";

export const MemberSchema = z.object({
  name: z.string().min(1, "Member name cannot be empty"),
  enrollmentNumber: z.string().min(5, "Enrollment number is required"),
});

export const TeamSchema = z.object({
  team_id: z.number().int().positive().optional(),
  team_name: z.string().min(3, "Team name must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  members: z
    .array(MemberSchema)
    .min(1, "At least one member (creator) must be included") 
    .max(5, "A team cannot have more than 5 members"),
  credits: z.number().nonnegative().default(5000),
  purchased_startups: z.array(z.string()).optional(),
});

