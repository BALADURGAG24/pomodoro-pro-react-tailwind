export default function Controls({ running, toggle, reset }) {
    return (
      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={toggle}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    );
  }
  