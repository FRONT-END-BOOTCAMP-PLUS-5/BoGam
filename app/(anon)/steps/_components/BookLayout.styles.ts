export const styles = {
  container: "w-full space-y-6 bg-transparent",
  title: "text-lg font-semibold text-brand-black",
  sectionLabel: "text-base font-semibold text-brand-black mb-4",
  grid: "grid grid-cols-1 gap-6",
  bookItem: "relative",
  bookBox: "absolute inset-y-0 -z-20 bg-brand-white backdrop-blur-sm rounded-lg p-4 w-full pointer-events-none shadow-md",
  textBox: "absolute inset-y-0 -z-10 bg-brand-white opacity-100 p-4 pointer-events-none w-60",
  textBoxLeft: "left-0",
  textBoxRight: "right-0",
  bookTitle: "text-sm text-brand-dark-gray",
  bookSubtitle: "text-base font-medium text-brand-black",
  bookDescription: "text-sm text-brand-dark-gray",
  divider: "h-px bg-brand-light-gray"
} as const;

export const getTextBoxClass = (isOdd: boolean) => {
  return `${styles.textBox} ${isOdd ? styles.textBoxLeft : styles.textBoxRight}`;
};
