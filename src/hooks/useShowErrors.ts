import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useShowErrors(error?: Error | null) {
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    const message = error?.message;

    if (message && message !== lastMessageRef.current) {
      toast.error(message, {
        duration: 6000,
      });
      lastMessageRef.current = message;
    }

    // Optional: clear last error if current error is null
    if (!error) {
      lastMessageRef.current = null;
    }
  }, [error]);
}
