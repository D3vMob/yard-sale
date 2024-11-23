// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  boolean,
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `yard-sale_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    imageUrl: text("image_url").array().$type<string[]>().default([]),
    state: text("state", {
      enum: ["new", "like_new", "used", "heavily_used", "damaged"],
    }).notNull(),
    priority: integer("priority").notNull().default(5),
    sold: boolean("sold").notNull().default(false),
    category: text("category", {
      enum: ["electronics", "furniture", "appliances", "other"],
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  }),
);
