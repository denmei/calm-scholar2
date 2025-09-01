import { describe, it, expect } from "vitest";
import { srsApply } from "./srs";

describe("srs", () => {
  it("again resets", () => {
    const next = srsApply({ interval_days: 6, ease_factor: 2.5, repetition_count: 2 }, "again");
    expect(next.interval_days).toBe(1);
    expect(next.repetition_count).toBe(0);
  });
  it("good progresses", () => {
    const next = srsApply({ interval_days: 1, ease_factor: 2.5, repetition_count: 1 }, "good");
    expect(next.interval_days).toBe(6);
    expect(next.repetition_count).toBe(2);
  });
});
