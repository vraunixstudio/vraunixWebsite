export const motion = {
  duration: {
    instant: "90ms",
    fast: "160ms",
    normal: "260ms",
    slow: "480ms",
    reveal: "900ms",
  },
  easing: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    emphasis: "cubic-bezier(0.16, 1, 0.3, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;
