import z from "zod";

const todoSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(4),
  completed: z.boolean().default(false),
});
