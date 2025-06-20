import { useEffect, useRef, useState } from "react";
import TimerDisplay from "./components/TimerDisplay";
import Controls from "./components/Controls";
import Settings from "./components/Settings";
import Stats from "./components/Stats";
import ThemeToggle from "./components/ThemeToggle";
import Tasks from "./components/Tasks";
import PomoChart from "./components/PomoChart";
import { ThemeProvider } from "./context/ThemeContext";

const SESSION = "Session";
const BREAK = "Break";
const LONG_BREAK = 15 * 60;

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function App() {
  const [mode, setMode] = useState(SESSION);
  const [sessionLength, setSessionLength] = useState(
    Number(localStorage.getItem("sessionLength")) || 25 * 60
  );
  const [breakLength, setBreakLength] = useState(
    Number(localStorage.getItem("breakLength")) || 5 * 60
  );
  const [timeLeft, setTimeLeft] = useState(sessionLength);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(
    Number(localStorage.getItem("completed")) || 0
  );
  const [focusMode, setFocusMode] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [goal, setGoal] = useState(
    Number(localStorage.getItem("dailyGoal")) || 8
  );

  const intervalRef = useRef(null);
  const audio = useRef(null);

  useEffect(() => {
    audio.current = new Audio("/bell.wav");
    audio.current.load(); // Preload
    Notification.requestPermission();
    return () => {
      audio.current = null;
    };
  }, []);

  useEffect(() => {
    setTimeLeft(mode === SESSION ? sessionLength : breakLength);
  }, [sessionLength, breakLength, mode]);

  useEffect(() => {
    document.title = `${mode}: ${Math.floor(timeLeft / 60)}:${(
      "0" + (timeLeft % 60)
    ).slice(-2)}`;
    return () => (document.title = "Pomodoro Timer");
  }, [timeLeft, mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (audio.current) {
              audio.current.play().catch((e) =>
                console.warn("Audio play failed:", e)
              );
            }
            if (Notification.permission === "granted") {
              new Notification(`${mode} complete!`, {
                body: mode === SESSION ? "Time for a break!" : "Back to work!",
              });
            }

            const nextMode = mode === SESSION ? BREAK : SESSION;
            if (mode === SESSION) {
              const newCount = sessionCount + 1;
              setSessionCount(newCount);
              const newCompleted = completed + 1;
              setCompleted(newCompleted);
              localStorage.setItem("completed", newCompleted);

              const today = getToday();
              const updatedHistory = [...history];
              const todayEntry = updatedHistory.find((e) => e.date === today);
              if (todayEntry) {
                todayEntry.sessions += 1;
              } else {
                updatedHistory.push({ date: today, sessions: 1 });
              }
              setHistory(updatedHistory);
              localStorage.setItem("history", JSON.stringify(updatedHistory));

              if (newCount % 4 === 0) {
                setBreakLength(LONG_BREAK);
              }
            }

            setMode(nextMode);
            setRunning(false);
            return nextMode === SESSION ? sessionLength : breakLength;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  useEffect(() => {
    localStorage.setItem("sessionLength", sessionLength);
    localStorage.setItem("breakLength", breakLength);
  }, [sessionLength, breakLength]);

  const percent =
    timeLeft / (mode === SESSION ? sessionLength : breakLength);

    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-500">
          <ThemeToggle />
    
          <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8 items-center">
            <h1 className="text-4xl font-bold text-center">Pomodoro Timer</h1>
    
            {/* Timer Display */}
            <section className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col items-center">
              <TimerDisplay label={mode} timeLeft={timeLeft} percent={percent} />
              <Controls
                running={running}
                toggle={() => setRunning(!running)}
                reset={() => {
                  setRunning(false);
                  setTimeLeft(mode === SESSION ? sessionLength : breakLength);
                }}
              />
            </section>
    
            {/* Settings and Stats */}
            <section className="w-full flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-4">
                <Settings
                  sessionLength={sessionLength}
                  breakLength={breakLength}
                  onUpdate={(s, b) => {
                    setSessionLength(s);
                    setBreakLength(b);
                    setTimeLeft(mode === SESSION ? s : b);
                  }}
                />
              </div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-4 text-center flex flex-col justify-center">
                <Stats completed={completed} />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Daily Goal: {goal} <br />
                  Completed Today:{" "}
                  {history.find((h) => h.date === getToday())?.sessions || 0}
                </div>
              </div>
            </section>
    
            {/* Focus Mode Toggle */}
            <button
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
              onClick={() => setFocusMode(!focusMode)}
            >
              {focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            </button>
    
            {/* Tasks and Chart */}
            {!focusMode && (
              <section className="w-full flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-4">
                  <Tasks tasks={tasks} setTasks={setTasks} />
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-4">
                  <PomoChart data={history} />
                </div>
              </section>
            )}
          </main>
    
          <footer className="text-center text-xs text-gray-500 dark:text-gray-400 mt-12 mb-4">
            © {new Date().getFullYear()} Pomodoro App – Stay Focused ✨
          </footer>
        </div>
      </ThemeProvider>
    );
    
}
