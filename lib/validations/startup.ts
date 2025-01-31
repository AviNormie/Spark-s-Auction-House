import { z } from "zod";

export const StartupSchema = z.object({
  startup_id: z.number().int().positive().optional(),  
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  valuation: z.number().positive("Valuation must be a positive number"),
  highest_bid: z.number().nonnegative(),
  winning_team: z.string().optional().nullable(),
  currentBidAmount: z.number().nonnegative(),
});
