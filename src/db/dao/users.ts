import { StringChunk } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema/users";
import { eq } from "drizzle-orm";

export async function _fetchUserByEmail(email: StringChunk) {
  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (foundUsers.length === 0) {
    return null;
  }
  return foundUsers[0];
}

export async function insertUser({
  email,
  passwordHash,
}: {
  email: string;
  passwordHash: string;
}) {
  await db.insert(users).values({
    email,
    passwordHash,
  });
}
