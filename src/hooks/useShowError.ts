import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useShowError(errors?: (Error | null | undefined)[]) {
  const shownMessagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!errors || errors.length === 0) return;

    for (const err of errors) {
      const message = err?.message;

      if (message && !shownMessagesRef.current.has(message)) {
        toast.error(message, {
          duration: 6000,
        });
        shownMessagesRef.current.add(message);
      }
    }

    // Optional: reset tracking if all errors are gone
    if (errors.every((err) => !err)) {
      shownMessagesRef.current.clear();
    }
  }, [errors]);
}
