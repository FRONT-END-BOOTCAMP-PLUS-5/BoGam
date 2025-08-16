export const styles = {
  // Base badge styles
  badge: "inline-flex items-center justify-center rounded-full font-medium transition-colors flex-shrink-0",
  
  // Size variants
  sm: "p-1 aspect-square w-6 h-6",
  md: "p-1.5 aspect-square w-8 h-8", 
  lg: "p-2 aspect-square w-10 h-10",
  
  // Type variants
  match: "bg-brand-green text-white",
  "match-blue": "bg-brand text-white",
  mismatch: "bg-brand-error text-white",
  unchecked: "bg-brand-light-gray text-brand-dark-gray",
  link: "bg-brand-gold text-white",
  "match-light-green": "bg-[color-mix(in_srgb,theme(colors.brand.green)_30%,transparent)] text-brand-green",
  "mismatch-emoji": "bg-[color-mix(in_srgb,theme(colors.brand.error)_30%,transparent)]",
  
  // Icon sizes
  iconSm: "w-3 h-3",
  iconMd: "w-4 h-4",
  iconLg: "w-5 h-5",
  
  // Icon weights
  thin: "stroke-[1.5]",
  normal: "stroke-[2]",
  thick: "stroke-[3]"
} as const;
