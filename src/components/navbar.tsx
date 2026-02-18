"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useSWRConfig } from "swr";

interface NavbarProps {
  session?: Session | null;
  title?: string;
  className?: string;
}
const Navbar: React.FC<NavbarProps> = ({ title, className = "" }) => {
  const { mutate } = useSWRConfig();
  const session = useSession();
  const email = session.data?.user?.email;

  const handleLogoutButtonClick = async () => {
    // clear all SWR cache
    await mutate(
      () => true, // which cache keys are updated
      undefined, // update cache data to `undefined`
      { revalidate: false }, // do not revalidate
    );
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav
      className={cn(
        "flex items-center justify-between p-4 bg-white shadow-md",
        className,
      )}
    >
      {title && (
        <Link href={"/"}>
          <h1 className="text-lg font-semibold">{title}</h1>
        </Link>
      )}
      {email && (
        <div className="flex items-center space-x-4">
          <Button variant={"outline"} onClick={handleLogoutButtonClick}>
            Logout
          </Button>

          <span className="text-sm text-gray-600">{email}</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
