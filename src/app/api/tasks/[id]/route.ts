import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { TaskSchemaValidator } from "@/types/zod";

const TaskIdValidator = z.number().int().positive();

// GET /api/tasks/:taskId - get a task
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsedTaskId = TaskIdValidator.safeParse(Number(id));

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid taskId",
          details: { receivedTaskId: id },
        },
        { status: 400 }
      );
    }

    const foundTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parsedTaskId.data))
      .limit(1);

    // If task is not found, return a 404 response
    if (foundTasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(foundTasks[0]);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks — create a new task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsedTaskId = TaskIdValidator.safeParse(Number(id));

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid taskId",
          details: { receivedTaskId: id },
        },
        { status: 400 }
      );
    }

    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, parsedTaskId.data))
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
// DELETE /api/tasks — create a new task
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parsedTaskId = TaskIdValidator.safeParse(Number(id));
    const parsedTask = TaskSchemaValidator.safeParse(body);

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid taskId",
          details: parsedTaskId.error.flatten(),
        },
        { status: 400 }
      );
    }

    if (!parsedTask.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsedTask.error.flatten() },
        { status: 400 }
      );
    }

    const [updatedTask] = await db
      .update(tasks)
      .set(parsedTask.data)
      .where(eq(tasks.id, parsedTaskId.data))
      .returning();

    return NextResponse.json({
      updatedTask,
    });
  } catch (error) {
    console.error("PUT /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to update task." },
      { status: 500 }
    );
  }
}
