import { z } from "zod";

export const Topic = z.object({
	name: z.string(),
	description: z.string(),
	terms: z.array(z.object({
		term: z.string(),
		explanation: z.string()
	})),
});