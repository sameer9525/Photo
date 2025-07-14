
"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { mode, toggleMode } = useTheme(); // Changed from theme, toggleTheme to mode, toggleMode

  return (
    <Button variant="ghost" size="icon" onClick={toggleMode} aria-label="Toggle light/dark theme">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle light/dark theme</span>
    </Button>
  );
}
