"use client";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <WorkspaceSwitcher />
      <div className="text-sm text-gray-500">Calm Scholar</div>
    </header>
  );
}
