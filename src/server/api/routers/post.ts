import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { postSchema } from "~/server/schemas/post";

export const postRouter = createTRPCRouter({
  // Public procedures
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: desc(posts.createdAt),
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);
      return post;
    }),

  // Protected procedures (require authentication)
  create: publicProcedure
    .input(
      postSchema.extend({
        createdBy: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(posts).values(input).returning();
      return result;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        price: z.number().min(0).optional(),
        imageUrl: z.array(z.string()).optional(),
        state: z
          .enum(["new", "like_new", "used", "heavily_used", "damaged"])
          .optional(),
        priority: z.number().min(0).max(10).optional(),
        updatedBy: z.string().optional(),
        sold: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const [result] = await ctx.db
        .update(posts)
        .set({
          ...updateData,
        })
        .where(eq(posts.id, id))
        .returning();
      return result;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();
      return result;
    }),
});
