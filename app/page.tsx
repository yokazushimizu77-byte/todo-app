"use client";

import { useState, useRef, useEffect } from "react";

type Task = {
  id: number;
  text: string;
  done: boolean;
  createdAt: Date;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ローカルストレージから復元
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTasks(parsed.map((t: Task) => ({ ...t, createdAt: new Date(t.createdAt) })));
    }
  }, []);

  // ローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: Date.now(), text, done: false, createdAt: new Date() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const activeTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  return (
    <main className="min-h-screen bg-[#f8f7f4] flex items-start justify-center pt-16 pb-24 px-4">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-stone-800">
            タスク
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            {activeTasks.length === 0
              ? "すべて完了しました"
              : `${activeTasks.length}件の未完了タスク`}
          </p>
        </div>

        {/* 入力欄 */}
        <div className="flex gap-2 mb-8">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="新しいタスクを追加..."
            className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
          />
          <button
            onClick={addTask}
            disabled={!input.trim()}
            className="bg-stone-800 hover:bg-stone-700 disabled:bg-stone-200 text-white disabled:text-stone-400 rounded-xl px-5 py-3 text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed"
          >
            追加
          </button>
        </div>

        {/* タスクリスト（未完了） */}
        {activeTasks.length > 0 && (
          <ul className="space-y-2 mb-6">
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        )}

        {/* 完了済みセクション */}
        {doneTasks.length > 0 && (
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
              完了済み ({doneTasks.length})
            </p>
            <ul className="space-y-2">
              {doneTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </ul>
          </div>
        )}

        {/* 空の状態 */}
        {tasks.length === 0 && (
          <div className="text-center py-20 text-stone-300">
            <div className="text-5xl mb-4">✓</div>
            <p className="text-sm">タスクを追加してみましょう</p>
          </div>
        )}
      </div>
    </main>
  );
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <li className="group flex items-center gap-3 bg-white border border-stone-100 rounded-xl px-4 py-3 hover:border-stone-200 transition">
      {/* チェックボックス */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${
          task.done
            ? "bg-emerald-400 border-emerald-400"
            : "border-stone-300 hover:border-stone-400"
        }`}
        aria-label={task.done ? "未完了に戻す" : "完了にする"}
      >
        {task.done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* テキスト */}
      <span
        className={`flex-1 text-sm transition ${
          task.done ? "line-through text-stone-300" : "text-stone-700"
        }`}
      >
        {task.text}
      </span>

      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition cursor-pointer"
        aria-label="タスクを削除"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
}
