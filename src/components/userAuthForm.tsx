"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { userAuthSchemaValidator } from "@/types/zod";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  buttonLabel: string;
  redirectMessage: string;
  redirectButtonLabel: string;
  redirectUrl: string;
  onSubmit: (data: z.infer<typeof userAuthSchemaValidator>) => void;
}
export default function UserAuthForm({
  onSubmit,
  buttonLabel,
  redirectMessage,
  redirectButtonLabel,
  redirectUrl,
}: Props) {
  const form = useForm<z.infer<typeof userAuthSchemaValidator>>({
    resolver: zodResolver(userAuthSchemaValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 flex flex-col"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="ml-auto">
          {buttonLabel}
        </Button>
      </form>
      <p>
        <span>{redirectMessage}</span>
        <Link
          href={redirectUrl}
          className={cn(buttonVariants({ variant: "link" }), "uppercase p-2")}
        >
          {redirectButtonLabel}
        </Link>
      </p>
    </Form>
  );
}
