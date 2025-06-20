import { useState, useEffect } from "react";

export default function Tasks({ tasks, setTasks }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { name: input, done: false, pomos: 0 }]);
    setInput("");
  };

  const toggleDone = (i) => {
    const copy = [...tasks];
    copy[i].done = !copy[i].done;
    setTasks(copy);
  };

  return (
    <div className="mt-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">Tasks</h3>
      <div className="flex mb-2">
        <input
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l bg-white text-black dark:bg-gray-800 dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task"
        />
        <button
          onClick={addTask}
          className="px-4 bg-blue-600 text-white rounded-r"
        >
          +
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li
            key={i}
            className={`flex justify-between items-center p-2 border rounded ${
              t.done
                ? "line-through text-gray-500 border-gray-300 dark:border-gray-600"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <span>{t.name}</span>
            <button
              onClick={() => toggleDone(i)}
              className="text-sm text-green-600"
            >
              {t.done ? "Undo" : "Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
