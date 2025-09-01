"use client";
export default function ButtonGroup({
  onAgain,
  onGood,
  onEasy
}: {
  onAgain: () => void;
  onGood: () => void;
  onEasy: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-4 mx-auto flex max-w-2xl justify-between gap-2 px-4">
      <button onClick={onAgain} className="w-1/3 rounded-md border px-4 py-3 bg-white shadow-sm">
        Again
      </button>
      <button onClick={onGood} className="w-1/3 rounded-md bg-primary px-4 py-3 text-white shadow-sm">
        Good
      </button>
      <button onClick={onEasy} className="w-1/3 rounded-md border px-4 py-3 bg-white shadow-sm">
        Easy
      </button>
    </div>
  );
}
