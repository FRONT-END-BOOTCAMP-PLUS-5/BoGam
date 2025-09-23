export const styles = {
  container: 'space-y-6 mb-8',
  formTitle: 'text-2xl font-bold text-brand-black mb-6 text-center',
  
  // Form elements
  formGroup: 'space-y-2',
  formLabel: 'block text-sm font-medium text-brand-dark-gray',
  
  // Input wrapper for unit display
  inputWrapper: 'relative',
  inputWithUnit: 'pr-20',
  unitDisplay: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-brand-dark-gray font-medium',
  
  // Address display
  addressDisplay: 'p-4 bg-brand-light-gray rounded-lg',
  addressValue: 'text-lg font-medium text-brand-black',
  
  // Complex input
  complexInputGroup: 'flex items-center space-x-3',
  complexDisplay: 'flex-1 p-3 bg-brand-light-gray rounded-md text-brand-dark-gray',
  fetchButton: 'px-4 py-2 !mt-0',
  
  // Search button
  searchButtonContainer: 'text-center',
  searchButton: 'w-full px-6 py-3 text-lg font-medium',
  
  // Form hints and errors
  danjiHint: 'text-sm text-brand-error mt-1',
  complexError: 'text-sm text-brand-error mt-2 text-center',
  
  // Error container
  errorContainer: 'mt-4 p-3 bg-brand-error/10 border border-brand-error rounded-md',
  errorText: 'text-sm text-brand-error text-center',
} as const;
