// Shared motion system. Every animated element in the app pulls its timing
// from one of these four tiers rather than inventing ad hoc durations, so
// the whole site moves on one coherent rhythm.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const MICRO = { duration: 0.16, ease: EASE_OUT }; // hover, underline, focus
export const UI = { duration: 0.28, ease: EASE_OUT }; // nav, menus, card state
export const SECTION = { duration: 0.6, ease: EASE_OUT }; // section entrances
export const DRAMATIC = { duration: 1.1, ease: EASE_IN_OUT }; // hero/storytelling moments

export const SPRING_SNAPPY = { type: "spring", stiffness: 500, damping: 40 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 300, damping: 30 } as const;
