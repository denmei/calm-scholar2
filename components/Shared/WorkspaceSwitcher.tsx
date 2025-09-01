"use client";
import { useState } from "react";

export default function WorkspaceSwitcher() {
  // TODO: load from Supabase; per-user workspaces
  const [pair, setPair] = useState("EN→DE");
  return (
    <div className="inline-flex items-center gap-2">
      <select
        className="rounded-md border px-3 py-1 shadow-sm"
        value={pair}
        onChange={(e) => setPair(e.target.value)}
      >
        <option>EN→DE</option>
        <option>EN→ES</option>
        <option>EN→SV</option>
        <option>DE→EN</option>
      </select>
    </div>
  );
}
