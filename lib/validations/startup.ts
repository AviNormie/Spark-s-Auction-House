import { z } from "zod";

export const StartupSchema = z.object({
  startup_id: z.number().int().positive().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  valuation: z.number().positive("Valuation must be a positive number").optional(),
  highest_bid: z.number().nonnegative().optional(),
  owner_team: z.string().optional().nullable(),
  currentBidAmount: z.number().nonnegative().optional(),
  industry: z.string().min(3, "Industry must be at least 3 characters long").optional(),
  problem_it_solves: z.string().min(10, "Problem it solves must be at least 10 characters long").optional(),
  businessModel: z.string().min(5, "Business model must be at least 5 characters long").optional(),
  funding_companies: z.array(z.string().min(1)).optional(),
  bid_session: z.boolean().default(false),
});
