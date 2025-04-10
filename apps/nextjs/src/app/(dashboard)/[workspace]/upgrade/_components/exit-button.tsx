"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@acme/ui/button";
import { useKeyboardShortcut } from "@acme/ui/hooks";
import { Icon } from "@acme/ui/icon";

export default function ExitButton() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const exit = searchParams.get("exit");

  const onExit = () => {
    if (exit === "close") return window.close();

    if (window.history.length > 1) router.back();
    else
      // Fallback to workspace dashboard if no history
      router.push("./"); // Navigate to the current workspace root
  };

  useKeyboardShortcut("Escape", onExit);

  return (
    <Button
      onClick={onExit}
      className="absolute right-4 top-4"
      variant="ghost"
      size="icon"
    >
      <Icon as={X} />
    </Button>
  );
}
