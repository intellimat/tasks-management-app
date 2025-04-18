import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@/db/schema/tasks";
import { db } from "@/db";
import { TaskSchemaValidator } from "@/types/zod";
import { getServerSession } from "next-auth";
import authConfig from "../auth/[...nextauth]/auth.config";

// GET /api/tasks — fetch all tasks
export async function GET() {
  try {
    const allTasks = await db.select().from(tasks);
    return NextResponse.json(allTasks);
  } catch (error) {
    console.error("GET /api/tasks error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks. " },
      { status: 500 }
    );
  }
}

// POST /api/tasks — create a new task
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsed = TaskSchemaValidator.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input. ", details: parsed.error.flatten() },
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
        authorId: Number(session.user.id),
      })
      .returning();

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("POST /api/tasks error: ", error);
    return NextResponse.json(
      { error: "Failed to add task. " },
      { status: 500 }
    );
  }
}
