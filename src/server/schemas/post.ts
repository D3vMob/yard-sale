import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  state: z.enum(["new", "like_new", "used", "heavily_used", "damaged"]),
  imageUrl: z.array(z.string()).default([]),
  priority: z.number().min(1).max(10).default(5).transform(n => n as 0|1|2|3|4|5|6|7|8|9|10),
  sold: z.boolean().default(false),
  category: z.enum(["electronics", "furniture", "appliances", "other"]),
});

export type PostSchema = z.infer<typeof postSchema>; 