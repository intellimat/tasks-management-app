import { getServerSession } from "next-auth";
import React from "react";
import authConfig from "../api/auth/[...nextauth]/auth.config";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center">Login</h1>
      {children}
    </div>
  );
}
