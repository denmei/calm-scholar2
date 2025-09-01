"use client";
export default function SenseCard({ sense }: { sense: any }) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{sense.lemma} → {sense.translation}</div>
        <div className="text-sm text-gray-500">{sense.pos} · {sense.ipa}</div>
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm font-serif">
        {sense.examples?.map((ex: string, i: number) => <li key={i}>{ex}</li>)}
      </ul>
      <div className="mt-3">
        <button className="rounded-md border px-3 py-1">Play audio</button>
        <button className="ml-2 rounded-md bg-positive px-3 py-1 text-white">Add to ZK</button>
      </div>
    </div>
  );
}
