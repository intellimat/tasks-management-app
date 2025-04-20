import { pgTable, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tasks } from "./tasks";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  taskId: serial("task_id").references(() => tasks.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  authorId: serial("author_id").references(() => users.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  content: varchar("content", { length: 500 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
