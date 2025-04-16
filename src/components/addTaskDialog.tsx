"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskStatus } from "@/types/task";
import { toast } from "sonner";
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
import { createTask } from "@/services/tasks";

export const TaskFormSchema = z.object({
  title: z.string().nonempty(),
  description: z
    .string()
    .max(100, {
      message: "Description must not be longer than 100 characters.",
    })
    .optional(),
  timeEstimation: z.number().int().positive().min(1).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

interface Props {
  triggerDialogClassName?: string;
  buttonLabel: string;
  dialogTitle: string;
  dialogDescription?: string;
}
export default function AddTaskDialog({
  triggerDialogClassName,
  buttonLabel,
  dialogTitle,
}: Props) {
  const form = useForm<z.infer<typeof TaskFormSchema>>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      timeEstimation: undefined,
      status: TaskStatus.Todo,
    },
  });

  async function onSubmit(data: z.infer<typeof TaskFormSchema>) {
    try {
      if (data.timeEstimation) {
        // convert hours into millis
        data.timeEstimation = data.timeEstimation * 60 * 60 * 1000;
      }
      const createdTask = await createTask(data);
      toast("Task successfully created!", {
        duration: 5000,
        dismissible: true,
        description: (
          <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(createdTask, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred, task could not be created. ", {
        duration: 5000,
        dismissible: true,
      });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild className={triggerDialogClassName}>
        <Button>{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-description="Form for submitting a new task"
      >
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3 flex flex-col"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
                  <FormLabel>Description</FormLabel>
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
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full"
                        defaultValue={TaskStatus.Todo}
                      >
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={TaskStatus.InProgress}>
                          In progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.Todo}>To do</SelectItem>
                        <SelectItem value={TaskStatus.Completed}>
                          Done
                        </SelectItem>
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
                  <FormLabel>Estimated time (in hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
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
      </DialogContent>
    </Dialog>
  );
}
