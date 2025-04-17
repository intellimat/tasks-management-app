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
  onDialogTriggerClick?: () => void;
  children: React.ReactNode;
}
export default function CustomDialog({
  triggerDialogClassName,
  buttonLabel,
  dialogTitle,
  dialogContentAriaDescription = "",
  open,
  onDialogTriggerClick,
  children,
}: Props) {
  return (
    <Dialog open={open}>
      <DialogTrigger
        asChild
        className={triggerDialogClassName}
        {...(onDialogTriggerClick ? { onClick: onDialogTriggerClick } : {})}
      >
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
