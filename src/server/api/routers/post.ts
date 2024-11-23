import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { postSchema } from "~/server/schemas/post";

export const postRouter = createTRPCRouter({
  // Public procedures
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });
      return post;
    }),

  // Protected procedures (require authentication)
  create: publicProcedure
    .input(postSchema.extend({
      createdBy: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(posts).values(input);
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      price: z.number().min(0).optional(),
      imageUrl: z.array(z.string()).optional(),
      state: z.enum(["new", "like_new", "used", "heavily_used", "damaged"]).optional(),
      priority: z.number().min(0).max(10).optional(),
      updatedBy: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.update(posts)
        .set({ 
          ...updateData,
          priority: updateData.priority as 0|1|2|3|4|5|6|7|8|9|10 
        })
        .where(eq(posts.id, id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(posts).where(eq(posts.id, input.id));
    }),
});
