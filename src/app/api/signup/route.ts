import { db } from "@/db";
import { users } from "@/db/schema/users";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // TODO: validate input with zod
  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const existingUser = foundUsers[0];

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use. " },
      { status: 400 }
    );
  }

  const passwordHash = await hash(password, 10);
  await db.insert(users).values({
    email,
    passwordHash,
  });

  return NextResponse.json({ email }, { status: 201 });
}
