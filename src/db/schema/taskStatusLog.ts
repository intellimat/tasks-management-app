import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { tasks, taskStatusEnum } from "./tasks";

export const taskStatusLog = pgTable("task_status_log", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  status: taskStatusEnum("status"),
  changedAt: timestamp("changed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
