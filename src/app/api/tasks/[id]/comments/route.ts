import { fetchComments } from "@/db/dao/comments";
import { idValidator } from "@/types/zod";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks/:taskId/comments — fetch all task comments
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsedTaskId = idValidator.safeParse(Number(id));

    if (!parsedTaskId.success) {
      return NextResponse.json(
        {
          error: "Invalid commentId",
          details: { receivedCommentId: id },
        },
        { status: 400 }
      );
    }

    const fetchedCommentsFromDB = await fetchComments(parsedTaskId.data);
    return NextResponse.json(fetchedCommentsFromDB);
  } catch (error) {
    console.error(`GET /api/comments/:id error: `, error);
    return NextResponse.json(
      { error: "Failed to fetch comments. " },
      { status: 500 }
    );
  }
}
