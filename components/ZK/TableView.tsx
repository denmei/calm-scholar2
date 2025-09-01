"use client";
export default function TableView() {
  // TODO: load from Supabase (senses per workspace)
  const rows = [
    { id: "s1", lemma: "run", translation: "laufen", pos: "verb", tags: ["fitness", "A2"] },
    { id: "s2", lemma: "dog", translation: "Hund", pos: "noun", tags: ["animals", "A1"] }
  ];
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left">Word</th>
            <th className="px-3 py-2 text-left">Translation</th>
            <th className="px-3 py-2 text-left">POS</th>
            <th className="px-3 py-2 text-left">Tags</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2">{r.lemma}</td>
              <td className="px-3 py-2">{r.translation}</td>
              <td className="px-3 py-2">{r.pos}</td>
              <td className="px-3 py-2">{r.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
