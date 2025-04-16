import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

export const taskStatusEnum = pgEnum("task_status", [
  "in progress",
  "to do",
  "completed",
  "not available",
]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  status: taskStatusEnum("status").notNull(),
  description: text("description"),
  timeEstimation: integer("time_estimation"), // milliseconds
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
