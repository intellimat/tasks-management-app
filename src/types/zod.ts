import { z } from "zod";
import { TaskStatus } from "./task";

export const TaskSchemaValidator = z.object({
  title: z.string().nonempty(),
  status: z.nativeEnum(TaskStatus).optional(),
  description: z
    .string()
    .max(100, {
      message: "Description must not be longer than 100 characters.",
    })
    .optional(),
  timeEstimation: z.number().int().positive().optional(),
});
