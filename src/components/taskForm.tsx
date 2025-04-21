"use client";
import { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TaskInputValidator } from "@/types/zod";

interface Props {
  onSubmit: (data: z.infer<typeof TaskInputValidator>) => void;
  prefill?: Task;
}
export default function TaskForm({ onSubmit, prefill }: Props) {
  const form = useForm<z.infer<typeof TaskInputValidator>>({
    resolver: zodResolver(TaskInputValidator),
    defaultValues: {
      title: prefill?.title || "",
      description: prefill?.description || "",
      timeEstimation: prefill?.timeEstimation,
      status: prefill?.status,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-3 flex flex-col"
      >
        {prefill?.author && (
          <FormField
            disabled={true}
            name="author"
            render={() => (
              <FormItem>
                <FormLabel className="font-semibold">Author</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    readOnly={true}
                    value={prefill?.author?.name || prefill?.author?.email}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Description</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={TaskStatus.InProgress}>
                      In progress
                    </SelectItem>
                    <SelectItem value={TaskStatus.Todo}>To do</SelectItem>
                    <SelectItem value={TaskStatus.Completed}>Done</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeEstimation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                Estimated time (in hours)
              </FormLabel>
              <FormControl>
                <Input
                  step={0.1}
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="ml-auto" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
