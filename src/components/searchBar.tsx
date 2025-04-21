import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";
interface Props {
  className?: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}
export function Searchbar({ onChange, className = "" }: Props) {
  return (
    <div
      className={cn("flex w-full max-w-sm items-center space-x-2", className)}
    >
      <Input type="text" placeholder="Search" onChange={onChange} />
    </div>
  );
}
