// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `yard-sale_${name}`);

export const posts = createTable(
  "post",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }),
    description: text("description", { length: 1024 }),
    price: int("price", { mode: "number" }),
    imageUrl: text("image_url", { mode: "json" }).$type<string[]>(),
    state: text("state", { enum: ["new", "like_new", "used", "heavily_used", "damaged"] }),
    priority: int("priority", { mode: "number" }).default(5).notNull().$type<0|1|2|3|4|5|6|7|8|9|10>(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  })
);
