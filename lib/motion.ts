// The motion language. Three tempos, every spring critically damped
// (damping ratio ≈ 1): things arrive and settle, they never bounce.
//
//   FAST    small interface reactions — hover, focus, an arrow nudging
//   MEDIUM  a section's own entrance
//   SLOW    large, deliberate movement — used sparingly
//
// Motion here is restrained by design: hover transitions, slight text
// displacement, opacity. Nothing scroll-scrubs or pins.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const FAST = { type: "spring", stiffness: 520, damping: 46 } as const;
export const MEDIUM = { type: "spring", stiffness: 170, damping: 27 } as const;
export const SLOW = { type: "spring", stiffness: 55, damping: 15.5 } as const;

// Timed equivalents for places a spring doesn't fit (opacity-only fades).
export const MICRO = { duration: 0.18, ease: EASE_OUT };
export const UI = { duration: 0.32, ease: EASE_OUT };
export const SECTION = { duration: 0.7, ease: EASE_OUT };
export const DRAMATIC = { duration: 1.2, ease: EASE_IN_OUT };

// Kept as aliases for existing call sites.
export const SPRING_SNAPPY = FAST;
export const SPRING_SOFT = MEDIUM;
