import clsx from 'clsx';

export const getProfileClassName = (size: 'small' | 'medium') =>
  clsx(
    'rounded-full flex items-center justify-center bg-brand-gold text-brand-white font-bold font-sans',
    {
      'w-8 h-8 text-[1rem] ': size === 'small',
      'w-16 h-16 text-[1.5rem]': size === 'medium',
    }
  );
