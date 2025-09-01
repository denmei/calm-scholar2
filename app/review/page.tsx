"use client";
import { useEffect, useState } from "react";
import PromptCard from "@/components/Review/PromptCard";
import ButtonGroup from "@/components/Review/ButtonGroup";
import { srsApply } from "@/src/lib/srs";

export default function ReviewPage() {
  const [item, setItem] = useState<any | null>(null);

  useEffect(() => {
    // TODO: fetch next due review item from Dexie/Supabase
    setItem({
      id: "demo-1",
      prompt: "run → ?",
      answer: "laufen",
      direction: "A2B",
      state: { interval_days: 1, ease_factor: 2.5, repetition_count: 0 }
    });
  }, []);

  function grade(g: "again" | "good" | "easy") {
    if (!item) return;
    const next = srsApply(item.state, g);
    console.log("Next schedule:", next);
    // TODO: persist next to DB and load next card
  }

  if (!item) return <p>Loading…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Review</h1>
      <PromptCard prompt={item.prompt} answer={item.answer} />
      <ButtonGroup onAgain={() => grade("again")} onGood={() => grade("good")} onEasy={() => grade("easy")} />
    </div>
  );
}
