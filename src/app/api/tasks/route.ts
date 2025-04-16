import { NextRequest, NextResponse } from "next/server";
import { TaskStatus } from "@/types/task"; // your Task enum/type
import { z } from "zod";
import { tasks } from "@/db/schema/tasks";
import { db } from "@/db";
import { eq } from "drizzle-orm";

// Zod schema for input validation
const TaskInput = z.object({
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

// GET /api/tasks — fetch all tasks
export async function GET() {
  try {
    const allTasks = await db.select().from(tasks);
    return NextResponse.json(allTasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks — create a new task
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TaskInput.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [newTask] = await db
      .insert(tasks)
      .values({
        title: parsed.data.title,
        status: parsed.data.status,
        description: parsed.data.description,
        timeEstimation: parsed.data.timeEstimation,
      })
      .returning();

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}

// DELETE /api/tasks — create a new task
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId: requestTaskId } = body;
    if (!requestTaskId) {
      return NextResponse.json(
        { error: "Invalid taskId", details: { receivedTaskId: requestTaskId } },
        { status: 400 }
      );
    }

    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, requestTaskId))
      .returning();

    return NextResponse.json({
      deletedTask,
    });
  } catch (error) {
    console.error("DELETE /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to delete task." },
      { status: 500 }
    );
  }
}
