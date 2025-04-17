"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  triggerDialogClassName?: string;
  buttonLabel: string;
  dialogTitle: string;
  dialogContentAriaDescription?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}
export default function CustomDialog({
  triggerDialogClassName,
  buttonLabel,
  dialogTitle,
  dialogContentAriaDescription = "",
  open,
  onOpenChange,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className={triggerDialogClassName}>
        <Button>{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-description={dialogContentAriaDescription}
      >
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
