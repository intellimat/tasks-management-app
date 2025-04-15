import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-3 md:p-6">
      <h1 className="text-center text-3xl">Task Management App</h1>
      <div className="md:mx-64 flex flex-col items-center gap-4 m-3 md:mt-6">
        <p className="p-0 text-xl">
          Stay organized with our simple Task Management App. Create, update,
          and track tasks easily from a clean, intuitive dashboard. Sign up
          securely and manage your work anywhere. Perfect for personal goals,
          school, or team projects—productivity made effortless.
        </p>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "default" }),
            "flex items-center"
          )}
        >
          <span className="mb-0.5 uppercase">Dashboard</span>
          <ChevronRight />
        </Link>
      </div>
    </main>
  );
}
