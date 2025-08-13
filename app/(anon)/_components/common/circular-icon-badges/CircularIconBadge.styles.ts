export const styles = {
  // Base badge styles
  badge: "inline-flex items-center justify-center rounded-full font-medium transition-colors flex-shrink-0",
  
  // Size variants
  sm: "p-1 aspect-square w-6 h-6",
  md: "p-1.5 aspect-square w-8 h-8", 
  lg: "p-2 aspect-square w-10 h-10",
  
  // Type variants
  match: "bg-[var(--brand-green)] text-white",
  "match-blue": "bg-[var(--brand)] text-white",
  mismatch: "bg-[var(--error)] text-white",
  unchecked: "bg-[var(--brand-light-gray)] text-[var(--brand-dark-gray)]",
  link: "bg-[var(--brand-gold)] text-white",
  "match-light-green": "bg-[color-mix(in_srgb,var(--brand-green)_30%,transparent)] text-[var(--brand-green)]",
  "mismatch-emoji": "bg-[color-mix(in_srgb,var(--error)_30%,transparent)]",
  
  // Icon sizes
  iconSm: "w-3 h-3",
  iconMd: "w-4 h-4",
  iconLg: "w-5 h-5",
  
  // Icon weights
  thin: "stroke-[1.5]",
  normal: "stroke-[2]",
  thick: "stroke-[3]"
} as const;
