import { useState } from "react";

export default function Settings({ sessionLength, breakLength, onUpdate }) {
  const [session, setSession] = useState(sessionLength / 60);
  const [brk, setBrk] = useState(breakLength / 60);

  const apply = () => {
    onUpdate(session * 60, brk * 60);
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      <div>
        <label className="block mb-1">Session (min)</label>
        <input
          type="number"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block mb-1">Break (min)</label>
        <input
          type="number"
          value={brk}
          onChange={(e) => setBrk(e.target.value)}
          className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
        />
      </div>
      <button
        onClick={apply}
        className="self-end px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Apply
      </button>
    </div>
  );
}
