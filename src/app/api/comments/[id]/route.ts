import { deleteCommentById, updateComment } from "@/db/dao/comments";
import { commentInputValidator, idValidator } from "@/types/zod";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authConfig from "@/app/api/auth/[...nextauth]/auth.config";

// DELETE /api/comments/:id — delete comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const parsedCommentId = idValidator.safeParse(Number(id));

    if (!parsedCommentId.success) {
      return NextResponse.json(
        {
          error: "Invalid Comment Id",
          details: parsedCommentId.error.flatten(),
        },
        { status: 400 },
      );
    }

    const deletedCommentFromDB = await deleteCommentById(
      parsedCommentId.data,
      Number(session.user.id),
    );

    if (deletedCommentFromDB === null) {
      return NextResponse.json(
        { error: "Comment could not be deleted" },
        { status: 500 },
      );
    }

    return NextResponse.json(deletedCommentFromDB);
  } catch (error) {
    console.error(`DELETE /api/comments/:id error: `, error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}

// PUT /api/comments/:id — update comment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { id } = await params;
    const parsedCommentId = idValidator.safeParse(Number(id));
    const parsedComment = commentInputValidator.safeParse(body);

    if (!parsedCommentId.success) {
      return NextResponse.json(
        {
          error: "Invalid Comment Id",
          details: parsedCommentId.error.flatten(),
        },
        { status: 400 },
      );
    }

    if (!parsedComment.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsedComment.error.flatten() },
        { status: 400 },
      );
    }

    const updatedComment = await updateComment(
      parsedCommentId.data,
      parsedComment.data,
      Number(session.user.id),
    );

    if (updatedComment === null) {
      return NextResponse.json(
        { error: "Comment could not be updated" },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error(`PUT /api/comments/:id error: `, error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 },
    );
  }
}
