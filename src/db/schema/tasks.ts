import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const taskStatusEnum = pgEnum("task_status", [
  "in progress",
  "to do",
  "completed",
]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  authorId: serial("author_id").references(() => users.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  status: taskStatusEnum("status"),
  description: text("description"),
  timeEstimation: integer("time_estimation"), // milliseconds
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
