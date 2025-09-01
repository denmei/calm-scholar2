export type SrsState = {
    interval_days: number;
    ease_factor: number;
    repetition_count: number;
  };
  
  export function srsApply(state: SrsState, grade: "again" | "good" | "easy"): SrsState {
    let { interval_days, ease_factor, repetition_count } = state;
  
    if (grade === "again") {
      interval_days = 1;
      repetition_count = 0;
      ease_factor = Math.max(1.3, ease_factor - 0.2);
      return { interval_days, ease_factor, repetition_count };
    }
  
    if (grade === "good") {
      if (repetition_count === 0) interval_days = 1;
      else if (repetition_count === 1) interval_days = 6;
      else interval_days = Math.round(interval_days * ease_factor);
      repetition_count += 1;
      return { interval_days, ease_factor, repetition_count };
    }
  
    // easy
    interval_days = Math.round(interval_days * ease_factor * 1.3);
    ease_factor = ease_factor + 0.15;
    repetition_count += 1;
    return { interval_days, ease_factor, repetition_count };
  }
  