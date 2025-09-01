"use client";
import { useWorkspace, type Lang } from "@/store/workspace";

const options: Array<{ label: string; base: Lang; target: Lang }> = [
  { label: "EN→DE", base: "EN", target: "DE" },
  { label: "EN→ES", base: "EN", target: "ES" },
  { label: "EN→SV", base: "EN", target: "SV" },
  { label: "DE→EN", base: "DE", target: "EN" },
  { label: "ES→EN", base: "ES", target: "EN" },
  { label: "SV→EN", base: "SV", target: "EN" }
];

export default function WorkspaceSwitcher() {
  const { baseLang, targetLang, setPair } = useWorkspace();
  const current = `${baseLang}→${targetLang}`;

  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-sm text-gray-600">Pair</label>
      <select
        className="rounded-md border px-3 py-1 shadow-sm"
        value={current}
        onChange={(e) => {
          const val = e.target.value;
          const opt = options.find((o) => o.label === val);
          if (opt) setPair(opt.base, opt.target);
        }}
      >
        {options.map((o) => (
          <option key={o.label} value={o.label}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
