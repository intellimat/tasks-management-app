import React from "react";
import { Toaster } from "sonner";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <Toaster closeButton={true} duration={6000} />
      <h1 className="text-3xl font-bold text-center">Login</h1>
      {children}
    </div>
  );
}
