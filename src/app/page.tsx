import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-3 md:p-12">
      <h1 className="text-center text-xl font-bold">
        Enhance your productivity
      </h1>
      <div className="md:mx-42 flex flex-col items-center gap-4 m-3 md:mt-6">
        <p className="p-0 text-xl">
          Stay organized with Tasks Management App. Create, update, and
          track tasks easily from a clean and intuitive dashboard. Share your
          work. Sign up securely and manage your work from anywhere.
          <br /> Perfect for personal goals, school, or work.
        </p>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "flex items-center",
          )}
        >
          <span className="mb-0.5 uppercase">Dashboard</span>
          <ChevronRight />
        </Link>
      </div>
    </main>
  );
}
