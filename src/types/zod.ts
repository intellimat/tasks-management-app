import { z } from "zod";
import { TaskStatus } from "./task";

export const idValidator = z.number().int().positive();

export const TaskInputValidator = z.object({
  title: z.string().nonempty(),
  status: z.nativeEnum(TaskStatus).optional(),
  description: z
    .string()
    .max(100, {
      message: "Description must not be longer than 100 characters.",
    })
    .optional(),
  timeEstimation: z.number().positive().optional(), // milliseconds
});

export const userAuthInputValidator = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const commentInputValidator = z.object({
  content: z.string().max(500),
});
