export const styles = {
  // Base badge styles
  badge: "inline-flex items-center gap-2 rounded-full font-bold transition-colors",
  
  // Size variants
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm", 
  lg: "px-5 py-2.5 text-base",
  
  // Type variants
  match: "bg-white text-[var(--brand-green)]",
  mismatch: "bg-white text-[var(--error)]",
  unchecked: "bg-white text-[var(--brand-dark-gray)]",
  
  // Icon sizes
  iconSm: "w-3 h-3 stroke-[3.5]",
  iconMd: "w-4 h-4 stroke-[3.5]",
  iconLg: "w-5 h-5 stroke-[3.5]"
} as const;
