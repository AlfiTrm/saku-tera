import type { TargetAndTransition } from "framer-motion";

export const PRESS_BUTTON_VARIANTS = {
  primary: {
    base: "bg-primary text-white hover:bg-primary/95",
    shadow: "0 4px 0 0 var(--color-secondary)",
    hoverShadow: "0 2px 0 0 var(--color-secondary)",
    pressShadow: "0 1px 0 0 var(--color-secondary)",
  },
  secondary: {
    base: "bg-tertiary text-white hover:bg-tertiary/95",
    shadow: "0 4px 0 0 var(--color-secondary)",
    hoverShadow: "0 2px 0 0 var(--color-secondary)",
    pressShadow: "0 1px 0 0 var(--color-secondary)",
  },
  outline: {
    base: "border border-black/10 bg-white text-secondary hover:bg-black/2",
    shadow: "0 4px 0 0 var(--color-secondary)",
    hoverShadow: "0 2px 0 0 var(--color-secondary)",
    pressShadow: "0 1px 0 0 var(--color-secondary)",
  },
} as const;

export type PressButtonVariant = keyof typeof PRESS_BUTTON_VARIANTS;

type PressButtonMotionState = {
  whileHover: TargetAndTransition;
  whileTap: TargetAndTransition;
};

export function getPressButtonVariant(variant: PressButtonVariant) {
  return PRESS_BUTTON_VARIANTS[variant] ?? PRESS_BUTTON_VARIANTS.primary;
}

export function getPressButtonMotion(
  variant: PressButtonVariant,
  disabled = false,
): PressButtonMotionState {
  if (disabled) {
    return {
      whileHover: {},
      whileTap: {},
    };
  }

  return {
    whileHover: {
      y: 2,
      boxShadow: getPressButtonVariant(variant).hoverShadow,
    },
    whileTap: {
      y: 3,
      boxShadow: getPressButtonVariant(variant).pressShadow,
    },
  };
}
