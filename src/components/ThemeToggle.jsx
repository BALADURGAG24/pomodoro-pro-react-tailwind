import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
    </button>
  );
}
