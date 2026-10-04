// The motion language. Three tempos, every spring critically damped
// (damping ratio ≈ 1): things arrive and settle, they never bounce.
//
//   FAST    small interface reactions — hover, focus, index dot
//   MEDIUM  state changes inside a scene
//   SLOW    large environmental movement — the name, the field
//
// Scroll-driven scenes don't use timed animations at all: they read one
// continuous progress value (see lib/scroll.ts) and interpolate from it.
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

// How visual progress follows the scrollbar: a little mass, no overshoot,
// settles in ~⅓ s. Fast flicks read as decisive, slow scrolls as slow.
export const SCROLL_FOLLOW = { stiffness: 190, damping: 28, mass: 1, restDelta: 0.0001 };
// Reduced motion: effectively 1:1 with the scrollbar.
export const SCROLL_DIRECT = { stiffness: 2000, damping: 90, mass: 1, restDelta: 0.0001 };
