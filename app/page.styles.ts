export const styles = {
  page: "flex flex-col min-h-screen bg-gradient-to-br from-brand to-brand-purple font-sans",
  
  main: "flex-1 flex flex-col items-center justify-center p-8 text-center",
  
  title: "text-6xl font-extrabold text-brand-white mb-4 drop-shadow-lg",
  
  subtitle: "text-xl text-brand-white/90 mb-12 font-light",
  
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full mx-auto",
  
  card: "bg-brand-white rounded-2xl p-8 shadow-lg transition-all duration-300 ease-in-out border border-brand-white/20 backdrop-blur-md hover:transform hover:-translate-y-2 hover:shadow-xl",
  
  cardTitle: "text-xl font-bold text-brand-black mb-3 flex items-center gap-2",
  
  cardDescription: "text-brand-dark-gray leading-relaxed text-sm m-0",
  
  responsive: {
    main: "p-4 md:p-8",
    title: "text-4xl md:text-6xl",
    subtitle: "text-lg md:text-xl",
    grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8",
    card: "p-6 md:p-8",
    cardSmall: "p-5 md:p-6 lg:p-8"
  }
};

export const darkModeStyles = {
  page: "dark:from-brand-dark-blue dark:to-brand-purple",
  card: "dark:bg-brand-dark-blue dark:border-brand-dark-gray dark:text-brand-white",
  cardTitle: "dark:text-brand-white",
  cardDescription: "dark:text-brand-light-gray"
};
